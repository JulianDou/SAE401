<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Repository\UserRepository;
use App\Security\EmailVerifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;


class RegistrationController extends AbstractController
{
    public function __construct(private EmailVerifier $emailVerifier)
    {
    }

    #[Route('/api/register', name: 'app_register', methods: ['POST'])]
    public function register(
        Request $request, 
        UserPasswordHasherInterface $userPasswordHasher,
        UserRepository $user_repository
    ): JsonResponse
    {
        $content = $request->getContent();
        $data = json_decode($content, true);

        if ($data === null) {
            return new JsonResponse(['message' => 'An error occurred.'], 400);
        }

        $checkUsername = $user_repository->findOneBy(['username' => $data['username']]);
        if ($checkUsername !== null) {
            return new JsonResponse(['message' => 'Username already exists.'], 400);
        }

        $checkEmail = $user_repository->findOneBy(['email' => $data['email']]);
        if ($checkEmail !== null) {
            return new JsonResponse(['message' => 'Email already exists.'], 400);
        }
        
        $hashedpwd = $userPasswordHasher->hashPassword(new User(), $data['password']);
        $user_repository->addUser($data['username'], $data['email'], $hashedpwd);
        $user = $user_repository->findByEmail($data['email'])[0];

        // generate a signed url and email it to the user
        $this->emailVerifier->sendEmailConfirmation('app_verify_email', $user,
            (new TemplatedEmail())
                ->from(new Address('checkr@registration.com', 'Checkr'))
                ->to((string) $user->getEmail())
                ->subject('Please Confirm your Email')
                ->htmlTemplate('registration/confirmation_email.html.twig')
        );

        // do anything else you need here, like send an email

        return new JsonResponse(['message' => 'Registration successful. Please check your email to verify your account.'], 200);
    }

    #[Route('/api/verify/email', name: 'app_verify_email')]
    public function verifyUserEmail(Request $request, UserRepository $userRepository): Response
    {        
        $loginURL = "https://animated-journey-6996xj7957973rg74-8090.app.github.dev/login";
        $signupURL = "https://animated-journey-6996xj7957973rg74-8090.app.github.dev/signup/signup";

        $id = $request->query->get('id');

        if (null === $id) {
            return $this->redirect($signupURL);
        }

        $user = $userRepository->find($id);

        if (null === $user) {
            return $this->redirect($signupURL);
        }

        // validate email confirmation link, sets User::isVerified=true and persists
        try {
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $exception->getReason());

            return $this->redirect($signupURL);
        }

        // @TODO Change the redirect on success and handle or remove the flash message in your templates
        $this->addFlash('success', 'Your email address has been verified.');

        return $this->redirect($loginURL);
    }
}
