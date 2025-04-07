<?php

/* indique où "vit" ce fichier */
namespace App\Controller;

/* indique l'utilisation du bon bundle pour gérer nos routes */

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UserRepository;
use App\Repository\PostRepository;
use App\Repository\ReplyRepository;
use Doctrine\ORM\EntityManagerInterface;
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

    #[Route('/api/admin/posts/{id}/censor', methods: ['PATCH'], format: 'json')]
    public function censorPost(
        Request $request, 
        UserRepository $userRepository, 
        PostRepository $postRepository,
        EntityManagerInterface $entityManager,
        int $id
        ): JsonResponse
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

        $post = $postRepository->find($id);
        if (!$post) {
            return new JsonResponse(['message' => 'Post not found'], 404);
        }

        $censored = $post->isCensored();
        if ($censored) {
            $post->setIsCensored(false);
        }
        else {
            $post->setIsCensored(true);
        }

        $entityManager->persist($post);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Post ' . ($censored ? 'uncensored' : 'censored'), 'status' => $post->isCensored()]);
    }

    #[Route('/api/admin/replies/{id}/censor', methods: ['PATCH'], format: 'json')]
    public function censorReply(
        Request $request, 
        UserRepository $userRepository, 
        ReplyRepository $replyRepository,
        EntityManagerInterface $entityManager,
        int $id
        ): JsonResponse
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

        $reply = $replyRepository->find($id);
        if (!$reply) {
            return new JsonResponse(['message' => 'Reply not found'], 404);
        }

        $censored = $reply->isCensored();
        if ($censored) {
            $reply->setIsCensored(false);
        }
        else {
            $reply->setIsCensored(true);
        }

        $entityManager->persist($reply);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Reply ' . ($censored ? 'uncensored' : 'censored'), 'status' => $reply->isCensored()]);
    }

}

