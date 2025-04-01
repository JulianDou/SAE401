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
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Post;
use Doctrine\ORM\EntityManager;

/* le nom de la classe doit être cohérent avec le nom du fichier */
class PostController extends AbstractController
{

    #[Route('/api/posts', methods: ['GET'], format: 'json')]
    public function index(
        UserRepository $userRepository,
        PostRepository $postRepository, 
        Request $request, 
        SerializerInterface $serializer
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

        $page = max(1, (int) $request->query->get('page', 1));
        $offset = 50 * ($page - 1);

        $paginator = $postRepository->findAllLatest($offset, 50);

        foreach ($paginator as $post) {
            if ($post->getAuthor()->isBanned()){
                $post->setText('This user has been banned. As such, their posts are no longer visible.');
            }
            if ($post->getAuthor()->getId() === $user->getId()) {
                $post->setBelongsToUser(true);
                // Data NOT flushed on purpose to avoid changes being saved to database
            }
        }
        
        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = count($paginator) === 50 ? $page + 1 : null;

        // Sérialiser les données avec le groupe "post:read"
        $posts = $serializer->serialize($paginator, 'json', [
            AbstractNormalizer::GROUPS => ['post:read'],
        ]);

        return JsonResponse::fromJsonString($posts);
    }

    #[Route('/api/posts', methods: ['POST'], format: 'json')]
    public function post(
        PostRepository $postRepository,
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

        $content = $request->getContent();
        $data = json_decode($content, true);

        $post = new Post();
        $post->setAuthor($user);
        $post->setText($data['text']);
        $post->setTime(new \DateTime());
        $post->setBelongsToUser(false);

        $entityManager->persist($post);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Your post has been created.'], 201);
    }

    #[Route('/api/posts/followed', methods: ['GET'], format: 'json')]
    public function getFollowedPosts(
        PostRepository $postRepository,
        UserRepository $userRepository,
        Request $request,
        SerializerInterface $serializer
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

        $followedUsers = $user->getFollows();
        $followedPosts = [];
        foreach ($followedUsers as $followedUser) {
            $posts = $postRepository->findBy(['author' => $followedUser]);
            $followedPosts = array_merge($followedPosts, $posts);
        }

        $serializedPosts = $serializer->serialize($followedPosts, 'json', [
            AbstractNormalizer::GROUPS => ['post:read'],
        ]);

        return JsonResponse::fromJsonString($serializedPosts);
    }

    #[Route('/api/posts/{id}', methods: ['GET'], format: 'json')]
    public function get(PostRepository $postRepository, int $id, SerializerInterface $serializer): JsonResponse
    {
        $post = $postRepository->find($id);
        $res = $serializer->serialize($post, 'json');
        return JsonResponse::fromJsonString($res);
    }

    #[Route('/api/posts/{id}', methods: ['DELETE'], format: 'json')]
    public function delete(
        int $id,
        PostRepository $postRepository,
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

        $post = $postRepository->find($id);
        if (!$post) {
            return new JsonResponse(['message' => 'Post not found.'], 404);
        }

        if ($post->getAuthor()->getId() !== $user->getId()) {
            return new JsonResponse(['message' => 'You are not the author of this post.'], 403);
        }

        $entityManager->remove($post);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Post deleted.'], 200);
    }

    #[Route('/api/posts/{id}/likemanager', methods: ['PATCH'], format: 'json')]
    public function like(
        int $id,
        Request $request,
        PostRepository $postRepository,
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

        $post = $postRepository->find($id);
        if (!$post) {
            return new JsonResponse(['message' => 'Post not found.'], 404);
        }

        if ($post->isLikedBy($user)) {
            $post->removeLike($user);

            $entityManager->persist($post);
            $entityManager->flush();
            return new JsonResponse(['message' => 'Post unliked.', 'status' => 'removed'], 200);
        } else {
            $post->addLike($user);

            $entityManager->persist($post);
            $entityManager->flush();
            return new JsonResponse(['message' => 'Post liked.', 'status' => 'added'], 200);
        }
    }

}

