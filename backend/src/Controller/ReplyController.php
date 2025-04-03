<?php

/* indique où "vit" ce fichier */
namespace App\Controller;

/* indique l'utilisation du bon bundle pour gérer nos routes */

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use App\Repository\PostRepository;
use App\Repository\UserRepository;
use App\Repository\ReplyRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Post;
use App\Entity\Reply;
use Doctrine\ORM\EntityManager;

/* le nom de la classe doit être cohérent avec le nom du fichier */
class ReplyController extends AbstractController
{

    #[Route('/api/reply/to/{id}', methods: ['POST'], format: 'json')]
    public function post(
        int $id,
        PostRepository $postRepository,
        ReplyRepository $replyRepository,
        UserRepository $userRepository,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $token = $request->headers->get('Authorization');
        if (!$token) {
            return new JsonResponse(['message' => 'Authorization token missing. Try logging in ?'], 401);
        }

        $user = $userRepository->findOneBy(['token' => $token]);
        if (!$user) {
            return new JsonResponse(['message' => 'Authorization token invalid. Try logging in ?'], 401);
        }

        if ($user->isBanned()) {
            return new JsonResponse(['message' => 'You are banned. You cannot reply.'], 403);
        }

        $parentPost = $postRepository->find($id);
        if (!$parentPost) {
            return new JsonResponse(['message' => 'Post not found.'], 404);
        }

        // Check if the user is blocked by the post author
        if (
            in_array($user, $parentPost->getAuthor()->getBlockedUsers()->toArray())
        ){
            return new JsonResponse(['message' => 'You are blocked by the author of this post. You cannot reply to it.'], 403);
        }

        $content = $request->getContent();
        $data = json_decode($content, true);

        $reply = new Reply();
        $reply->setAuthor($user);
        $reply->setText($data['text']);
        $reply->setTime(new \DateTime());
        $reply->setBelongsToUser(false);
        $reply->setUserBlockedByAuthor(false);

        $parentPost->addReply($reply);
        $entityManager->persist($parentPost);
        $entityManager->flush();

        $entityManager->persist($reply);
        $entityManager->flush();


        return new JsonResponse(['message' => 'Your post has been created.'], 201);
    }

    

    #[Route('/api/reply/{id}', methods: ['GET'], format: 'json')]
    public function get(ReplyRepository $replyRepository, int $id, SerializerInterface $serializer): JsonResponse
    {
        $reply = $replyRepository->find($id);
        $res = $serializer->serialize($reply, 'json');
        return JsonResponse::fromJsonString($res);
    }

    #[Route('/api/reply/{id}', methods: ['PATCH'], format: 'json')]
    public function edit(
        int $id,
        ReplyRepository $replyRepository,
        UserRepository $userRepository,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $token = $request->headers->get('Authorization');
        if (!$token) {
            return new JsonResponse(['message' => 'Authorization token missing. Try logging in ?'], 401);
        }

        $user = $userRepository->findOneBy(['token' => $token]);
        if (!$user) {
            return new JsonResponse(['message' => 'Authorization token invalid. Try logging in ?'], 401);
        }

        $reply = $replyRepository->find($id);
        if (!$reply) {
            return new JsonResponse(['message' => 'Reply not found.'], 404);
        }

        if ($reply->getAuthor()->getId() !== $user->getId()) {
            return new JsonResponse(['message' => 'You are not the author of this reply.'], 403);
        }

        $content = $request->getContent();
        $data = json_decode($content, true);

        if (isset($data['text'])) {
            $reply->setText($data['text']);
            $entityManager->persist($reply);
            $entityManager->flush();
            return new JsonResponse(['message' => 'Reply updated.', 'text' => $reply->getText()], 200);
        }

        return new JsonResponse(['message' => 'No data to update.'], 400);
    }

    #[Route('/api/reply/{id}', methods: ['DELETE'], format: 'json')]
    public function delete(
        int $id,
        ReplyRepository $replyRepository,
        UserRepository $userRepository,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $token = $request->headers->get('Authorization');
        if (!$token) {
            return new JsonResponse(['message' => 'Authorization token missing. Try logging in ?'], 401);
        }

        $user = $userRepository->findOneBy(['token' => $token]);
        if (!$user) {
            return new JsonResponse(['message' => 'Authorization token invalid. Try logging in ?'], 401);
        }

        $reply = $replyRepository->find($id);
        if (!$reply) {
            return new JsonResponse(['message' => 'Reply not found.'], 404);
        }

        if ($reply->getAuthor()->getId() !== $user->getId()) {
            return new JsonResponse(['message' => 'You are not the author of this reply.'], 403);
        }

        $entityManager->remove($reply);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Reply deleted.'], 200);
    }

    #[Route('/api/reply/{id}/likemanager', methods: ['PATCH'], format: 'json')]
    public function like(
        int $id,
        Request $request,
        ReplyRepository $replyRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager
    )
    {
        $token = $request->headers->get('Authorization');
        if (!$token) {
            return new JsonResponse(['message' => 'Authorization token missing. Try logging in ?'], 401);
        }

        $user = $userRepository->findOneBy(['token' => $token]);
        if (!$user) {
            return new JsonResponse(['message' => 'Authorization token invalid. Try logging in ?'], 401);
        }

        $reply = $replyRepository->find($id);
        if (!$reply) {
            return new JsonResponse(['message' => 'Reply not found.'], 404);
        }

        // Check if the user is blocked by the reply author
        if (
            in_array($user, $reply->getAuthor()->getBlockedUsers()->toArray())
        ){
            return new JsonResponse(['message' => 'You are blocked by the author of this reply.'], 403);
        }

        if ($reply->isLikedBy($user)) {
            $reply->removeLike($user);

            $entityManager->persist($reply);
            $entityManager->flush();
            return new JsonResponse(['message' => 'Reply unliked.', 'status' => 'removed'], 200);
        } else {
            $reply->addLike($user);

            $entityManager->persist($reply);
            $entityManager->flush();
            return new JsonResponse(['message' => 'Reply liked.', 'status' => 'added'], 200);
        }
    }

}

