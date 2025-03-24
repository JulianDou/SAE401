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
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;

/* le nom de la classe doit être cohérent avec le nom du fichier */
class SecurityController extends AbstractController
{

    #[Route('/api/login', name: 'login', methods: ['POST'])]
    public function login(
        Request $request,
        UserRepository $user_repository
    ): JsonResponse
    {
        $content = $request->getContent();
        $data = json_decode($content, true);

        if ($data === null) {
            return new JsonResponse(['message' => "An unexpected error occured."], 400);
        }

        $user = $user_repository->findOneBy(['email' => $data['email']]);
        if (!$user) {
            return new JsonResponse(['message' => "No user was found with the provided email."], 400);
        }

        $checkpwd = $user_repository->checkPassword($user, $data['password']);
        if (!$checkpwd) {
            return new JsonResponse(['message' => "Invalid password."], 403);
        }
        
        if ($user->isVerified() === false) {
            return new JsonResponse(['message' => "You are not yet verified. Check your emails ?"], 403);
        }

        $token = bin2hex(random_bytes(16));
        $user_repository->setToken($user, $token);
        $tokenTime = time();

        $response = new JsonResponse(['token' => $token, 'time' => $tokenTime, 'userid' => $user->getId()]);

        return $response;
    }

    // ---== Old signup, moved to RegistrationController.php ==---
    // #[Route('/api/signup', name: 'signup', methods: ['POST'])]
    // public function signup(
    //     Request $request,
    //     UserRepository $user_repository, 
    //     UserPasswordHasherInterface $passwordHasher
    // ): JsonResponse
    // {
    //     $content = $request->getContent();
    //     $data = json_decode($content, true);

    //     if ($data === null) {
    //         return new JsonResponse(['message' => 'An error occurred.'], 400);
    //     }

    //     $checkUsername = $user_repository->findOneBy(['username' => $data['username']]);
    //     if ($checkUsername !== null) {
    //         return new JsonResponse(['message' => 'Username already exists.'], 400);
    //     }

    //     $checkEmail = $user_repository->findOneBy(['email' => $data['email']]);
    //     if ($checkEmail !== null) {
    //         return new JsonResponse(['message' => 'Email already exists.'], 400);
    //     }

    //     $hashedpwd = $passwordHasher->hashPassword(new User(), $data['password']);
    //     $user_repository->addUser($data['username'], $data['email'], $hashedpwd);
    //     $user = $user_repository->findByEmail($data['email']);

    //     $token = bin2hex(random_bytes(16));
    //     $user_repository->setToken($user, $token);
    //     $tokenTime = time();

    //     $response = new JsonResponse(['token' => $token, 'time' => $tokenTime, 'userid' => $user->getId()]);

    //     return $response;
    // }

}

