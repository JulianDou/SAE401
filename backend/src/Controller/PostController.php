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

/* le nom de la classe doit être cohérent avec le nom du fichier */
class PostController extends AbstractController
{

    #[Route('/api/posts', methods: ['GET'], format: 'json')]
    public function index(PostRepository $postRepository, Request $request, SerializerInterface $serializer): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $offset = 50 * ($page - 1);

        $paginator = $postRepository->findAllLatest($offset, 50);

        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = count($paginator) === 50 ? $page + 1 : null;

        // Sérialiser les données avec le groupe "post:read"
        $posts = $serializer->serialize($paginator, 'json', [
            AbstractNormalizer::GROUPS => ['post:read'],
        ]);

        return JsonResponse::fromJsonString($posts);
    }

    #[Route('/api/posts/{id}', methods: ['GET'], format: 'json')]
    public function get(PostRepository $postRepository, int $id, SerializerInterface $serializer): JsonResponse
    {
        $post = $postRepository->find($id);
        $res = $serializer->serialize($post, 'json');
        return JsonResponse::fromJsonString($res);
    }

}

