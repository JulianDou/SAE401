<?php

/* indique où "vit" ce fichier */
namespace App\Controller;

/* indique l'utilisation du bon bundle pour gérer nos routes */

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;

/* le nom de la classe doit être cohérent avec le nom du fichier */
class UserController extends AbstractController
{

    #[Route('/api/user/{id}', methods: ['GET'], format: 'json')]
    public function index(int $id, Request $request, UserRepository $userRepository,): JsonResponse
    {
        $token = $request->headers->get('Authorization');
        if (!$token) {
            return $this->json(['error' => 'Authorization token missing'], 401);
        }

        $user = $userRepository->findOneBy(['token' => $token]);
        if (!$user) {
            return $this->json(['error' => 'Invalid token'], 401);
        }
        
        $user = $userRepository->find($id);
        $user_safe = [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
        ];
        return $this->json($user_safe);
    }

    #[Route('/api/users', methods: ['GET'], format: 'json')]
    public function getAllUsers(Request $request, UserRepository $userRepository): JsonResponse
    {
        $token = $request->headers->get('Authorization');
        if (!$token) {
            return $this->json(['error' => 'Authorization token missing'], 401);
        }

        $user = $userRepository->findOneBy(['token' => $token]);
        if (!$user) {
            return $this->json(['error' => 'Invalid token'], 401);
        }
        if ($user && !$user->getIsAdmin()) {
            return $this->json(['error' => 'Access denied. You must be an administrator to access this page'], 403);
        }
        
        $users = $userRepository->findAll();
        $users_safe = [];
        foreach ($users as $user) {
            $users_safe[] = [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'verified' => $user->isVerified(),
                'admin' => $user->getIsAdmin(),
            ];
        }
        return $this->json($users_safe);
    }

}

