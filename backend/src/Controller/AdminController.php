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
class AdminController extends AbstractController
{

    #[Route('/api/admin', methods: ['GET'], format: 'json')]
    public function index(Request $request, UserRepository $userRepository,): JsonResponse
    {
        $token = $request->headers->get('Authorization');
        if (!$token) {
            return new JsonResponse(['message' => 'Authorization token missing'], 401);
        }

        $user = $userRepository->findOneBy(['token' => $token]);
        if (!$user) {
            return new JsonResponse(['message' => 'Invalid token'], 401);
        }
        if ($user && !$user->getIsAdmin()) {
            return new JsonResponse(['message' => 'Access denied. You must be an administrator to access this page'], 403);
        }
        
        return new JsonResponse(['message' => 'Welcome ' . $user->getUsername()]);
    }

}

