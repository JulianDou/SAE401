<?php

/* indique où "vit" ce fichier */
namespace App\Controller;

/* indique l'utilisation du bon bundle pour gérer nos routes */

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;

/* le nom de la classe doit être cohérent avec le nom du fichier */
class SecurityController extends AbstractController
{

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, SerializerInterface $serializer): JsonResponse
    {
        $content = $request->getContent();
        $data = json_decode($content, true);

        if ($data === null){
            return new JsonResponse(['error' => 'Invalid JSON'], 400);
        }

        return new JsonResponse(['token' => '1234567890'], 200);
    }

    #[Route('/signup', name: 'signup', methods: ['POST'])]
    public function signup(Request $request, SerializerInterface $serializer): JsonResponse
    {
        $content = $request->getContent();
        $data = json_decode($content, true);

        if ($data === null){
            return new JsonResponse(['error' => 'Invalid JSON'], 400);
        }

        return new JsonResponse(['token' => '1234567890'], 201);
    }

}

