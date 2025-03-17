import React, { useState } from 'react';

interface InputProps {
    type: string;
    placeholder?: string;
    pattern?: string;
    message?: string;
    signup?: boolean;
}

export default function Input(props: InputProps) {
    const [error, setError] = useState<string | null>(null);
    const [openError, setOpenError] = useState<boolean>(false);
    const [missingMessage, setMissingMessage] = useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        let missing: string[] = [];

        if (value === "") {
            setError(null);
            setMissingMessage([]);
        } else {
            if (props.pattern) {
                const regex = new RegExp(props.pattern);
                if (!regex.test(value) && props.message) {
                    setError(props.message);
                } else {
                    setError(null);
                }
            }
            if (props.type === "password") {
                if (value.length < 5 || value.length > 32) {
                    missing.push(" - A length between 5 and 32 characters");
                }
                if (!value.match(/[0-9]/)) {
                    missing.push(" - At least one number");
                }
                if (!value.match(/[a-z]/)) {
                    missing.push(" - At least one lowercase letter");
                }
                if (!value.match(/[A-Z]/)) {
                    missing.push(" - At least one uppercase letter");
                }
                if (!value.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)) {
                    missing.push(" - At least one special character");
                }
                setMissingMessage(missing);
            }
        }
    };

    return (
        <>
            <div className="relative w-full">
                <input 
                    onChange={handleChange} 
                    type={props.type} 
                    placeholder={props.placeholder} 
                    pattern={props.pattern} 
                    maxLength={props.type === "password" ? 32 : -1}
                    className={`w-full px-2.5 py-2 rounded-xl bg-main-grey text-main-slate ${error ? 'outline-2 outline-main-red' : 'outline-0 outline-transparent'}`}
                />
                <p onClick={() => setOpenError(!openError)} className={`absolute left-0 px-2 -translate-x-6 top-1/2 -translate-y-1/2 text-main-red font-bold text-lg hover:cursor-pointer ${error ? 'visible' : 'hidden'}`}>?</p>
                <div className={`z-10 absolute w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-[1px] border-main-grey bg-white p-2.5 rounded-xl ${openError ? 'visible' : 'hidden'}`}>
                    <p className="font-medium">Why is my {props.type} invalid ?</p>
                    {error && <p className="text-main-red">{error}</p>}
                    {missingMessage.length > 0 && (
                        <ul className="text-main-red">
                            {missingMessage.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    )
}