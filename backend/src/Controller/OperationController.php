<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Operation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
#[IsGranted('ROLE_USER')]
final class OperationController extends AbstractController
{
    #[Route('/operations', name: 'api_operations_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['label']) || !isset($data['amount'])) {
            return $this->json(['error' => 'label and amount are required'], 400);
        }

        $user = $this->getUser();
        $categoryTitle = $data['category'] ?? 'Other';

        $category = $em->getRepository(Category::class)->findOneBy([
            'title' => $categoryTitle,
            'user'  => $user,
        ]);

        if (!$category) {
            $category = new Category();
            $category->setTitle($categoryTitle);
            $category->setUser($user);
            $em->persist($category);
        }

        $operation = new Operation();
        $operation->setLabel($data['label']);
        $operation->setAmount((string) $data['amount']);
        $operation->setCategory($category);
        $operation->setUser($user);
        $operation->setDate(new \DateTime($data['date'] ?? 'now'));

        $em->persist($operation);
        $em->flush();

        return $this->json([
            'id'       => $operation->getId(),
            'label'    => $operation->getLabel(),
            'amount'   => $operation->getAmount(),
            'category' => $category->getTitle(),
            'date'     => $operation->getDate()->format('Y-m-d'),
        ], 201);
    }

    #[Route('/operations', name: 'api_operations_list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        $operations = $em->getRepository(Operation::class)->findBy(
            ['user' => $user],
            ['date' => 'DESC']
    );

        return $this->json(array_map(fn($op) => [
            'id'       => $op->getId(),
            'label'    => $op->getLabel(),
            'amount'   => $op->getAmount(),
            'category' => $op->getCategory()?->getTitle(),
            'date'     => $op->getDate()->format('Y-m-d'),
        ], $operations));
    }

    #[Route('/operations/{id}', name: 'api_operations_delete', methods: ['DELETE'])]
    public function delete(Operation $operation, EntityManagerInterface $em): JsonResponse
    {
        // Vérifie que l'opération appartient bien à l'utilisateur connecté
        if ($operation->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Forbidden'], 403);
    }

        $em->remove($operation);
        $em->flush();

        return $this->json(null, 204);
    }

    #[Route('/operations/{id}', name: 'api_operations_update', methods: ['PUT'])]
    public function update(Operation $operation, Request $request, EntityManagerInterface $em): JsonResponse
    {
        if ($operation->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Forbidden'], 403);
    }

        $data = json_decode($request->getContent(), true);
        $categoryTitle = $data['category'] ?? 'Other';

        $category = $em->getRepository(Category::class)->findOneBy([
            'title' => $categoryTitle,
            'user'  => $this->getUser(),
    ]);
        if (!$category) {
            $category = new Category();
            $category->setTitle($categoryTitle);
            $category->setUser($this->getUser());
            $em->persist($category);
    }

        $operation->setLabel($data['label']);
        $operation->setAmount((string) $data['amount']);
        $operation->setCategory($category);
        $operation->setDate(new \DateTime($data['date']));
        $em->flush();

        return $this->json([
            'id'       => $operation->getId(),
            'label'    => $operation->getLabel(),
            'amount'   => $operation->getAmount(),
            'category' => $category->getTitle(),
            'date'     => $operation->getDate()->format('Y-m-d'),
    ]);
    }
}