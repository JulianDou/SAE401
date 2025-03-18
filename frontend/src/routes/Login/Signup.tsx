import Input from "../../ui/Input"
import { Link } from "react-router-dom"

export default function Signup() {
    return (
        <>
            <div className="flex flex-col items-center justify-center w-full h-full gap-10">
                <img src="/assets/Logo.png" alt="Logo"></img>
                <form className="flex flex-col gap-2.5 px-8 w-full max-w-96">
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
                </form>
                <button className="flex justify-center p-2.5 rounded-4xl bg-main-black text-white hover:cursor-pointer">Sign Up</button>
                <p className="flex flex-col items-center text-main-slate">Already have an account ?
                    <Link to="../" className="underline text-main-charcoal w-fit">Log in</Link>
                </p>
            </div>
        </>
    )
}