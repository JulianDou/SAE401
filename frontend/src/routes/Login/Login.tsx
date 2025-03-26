import Input from "../../ui/Input"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { api_url } from "../../data/loaders";

export default function Login() {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith("/admin");
    const [error, setError] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState(false); // État pour la validité du formulaire
    const navigate = useNavigate();


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // Empêche le rechargement de la page
    
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries()); // Convertit en objet
        if (data.email === "" || data.password === "") {
            setError("Please fill in all the fields in order to log in to your account.");
            return;
        }
    
        fetch(api_url + "login", {
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
            data.then((data) => {
                if (data.token === undefined) {
                    throw new Error("An error occurred...");
                }
                else {
                    localStorage.setItem("isAuthenticated", "true");
                    localStorage.setItem("auth_token", data.token);
                    localStorage.setItem("user_id", data.userid);
                    return;
                }
            });
        })
        .then(() => {
            setError(null);
            navigate("/");
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
                <img src="/assets/Logo.png" alt="Logo"></img>
                <p className={error ? "text-main-red" : "hidden"}>{error}</p>
                <form 
                    method="post" 
                    className="flex flex-col gap-2.5 px-8 w-full max-w-96"
                    onSubmit={handleSubmit}
                    onInput={handleInputChange} // Vérifie la validité à chaque modification
                >
                    <Input type="email" input_name="email" placeholder="Email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" message="Your email should look something like this : myname@website.com"></Input>
                    <Input type="password" input_name="password" subtype="password_login" placeholder="Password" pattern={""}></Input>
                    <input id="login-submit" type="submit" className="hidden" disabled={!isFormValid}></input>
                </form>
                <label
                    htmlFor="login-submit"
                    className={`flex justify-center p-2.5 rounded-4xl bg-main-black text-white 
                        ${!isFormValid ? "opacity-50" : "hover:cursor-pointer"}
                    `}
                >
                    Log In
                </label>
                {!isAdmin &&  
                    <p className="flex flex-col items-center text-main-slate">Don't have an account yet? 
                        <Link to="./signup" className="underline text-main-charcoal w-fit">Create an account</Link>
                    </p>
                }
            </div>
        </>
    )
}