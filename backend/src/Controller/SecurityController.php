<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Attribute\Route;


class SecurityController extends AbstractController
{
  #[Route('/api/login', name: 'api_login', methods: ['POST'])]
        public function login(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        return $this->json([
            'message' => 'Login successful',
            'email' => $data['email'],
    ]);
}
}