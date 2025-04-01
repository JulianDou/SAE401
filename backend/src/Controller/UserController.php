<?php

/* indique où "vit" ce fichier */
namespace App\Controller;

/* indique l'utilisation du bon bundle pour gérer nos routes */

use App\Repository\PostRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

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

    // route for admins
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
                'banned' => $user->isBanned(),
            ];
        }
        return $this->json($users_safe);
    }

    #[Route('/api/users/edit/{id}', methods: ['PATCH'], format: 'json')]
    public function updateUser(
        int $id, 
        Request $request, 
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
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

        // Vérifier si les champs uniques sont déjà utilisés
        // Fait avant les modifications pour éviter de changer d'autres infos tout en retournant une erreur
        // (par exemple en changeant vers un email libre puis en essayant de changer vers un pseudo déjà pris)
        foreach ($data as $modification) {
            if ($modification['modified'] === 'username') {
                $existingUser = $userRepository->findOneBy(['username' => $modification['value']]);
                if ($existingUser && $existingUser->getId() !== $userToUpdate->getId()) {
                    return new JsonResponse(['message' => 'Username already taken'], 400);
                }
            }
            if ($modification['modified'] === 'email') {
                $existingUser = $userRepository->findOneBy(['email' => $modification['value']]);
                if ($existingUser && $existingUser->getId() !== $userToUpdate->getId()) {
                    return new JsonResponse(['message' => 'Email already taken'], 400);
                }
            }
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
                case 'banned':
                    if ($modification['value'] === 'true'){
                        $userToUpdate->removeToken();
                        $userToUpdate->setBanned(true);
                    }
                    else {
                        $userToUpdate->setBanned(false);
                    }
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
                'banned' => $userToUpdate->isBanned(),
            ]
        ], 200);
    }

    #[Route('/api/profile/{username}/posts', methods: ['GET'], format: 'json')]
    public function getProfilePosts(
        string $username,
        Request $request,
        UserRepository $userRepository,
        PostRepository $postRepository,
        SerializerInterface $serializer
    ): JsonResponse 
    {
        $token = $request->headers->get('Authorization');
        if (!$token) {
            return $this->json(['error' => 'Authorization token missing'], 401);
        }

        $user = $userRepository->findOneBy(['token' => $token]);
        if (!$user) {
            return $this->json(['error' => 'Invalid token'], 401);
        }

        $targetUser = $userRepository->findOneBy(['username' => $username]);

        if (!$targetUser) {
            return $this->json(['error' => 'User not found'], 404);
        }

        if (!$targetUser->isBanned()){
            $posts = $postRepository->findBy(['author' => $targetUser->getId()]);    
        }
        else {
            $posts = [];
        }

        foreach ($posts as $post) {
            if ($targetUser->getId( ) === $user->getId()) {
                $post->setBelongsToUser(true);
            }
            else {
                // Check if the user is blocked by the target user        
                $blockedClient = $targetUser->getBlockedUsers();
                $blockedClient = $blockedClient->toArray();
                if (in_array($user, $blockedClient)) {
                    $post->setUserBlockedByAuthor(true);
                    // Data not flushed to avoid saving data to database
                }
                else {
                    $post->setUserBlockedByAuthor(false);
                }
            }
        }



        $response = $serializer->serialize($posts, 'json', ['groups' => ['post:read']]);
        return new JsonResponse($response, 200, [], true);
    }

    #[Route('/api/user/{id}/follow', methods: ['PATCH'], format: 'json')]
    public function followUser(
        int $id,
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
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

        $userToFollow = $userRepository->find($id);
        if (!$userToFollow) {
            return new JsonResponse(['message' => 'User not found'], 404);
        }

        // Check if the user is blocked by the target user        
        $blockedClient = $userToFollow->getBlockedUsers();
        $blockedClient = $blockedClient->toArray();
        if (in_array($user, $blockedClient)) {
            return new JsonResponse(['message' => 'You are currently blocked by this user'], 403);
        }

        $user->addFollow($userToFollow);
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'You are now following this user'], 200);
    }

    #[Route('/api/user/{id}/unfollow', methods: ['PATCH'], format: 'json')]
    public function unfollowUser(
        int $id,
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
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

        $userToUnfollow = $userRepository->find($id);
        if (!$userToUnfollow) {
            return new JsonResponse(['message' => 'User not found'], 404);
        }

        $user->removeFollow($userToUnfollow);
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'You have unfollowed this user'], 200);
    }

    #[Route('/api/user/{id}/block', methods: ['PATCH'], format: 'json')]
    public function blockUser(
        int $id,
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
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

        $userToBlock = $userRepository->find($id);
        if (!$userToBlock) {
            return new JsonResponse(['message' => 'User not found'], 404);
        }

        $userToBlock->removeFollow($user);
        $user->addBlockedUser($userToBlock);
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'You have blocked this user'], 200);
    }

    #[Route('/api/user/{id}/unblock', methods: ['PATCH'], format: 'json')]
    public function unblockUser(
        int $id,
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
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

        $userToUnblock = $userRepository->find($id);
        if (!$userToUnblock) {
            return new JsonResponse(['message' => 'User not found'], 404);
        }

        $user->removeBlockedUser($userToUnblock);
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'You have unblocked this user'], 200);
    }

    // Works with username rather than ID
    #[Route('/api/profile/{username}', methods: ['GET'], format: 'json')]
    public function getProfile(
        string $username,
        Request $request,
        UserRepository $userRepository,
        SerializerInterface $serializer
    ): JsonResponse 
    {
        $token = $request->headers->get('Authorization');
        if (!$token) {
            return $this->json(['error' => 'Authorization token missing'], 401);
        }

        $user = $userRepository->findOneBy(['token' => $token]);
        if (!$user) {
            return $this->json(['error' => 'Invalid token'], 401);
        }

        $targetUser = $userRepository->findOneBy(['username' => $username]);

        if (!$targetUser) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $targetUser = $userRepository->findOneBy(['username' => $username]);

        // Check if the user is following the target user
        $following = $targetUser->getFollowers();
        $following = $following->toArray();
        if (in_array($user, $following)) {
            $isFollowing = true;
        }
        else {
            $isFollowing = false;
        }

        // Check if the user is blocked by the target user        
        $blockedClient = $targetUser->getBlockedUsers();
        $blockedClient = $blockedClient->toArray();
        if (in_array($user, $blockedClient)) {
            $blockedUser = true;
        }
        else {
            $blockedUser = false;
        }

        // Check if the target user is blocked by the user
        $blockedByClient = $user->getBlockedUsers();
        $blockedByClient = $blockedByClient->toArray();
        if (in_array($targetUser, $blockedByClient)) {
            $isBlocked = true;
        }
        else {
            $isBlocked = false;
        }

        $blockedUsers = $targetUser->getBlockedUsers();
        $blockedUsers = $blockedUsers->toArray();
        $blockedUsers_safe = [];
        foreach ($blockedUsers as $user_in_list) {
            $blockedUsers_safe[] = [
                'id' => $user_in_list->getId(),
                'username' => $user_in_list->getUsername(),
            ];
        }

        if (!$targetUser->isBanned()){
            $user_safe = [
                'id' => $targetUser->getId(),
                'username' => $targetUser->getUsername(),
                'email' => $targetUser->getEmail(),
                'following' => $isFollowing,
                'blockedUser' => $blockedUser,
                'isBlocked' => $isBlocked,
                'belongsToUser' => $user->getId() === $targetUser->getId(),
                'blockedUsers' => $blockedUsers_safe,
            ];
        }
        else {
            $user_safe = [
                'id' => $targetUser->getId(),
                'username' => $targetUser->getUsername(),
                'email' => 'This user has been banned.',
            ];
        }
        
        $response = $serializer->serialize($user_safe, 'json', ['groups' => ['user:read']]);
        return new JsonResponse($response, 200, [], true);
    }

}

