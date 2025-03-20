<?php

/* indique où "vit" ce fichier */
namespace App\Controller;

/* indique l'utilisation du bon bundle pour gérer nos routes */

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\User;
use App\Repository\UserRepository;

/* le nom de la classe doit être cohérent avec le nom du fichier */
class SecurityController extends AbstractController
{

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(
        Request $request, 
        SerializerInterface $serializer,
        UserRepository $user_repository
    ): JsonResponse
    {
        $content = $request->getContent();
        $data = json_decode($content, true);

        if ($data === null){
            return new JsonResponse(['error' => 'An error occurred.'], 400);
        }

        $user = $user_repository->findByEmail($data['email']);
        if (!$user){
            return new JsonResponse(['error' => 'No user was found with the provided email.'], 400);
        }

        $checkpwd = $user_repository->checkPassword($user, $data['password']);
        if (!$checkpwd){
            return new JsonResponse(['error' => 'Invalid password.'], 400);
        }

        return new JsonResponse(['token' => '1234567890'], 200);
    }

    #[Route('/signup', name: 'signup', methods: ['POST'])]
    public function signup(
        Request $request, 
        SerializerInterface $serializer, 
        UserRepository $user_repository, 
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse
    {
        $content = $request->getContent();
        $data = json_decode($content, true);

        if ($data === null){
            return new JsonResponse(['error' => 'An error occurred.'], 400);
        }

        $checkUsername = $user_repository->findByUsername($data['username']);
        if ($checkUsername !== null){
            return new JsonResponse(['error' => 'Username already exists.'], 400);
        }

        $checkEmail = $user_repository->findByEmail($data['email']);
        if ($checkEmail !== null){
            return new JsonResponse(['error' => 'Email already exists.'], 400);
        }

        $hashedpwd = $passwordHasher->hashPassword(new User(), $data['password']);

        $user_repository->addUser($data['username'], $data['email'], $hashedpwd);

        return new JsonResponse(['token' => '1234567890'], 201);
    }

}

