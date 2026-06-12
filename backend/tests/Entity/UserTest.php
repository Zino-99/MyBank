<?php

namespace App\Tests\Entity;

use App\Entity\Operation;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        $this->user = new User();
    }

    // ─── Id ─────────────────────────────────────────────────────────────────────

    public function testIdIsNullByDefault(): void
    {
        $this->assertNull($this->user->getId());
    }

    // ─── Email ───────────────────────────────────────────────────────────────────

    public function testSetAndGetEmail(): void
    {
        $this->user->setEmail('yacine@mybank.fr');
        $this->assertSame('yacine@mybank.fr', $this->user->getEmail());
    }

    public function testEmailIsNullByDefault(): void
    {
        $this->assertNull($this->user->getEmail());
    }

    public function testGetUserIdentifierReturnsEmail(): void
    {
        $this->user->setEmail('yacine@mybank.fr');
        $this->assertSame('yacine@mybank.fr', $this->user->getUserIdentifier());
    }

    // ─── Password ────────────────────────────────────────────────────────────────

    public function testSetAndGetPassword(): void
    {
        $this->user->setPassword('hashed_password');
        $this->assertSame('hashed_password', $this->user->getPassword());
    }

    public function testPasswordIsNullByDefault(): void
    {
        $this->assertNull($this->user->getPassword());
    }

    // ─── Roles ───────────────────────────────────────────────────────────────────

    public function testAlwaysHasRoleUser(): void
    {
        // Même sans setRoles(), ROLE_USER est garanti
        $this->assertContains('ROLE_USER', $this->user->getRoles());
    }

    public function testSetAndGetRoles(): void
    {
        $this->user->setRoles(['ROLE_ADMIN']);
        $this->assertContains('ROLE_ADMIN', $this->user->getRoles());
        $this->assertContains('ROLE_USER', $this->user->getRoles());
    }

    public function testRolesAreUnique(): void
    {
        $this->user->setRoles(['ROLE_USER', 'ROLE_USER']);
        $roles = $this->user->getRoles();
        $this->assertSame($roles, array_unique($roles));
    }

    // ─── Operations ──────────────────────────────────────────────────────────────

    public function testOperationsCollectionIsEmptyByDefault(): void
    {
        $this->assertCount(0, $this->user->getOperations());
    }

    public function testAddOperation(): void
    {
        $operation = new Operation();
        $this->user->addOperation($operation);

        $this->assertCount(1, $this->user->getOperations());
        $this->assertSame($this->user, $operation->getUser());
    }

    public function testAddSameOperationTwiceDoesNotDuplicate(): void
    {
        $operation = new Operation();
        $this->user->addOperation($operation);
        $this->user->addOperation($operation);

        $this->assertCount(1, $this->user->getOperations());
    }

    public function testRemoveOperation(): void
    {
        $operation = new Operation();
        $this->user->addOperation($operation);
        $this->user->removeOperation($operation);

        $this->assertCount(0, $this->user->getOperations());
        $this->assertNull($operation->getUser());
    }

    // ─── Serialize ───────────────────────────────────────────────────────────────

    public function testSerializeHashesPassword(): void
    {
        $this->user->setPassword('my_secret');
        $serialized = $this->user->__serialize();

        $passwordKey = "\0" . User::class . "\0password";
        $this->assertArrayHasKey($passwordKey, $serialized);
        // Le mot de passe doit être hashé, pas en clair
        $this->assertNotSame('my_secret', $serialized[$passwordKey]);
        $this->assertSame(hash('crc32c', 'my_secret'), $serialized[$passwordKey]);
    }

    // ─── Fluent interface ────────────────────────────────────────────────────────

    public function testSetEmailReturnsStatic(): void
    {
        $this->assertInstanceOf(User::class, $this->user->setEmail('a@b.fr'));
    }

    public function testSetPasswordReturnsStatic(): void
    {
        $this->assertInstanceOf(User::class, $this->user->setPassword('pass'));
    }

    public function testSetRolesReturnsStatic(): void
    {
        $this->assertInstanceOf(User::class, $this->user->setRoles([]));
    }
}