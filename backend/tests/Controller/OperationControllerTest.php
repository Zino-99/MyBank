<?php

namespace App\Tests\Controller;

use App\Entity\User;
use App\Entity\Operation;
use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class OperationControllerTest extends WebTestCase
{
    private $client;
    private EntityManagerInterface $em;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->em = static::getContainer()->get(EntityManagerInterface::class);

        // Désactiver la reuse de kernel entre tests pour isolation
        $this->client->disableReboot();
    }

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private function createUser(string $email = 'test@mybank.fr', string $password = 'hashed_password'): User
    {
        $user = new User();
        $user->setEmail($email);
        $user->setPassword($password); // mot de passe déjà hashé en base
        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }

    private function loginAs(User $user): void
    {
        $this->client->loginUser($user);
    }

    private function jsonRequest(string $method, string $uri, array $body = []): void
    {
        $this->client->request(
            $method,
            $uri,
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            $body ? json_encode($body) : null
        );
    }

    // ─── Tests : POST /api/operations ───────────────────────────────────────────

    public function testCreateOperationReturns201(): void
    {
        $user = $this->createUser();
        $this->loginAs($user);

        $this->jsonRequest('POST', '/api/operations', [
            'label'    => 'Courses Monoprix',
            'amount'   => -45.50,
            'category' => 'Alimentation',
            'date'     => '2024-06-01',
        ]);

        $response = $this->client->getResponse();
        $this->assertResponseStatusCodeSame(201);

        $data = json_decode($response->getContent(), true);
        $this->assertSame('Courses Monoprix', $data['label']);
        $this->assertSame('Alimentation', $data['category']);
        $this->assertSame('2024-06-01', $data['date']);
    }

    public function testCreateOperationCreatesDefaultCategoryIfMissing(): void
    {
        $user = $this->createUser('nocat@mybank.fr');
        $this->loginAs($user);

        $this->jsonRequest('POST', '/api/operations', [
            'label'  => 'Sans catégorie',
            'amount' => 100,
            // pas de 'category'
        ]);

        $this->assertResponseStatusCodeSame(201);
        $data = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertSame('Other', $data['category']);
    }

    public function testCreateOperationReturns400WhenLabelMissing(): void
    {
        $user = $this->createUser('err@mybank.fr');
        $this->loginAs($user);

        $this->jsonRequest('POST', '/api/operations', [
            'amount' => 50,
        ]);

        $this->assertResponseStatusCodeSame(400);
    }

    public function testCreateOperationRequiresAuth(): void
    {
        $this->jsonRequest('POST', '/api/operations', [
            'label'  => 'Ghost',
            'amount' => 10,
        ]);

        // Non authentifié → 401
        $this->assertResponseStatusCodeSame(401);
    }

    // ─── Tests : GET /api/operations ────────────────────────────────────────────

    public function testListReturnsOnlyUserOperations(): void
    {
        $user1 = $this->createUser('user1@mybank.fr');
        $user2 = $this->createUser('user2@mybank.fr');

        // Créer 2 opérations pour user1, 1 pour user2
        foreach (['Loyer', 'Internet'] as $label) {
            $this->loginAs($user1);
            $this->jsonRequest('POST', '/api/operations', ['label' => $label, 'amount' => 100]);
        }

        $this->loginAs($user2);
        $this->jsonRequest('POST', '/api/operations', ['label' => 'Courses', 'amount' => 50]);

        // Vérifier que user1 ne voit que ses 2 opérations
        $this->loginAs($user1);
        $this->client->request('GET', '/api/operations');
        $this->assertResponseIsSuccessful();

        $data = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertCount(2, $data);
    }

    public function testListRequiresAuth(): void
    {
        $this->client->request('GET', '/api/operations');
        $this->assertResponseStatusCodeSame(401);
    }

    // ─── Tests : DELETE /api/operations/{id} ────────────────────────────────────

    public function testDeleteOperationReturns204(): void
    {
        $user = $this->createUser('del@mybank.fr');
        $this->loginAs($user);

        // Créer une opération
        $this->jsonRequest('POST', '/api/operations', ['label' => 'À supprimer', 'amount' => 20]);
        $id = json_decode($this->client->getResponse()->getContent(), true)['id'];

        // Supprimer
        $this->client->request('DELETE', "/api/operations/{$id}");
        $this->assertResponseStatusCodeSame(204);
    }

    public function testDeleteOperationForbiddenForOtherUser(): void
    {
        $owner  = $this->createUser('owner@mybank.fr');
        $hacker = $this->createUser('hacker@mybank.fr');

        // owner crée une opération
        $this->loginAs($owner);
        $this->jsonRequest('POST', '/api/operations', ['label' => 'Privée', 'amount' => 99]);
        $id = json_decode($this->client->getResponse()->getContent(), true)['id'];

        // hacker essaie de la supprimer
        $this->loginAs($hacker);
        $this->client->request('DELETE', "/api/operations/{$id}");
        $this->assertResponseStatusCodeSame(403);
    }

    // ─── Tests : PUT /api/operations/{id} ───────────────────────────────────────

    public function testUpdateOperation(): void
    {
        $user = $this->createUser('upd@mybank.fr');
        $this->loginAs($user);

        $this->jsonRequest('POST', '/api/operations', ['label' => 'Avant', 'amount' => 10, 'date' => '2024-01-01']);
        $id = json_decode($this->client->getResponse()->getContent(), true)['id'];

        $this->jsonRequest('PUT', "/api/operations/{$id}", [
            'label'    => 'Après',
            'amount'   => 20,
            'category' => 'Loisirs',
            'date'     => '2024-06-15',
        ]);

        $this->assertResponseIsSuccessful();
        $data = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertSame('Après', $data['label']);
        $this->assertSame('Loisirs', $data['category']);
        $this->assertSame('2024-06-15', $data['date']);
    }

    public function testUpdateOperationForbiddenForOtherUser(): void
    {
        $owner  = $this->createUser('owner2@mybank.fr');
        $hacker = $this->createUser('hacker2@mybank.fr');

        $this->loginAs($owner);
        $this->jsonRequest('POST', '/api/operations', ['label' => 'Privée', 'amount' => 50, 'date' => '2024-01-01']);
        $id = json_decode($this->client->getResponse()->getContent(), true)['id'];

        $this->loginAs($hacker);
        $this->jsonRequest('PUT', "/api/operations/{$id}", [
            'label'  => 'Hacked',
            'amount' => 0,
            'date'   => '2024-01-01',
        ]);

        $this->assertResponseStatusCodeSame(403);
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        // Nettoyage pour éviter les conflits entre tests
        $this->em->createQuery('DELETE FROM App\Entity\Operation')->execute();
        $this->em->createQuery('DELETE FROM App\Entity\Category')->execute();
        $this->em->createQuery('DELETE FROM App\Entity\User')->execute();
    }
}