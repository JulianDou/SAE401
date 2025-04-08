import ProfilePic from "../../../ui/ProfilePic";
import { api_url } from '../../../data/loaders';
import { useState } from "react";

interface UserProps {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    verified: boolean;
    admin: boolean;
    banned: boolean;
}

interface Modification {
    modified: string;
    value: string;
}

export default function UserAdminEdit(props: UserProps) {
    const [initialValues, setInitialValues] = useState({
        username: props.username,
        email: props.email,
        avatar: props.avatar,
        verified: props.verified,
        admin: props.admin,
        banned: props.banned
    });
    const [saveButton, setSaveButton] = useState(false);
    const [username, setUsername] = useState(initialValues.username);
    const [email, setEmail] = useState(initialValues.email);
    const [verified, setVerified] = useState(initialValues.verified);
    const [admin, setAdmin] = useState(initialValues.admin);
    const [banned, setBanned] = useState(initialValues.banned);
    const [modifications, setModifications] = useState<Modification[]>([]);
    const [error, setError] = useState('');
    const [messageColor, setMessageColor] = useState('');

    const handleSave = () => {
        const token = localStorage.getItem("auth_token");

        const data = modifications;

        fetch (api_url + "users/edit/" + props.id, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            const res = response.json();
            if (!response.ok) {
                return res.then((err) => {
                    throw new Error(err.message || "An error occurred...");
                });
            }
            res.then((data) => {
                if (data.message === undefined) {
                    setMessageColor('red');
                    setError("An unexpected error occurred...");
                    return;
                }
                else {
                    setMessageColor('black');
                    setError(data.message);
                    setInitialValues({
                        username: data.user.username,
                        email: data.user.email,
                        verified: data.user.verified,
                        avatar: data.user.avatar,
                        admin: data.user.admin,
                        banned: data.user.banned
                    });
                    console.log(initialValues);
                    setSaveButton(false);
                    return;
                }
            })
        })
        .catch((error) => {
            setMessageColor('red');
            setError(error.message);
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');

        let value: string | boolean;
        if (e.target.type === 'checkbox') {
            value = e.target.checked; // Conserver la valeur booléenne
        } else {
            value = e.target.value; // Conserver la valeur pour les champs texte
        }

        let propEquivalent;
        switch (e.target.name) {
            case 'username':
                propEquivalent = initialValues.username;
                setUsername(value as string);
                break;
            case 'email':
                propEquivalent = initialValues.email;
                setEmail(value as string);
                break;
            case 'verified':
                propEquivalent = initialValues.verified;
                setVerified(value as boolean);
                break;
            case 'admin':
                propEquivalent = initialValues.admin;
                setAdmin(value as boolean);
                break;
            case 'banned':
                propEquivalent = initialValues.banned;
                setBanned(value as boolean);
                break;
        }

        if (value !== propEquivalent) {
            setModifications((prev) => {
                const updated = prev.filter((mod) => mod.modified !== e.target.name);
                return [...updated, { modified: e.target.name, value: value.toString() }];
            });

            setSaveButton(true);
        } else {
            setModifications((prev) => {
                const updated_mods = prev.filter((mod) => mod.modified !== e.target.name);
    
                if (updated_mods.length === 0) {
                    setSaveButton(false);
                }

                return updated_mods;
            });
        }
    
    };

    return (
        <div className={`
            relative flex flex-col items-center justify-center w-full p-2.5 gap-2.5 border-[1px] border-main-grey rounded-md
            ${saveButton ? 'mb-10 md:mb-0' : 'mb-0'}
        `}>
            <div className="w-full flex flex-col md:flex-row md:items-center gap-2.5">
                <ProfilePic id={props.id} username={initialValues.username} size={4} 
                image={initialValues.avatar ? (import.meta.env.VITE_API_URL + initialValues.avatar) : (import.meta.env.BASE_URL + 'placeholders/defaultpfp.png')}/>
                <div className="w-full flex flex-col md:flex-row p-2.5 gap-2.5 after:content-[''] after:w-full after:md:w-[1px] after:h-[1px] after:md:h-full after:bg-main-grey after:order-1">
                    <div className="flex flex-col gap-2.5 order-0 items">
                        <input
                            type="text"
                            name="username"
                            onChange={handleChange}
                            className={`font-bold`}
                            style={{ width: `${username.length + 1}ch` }}
                            value={username}
                        />
                        <p>
                            <span className="font-bold">ID : </span>
                            {props.id}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2.5 order-3">
                        <input
                                type="text"
                                name="email"
                                onChange={handleChange}
                                style={{ width: `${email.length + 1}ch` }}
                                value={email}
                        />
                        <div className="flex gap-2.5">
                            <div className="flex gap-2.5 after:content-[''] after:w-[1px] after:h-full after:bg-main-grey">
                                <p className="font-bold">Verified</p>
                                <input type="checkbox" name="verified" onChange={handleChange} checked={verified} />
                            </div>
                            <div className="flex gap-2.5">
                                <p className="font-bold">Admin</p>
                                <input type="checkbox" name="admin" onChange={handleChange} checked={admin} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full order-5">
                <input type="checkbox" id={"banned-btn-" + props.id} name="banned" onChange={handleChange} className="hidden" />
                <label 
                    htmlFor={"banned-btn-" + props.id}
                    className={`flex p-2 justify-self-end rounded-lg hover:cursor-pointer items-center justify-center h-min font-bold ${banned ? 'bg-main-black text-main-white' : 'border-2 border-main-red text-main-red'}`}
                >
                    {banned ? 'Unban' : 'Ban'}
                </label>
            </div>

            {/* Error message */}
            <p className={ messageColor === 'red' ? 'text-red-500' : 'text-black' }>
                {error}
            </p>

            {/* Save button, displayed below the box */}
            <div
                className={`
                    ${saveButton ? '' : 'hidden'}
                    absolute flex items-center justify-center 
                    p-2 
                    bottom-0 translate-y-full md:bottom-1/2 md:translate-y-1/2 
                    right-1/2 translate-x-1/2 md:right-0 md:translate-x-full 
                    rounded-b md:rounded-bl-none md:rounded-r 
                    bg-main-black text-main-white 
                    md:h-[90%] w-[90%] md:w-fit
                    hover:cursor-pointer
                `}
                onClick={handleSave}
            >
                Save
            </div>
        </div>
    );
}