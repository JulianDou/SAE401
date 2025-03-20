import React, { useState } from 'react';
import regexChecker from '../../utils/regexChecker';

interface InputProps {
    type: string;
    input_name: string;
    subtype?: string;
    placeholder?: string;
    pattern?: string;
    message?: string;
}

export default function Input(props: InputProps) {
    const [error, setError] = useState<string | null>(null);
    const [openError, setOpenError] = useState<boolean>(false);
    const [missingMessage, setMissingMessage] = useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const { passed, missing, empty } = regexChecker(value, props.subtype || "", props.pattern || "");
        if (!passed && !empty) {
            setError(props.message || `Your ${props.input_name} is invalid.`);
            setMissingMessage(missing);
        } else {
            setError(null);
            setMissingMessage([]);
        }
    };

    return (
        <>
            <div className="relative w-full">
                <input 
                    onChange={handleChange} 
                    type={props.type} 
                    name={props.input_name}
                    placeholder={props.placeholder}
                    {...(props.pattern ? { pattern: props.pattern } : {})}
                    maxLength={props.type === "password" ? 32 : -1}
                    className={`w-full px-2.5 py-2 rounded-xl bg-main-grey text-main-slate ${error ? 'outline-2 outline-main-red' : 'outline-0 outline-transparent'}`}
                />
                <p onClick={() => setOpenError(!openError)} className={`absolute left-0 px-2 -translate-x-6 top-1/2 -translate-y-1/2 text-main-red font-bold text-lg hover:cursor-pointer ${error ? 'visible' : 'hidden'}`}>?</p>
                <div className={`z-10 absolute w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-[1px] border-main-grey bg-white p-2.5 rounded-xl ${openError ? 'visible' : 'hidden'}`}>
                    <p className="font-medium">Why is my {props.input_name} invalid ?</p>
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