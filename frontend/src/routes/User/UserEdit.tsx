import { useLoaderData, useNavigate, Link } from "react-router-dom";
import { api_url } from '../../data/loaders';
import { useState } from "react";

interface Modification {
    modified: string;
    value: string;
}

export default function UserEdit() {
    const data = useLoaderData();
    const navigate = useNavigate();
    const [username, setUsername] = useState(data.username);
    const [email, setEmail] = useState(data.email);
    const [avatar, setAvatar] = useState(data.avatar);
    const [error, setError] = useState('');
    const [messageColor, setMessageColor] = useState('');
    const [modifications, setModifications] = useState<Modification[]>([]);

    const handleSave = () => {
        const token = localStorage.getItem("auth_token");

        const mods = modifications;

        fetch (api_url + "users/edit/" + data.id, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify(mods),
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
                    navigate(`/user/${username}`);
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
        value = e.target.value; // Conserver la valeur pour les champs texte

        let propEquivalent;
        switch (e.target.name) {
            case 'username':
                propEquivalent = data.username;
                setUsername(value as string);
                break;
            case 'email':
                propEquivalent = data.email;
                setEmail(value as string);
                break;
        }

        if (value !== propEquivalent) {
            setModifications((prev) => {
                const updated = prev.filter((mod) => mod.modified !== e.target.name);
                return [...updated, { modified: e.target.name, value: value.toString() }];
            });
        } else {
            setModifications((prev) => {
                const updated_mods = prev.filter((mod) => mod.modified !== e.target.name);

                return updated_mods;
            });
        }
    
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const token = localStorage.getItem("auth_token");

        const file = e.target.files?.[0];
        if (!file) {
            setMessageColor('red');
            setError('No file selected.');
            return;
        }

        const validExtensions = ['jpg', 'jpeg', 'png'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !validExtensions.includes(fileExtension)) {
            setMessageColor('red');
            setError('Invalid file type. Only JPG and PNG are allowed.');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        fetch (api_url + "user/" + data.id + "/upload/avatar", {
            method: "POST",
            credentials: "include",
            headers: {
                "Authorization": `${token}`
            },
            body: formData,
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
                    setAvatar(data.avatar);
                    return;
                }
            })
        })
        .catch((error) => {
            setMessageColor('red');
            setError(error.message);
        });
    }

    if (!data.belongsToUser){
        return (
            <div className="w-full h-full flex flex-col gap-2.5 items-center justify-center">
                <p className="text-lg text-red-500">You are not authorized to edit this profile.</p>
                <Link to={`/user/${data.username}`} className='text-main-slate underline'>Go back</Link>
            </div>
        );
    }

    return (
        <div className="self-stretch w-full h-full flex-grow relative overflow-y-auto">
            <div className="
                absolute w-full flex-auto flex flex-col gap-2.5 py-2.5 px-5 md:px-[25%] items-center
            ">
                <div className="flex flex-col gap-0.5 -order-2 items-center">
                    <div className="relative w-36">
                        <div className="w-36 h-36 rounded-full bg-main-slate">
                            <img src={avatar} alt="Profile Picture" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            id="avatar-upload"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleAvatarChange(e);
                                }
                            }}
                        />
                        <label htmlFor="avatar-upload">
                            <img
                                src="/assets/icons/edit_false.svg"
                                alt="Edit Avatar"
                                className="absolute bottom-0.5 right-0.5 p-1 bg-main-white border-2 rounded border-mai-black hover:cursor-pointer"
                            />
                        </label>
                    </div>
                    <p className="text-sm text-main-grey">
                        Avatar changes are automatically saved.
                    </p>
                </div>
                <input
                    type="text"
                    name="username"
                    minLength={1}
                    maxLength={24}
                    onChange={handleChange}
                    className={`font-bold text-2xl -order-2 text-center`}
                    style={{ width: `${username.length + 1}ch` }}
                    value={username}
                />
                <input
                    type="text"
                    name="email"
                    className="text-lg text-main-slate -order-2 text-center"
                    onChange={handleChange}
                    style={{ width: `${email.length + 1}ch` }}
                    value={email}
                />
                <div className={`flex items-center gap-2.5 -order-2`}>
                    <button 
                        onClick={handleSave}
                        className={`
                            flex items-center justify-center rounded-md px-5 py-2.5 hover:cursor-pointer
                            bg-main-black text-white
                        `}
                    >
                        Save changes
                    </button>
                </div>
                <p
                    className={`
                        ${error.length > 0 ? 'visible' : 'invisible'}
                        ${ messageColor === 'red' ? 'text-red-500' : 'text-black' }
                    `}
                >
                    {error}
                </p>
            </div>
        </div>
    );
}