<?php

namespace App\Controller;

use App\Entity\Expense;
use App\Repository\ExpenseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/expenses')]
class ExpenseController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(ExpenseRepository $repo): JsonResponse
    {
        $expenses = $repo->findAll();
        $data = array_map(fn($e) => [
            'id' => $e->getId(),
            'label' => $e->getLabel(),
            'amount' => $e->getAmount(),
            'date' => $e->getDate()->format('Y-m-d'),
            'category' => $e->getCategory(),
        ], $expenses);
        return $this->json($data);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(int $id, ExpenseRepository $repo): JsonResponse
    {
        $expense = $repo->find($id);
        if (!$expense) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }
        return $this->json([
            'id' => $expense->getId(),
            'label' => $expense->getLabel(),
            'amount' => $expense->getAmount(),
            'date' => $expense->getDate()->format('Y-m-d'),
            'category' => $expense->getCategory(),
        ]);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['label'])) {
            return $this->json(['error' => 'Label is required'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        if (!isset($data['amount'])) {
            return $this->json(['error' => 'Amount is required'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $expense = new Expense();
        $expense->setLabel($data['label']);
        $expense->setAmount($data['amount']);
        $expense->setDate(new \DateTime($data['date'] ?? 'now'));
        $expense->setCategory($data['category'] ?? '');

        $em->persist($expense);
        $em->flush();

        return $this->json([
            'id' => $expense->getId(),
            'label' => $expense->getLabel(),
            'amount' => $expense->getAmount(),
            'date' => $expense->getDate()->format('Y-m-d'),
            'category' => $expense->getCategory(),
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(int $id, Request $request, ExpenseRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $expense = $repo->find($id);
        if (!$expense) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (isset($data['label'])) $expense->setLabel($data['label']);
        if (isset($data['amount'])) $expense->setAmount($data['amount']);
        if (isset($data['date'])) $expense->setDate(new \DateTime($data['date']));
        if (isset($data['category'])) $expense->setCategory($data['category']);

        $em->flush();

        return $this->json([
            'id' => $expense->getId(),
            'label' => $expense->getLabel(),
            'amount' => $expense->getAmount(),
            'date' => $expense->getDate()->format('Y-m-d'),
            'category' => $expense->getCategory(),
        ]);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id, ExpenseRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $expense = $repo->find($id);
        if (!$expense) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($expense);
        $em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
