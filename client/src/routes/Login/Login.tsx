import Input from "../../ui/Input"
import { Link } from "react-router-dom"

export default function Login() {
    return (
        <>
            <div className="flex flex-col items-center justify-center w-full h-full gap-10">
                <img src="/assets/Logo.png" alt="Logo"></img>
                <form className="flex flex-col gap-2.5 px-8 w-full max-w-96">
                    <Input type="email" input_name="email" placeholder="Email" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" message="Your email should look something like this : myname@website.com"></Input>
                    <Input type="password" input_name="password" subtype="password_login" placeholder="Password" pattern={""}></Input>
                </form>
                <button className="flex justify-center p-2.5 rounded-4xl bg-main-black text-white hover:cursor-pointer">Log In</button>
                <p className="flex flex-col items-center text-main-slate">Don't have an account yet? 
                    <Link to="./signup" className="underline text-main-charcoal w-fit">Create an account</Link>
                </p>
            </div>
        </>
    )
}