<?php

/* indique où "vit" ce fichier */
namespace App\Controller;

/* indique l'utilisation du bon bundle pour gérer nos routes */

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;

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

    #[Route('/api/users/edit/{id}', methods: ['PATCH'], format: 'json')]
    public function updateUser(
        int $id, 
        Request $request, 
        UserRepository $userRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $token = $request->headers->get('Authorization');
        if (!$token) {
            return new JsonResponse(['message' => 'Authorization token missing'], 401);
        }

        $user = $userRepository->findOneBy(['token' => $token]);
        if (!$user) {
            return new JsonResponse(['message' => 'Invalid token'], 401);
        }

        if ($user && !($user->getIsAdmin() || $user->getId() === $id)) {
            return new JsonResponse(['message' => 'Access denied. You must be an administrator or own this account to proceed'], 403);
        }

        $content = $request->getContent();
        $data = json_decode($content, true);

        $userToUpdate = $userRepository->find($id);
        if (!$userToUpdate) {
            return new JsonResponse(['message' => 'User not found'], 404);
        }

        // Parcourir les modifications
        foreach ($data as $modification) {
            if (!isset($modification['modified'], $modification['value'])) {
                return new JsonResponse(['message' => 'Invalid data format'], 400);
            }

            switch ($modification['modified']) {
                case 'verified':
                    if ($modification['value'] === 'true'){
                        $userToUpdate->setIsVerified(true);
                    }
                    else {
                        $userToUpdate->setIsVerified(false);
                    }
                    break;
                case 'admin':
                    if ($modification['value'] === 'true'){
                        $userToUpdate->setRoles(['ROLE_ADMIN']);
                    }
                    else {
                        $userToUpdate->setRoles([]);
                    }
                    break;
                case 'username':
                    $userToUpdate->setUsername($modification['value']);
                    break;
                case 'email':
                    $userToUpdate->setEmail($modification['value']);
                    break;
                default:
                    return new JsonResponse(['message' => 'Invalid field: ' . $modification['modified']], 400);
            }
        }

        $entityManager->persist($userToUpdate);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'User updated',
            'user' => [
                'username' => $userToUpdate->getUsername(),
                'email' => $userToUpdate->getEmail(),
                'verified' => $userToUpdate->isVerified(),
                'admin' => $userToUpdate->getIsAdmin(),
            ]
        ], 200);
    }

}

