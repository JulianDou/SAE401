import Input from "../../ui/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api_url } from "../../data/loaders";

export default function Signup() {
    const [error, setError] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState(false); // État pour la validité du formulaire
    const navigate = useNavigate();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // Empêche le rechargement de la page

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()); // Convertit en objet
        if (data.email === "" || data.password === "" || data.username === "") {
            setError("Please fill in all the fields to create your account.");
            return;
        }

        fetch(api_url + "register", {
            method: "POST",
            credentials: "include",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            const data = response.json();
            if (!response.ok) {
                return data.then((err) => {
                    throw new Error(err.message || "An error occurred...");
                });
            }
            navigate(import.meta.env.BASE_URL + "login");
        })
        .then(() => {
            setError(null);
            navigate(import.meta.env.BASE_URL);
        })
        .catch((error) => {
            setError(error.message);
        });
    }

    function handleInputChange(event: React.FormEvent<HTMLFormElement>) {
        // Vérifie si tous les champs sont valides
        const form = event.currentTarget;
        setIsFormValid(form.checkValidity());
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center w-full h-full gap-10">
                <img src={import.meta.env.BASE_URL + "assets/Logo.png"} alt="Logo"></img>
                <p className={error ? "text-main-red" : "hidden"}>{error}</p>
                <form
                    className="flex flex-col gap-2.5 px-8 w-full max-w-96"
                    onSubmit={handleSubmit}
                    onInput={handleInputChange} // Vérifie la validité à chaque modification
                >
                    <Input
                        type="text"
                        input_name="username"
                        subtype="username_register"
                        placeholder="Username"
                        pattern="^[a-zA-Z0-9._-]{1,24}$"
                        message="Your username must NOT include :"
                    ></Input>
                    <Input
                        type="email"
                        input_name="email"
                        subtype="email_register"
                        placeholder="Email"
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        message="Your email should look something like this : myname@website.com"
                    ></Input>
                    <Input
                        type="password"
                        input_name="password"
                        subtype="password_register"
                        placeholder="Password"
                        pattern={"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=[\\]{};':\"\\|,.<>/?]).{5,32}$"}
                        message="Your password must include :"
                    ></Input>
                    <input id="signup-submit" type="submit" className="hidden" disabled={!isFormValid}></input>
                </form>
                <label
                    htmlFor="signup-submit"
                    className={`flex justify-center p-2.5 rounded-4xl bg-main-black text-white 
                        ${!isFormValid ? "opacity-50" : "hover:cursor-pointer"}
                    `}
                >
                    Sign Up
                </label>
                <p className="flex flex-col items-center text-main-slate">
                    Already have an account ?
                    <Link to="../" className="underline text-main-charcoal w-fit">
                        Log in
                    </Link>
                </p>
            </div>
        </>
    );
}