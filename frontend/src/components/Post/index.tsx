import ProfilePic from "../../ui/ProfilePic";
import Image from "../../ui/Image";
import Username from "../../ui/Username";
import Likes from "../../ui/Likes/Index";
import { useState, useRef } from "react";
import { api_url } from "../../data/loaders";

interface PostProps {
    id: number;
    text: string;
    time: string;
    author: {
        id: number;
        username: string;
    }
    image?: string;
    likes: [
        {
            id?: number;
            username?: string;
        }
    ];
    belongsToUser: boolean;
    userBlockedByAuthor: boolean;
}

export default function Post(props: PostProps) {
    const [initialText, setInitialText] = useState(props.text);

    const [deleting, setDeleting] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingText, setEditingText] = useState(initialText);
    const [popupOpen, setPopupOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [characters, setCharacters] = useState(props.text.length);
    const userid = localStorage.getItem("user_id");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const formattedTime = new Date(props.time).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const handleInput = () => {        
        if (textareaRef.current) {
            setEditingText(textareaRef.current.value);
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            setCharacters(textareaRef.current.value.length);
        }
    };

    function handleDelete() {
        const token = localStorage.getItem("auth_token");

        fetch (api_url + "posts/" + props.id, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Authorization": `${token}`
            },
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
                    setPopupOpen(true);
                    setMessage("An unexpected error occurred...");
                    return;
                }
                else {
                    setDeleted(true);
                    return;
                }
            })
        })
        .catch((error) => {
            setPopupOpen(true);
            setMessage(error.message);
        });
    }

    const getInput = () => {
        if (textareaRef.current) {
            return textareaRef.current.value;
        }
    }

    function handleEdit() {
        const token = localStorage.getItem("auth_token");

        const text = getInput();
        const data = {
            text: text,
        }

        fetch (api_url + "posts/" + props.id, {
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
                    setPopupOpen(true);
                    setMessage("An unexpected error occurred...");
                    return;
                }
                else {
                    setPopupOpen(true);
                    setEditing(false);
                    setInitialText(data.text);
                    setEditingText(data.text);
                    setCharacters(data.text.length);
                    setMessage(data.message);
                    return;
                }
            })
        })
        .catch((error) => {
            setPopupOpen(true);
            setMessage(error.message);
        });
    }

    return (
        <div className={`${deleted ? 'hidden' : ''} relative flex gap-3 w-full`}>
            <ProfilePic username={props.author.username} id={props.author.id} size={3}/>
            <div className="flex flex-col gap-2.5 flex-auto">
                <div className="flex md:justify-between flex-col md:flex-row">
                    <Username username={props.author.username} id={props.author.id} />
                    <p className="text-main-slate">{formattedTime}</p>
                </div>
                {!editing && <p className="text-main-slate">{initialText}</p>}
                {editing && 
                    <div className="flex flex-col gap-2.5">
                        <textarea 
                            id="post-integrated-editor"
                            ref={textareaRef}
                            maxLength={280}
                            className="w-full text-main-slate active:border-0
                                focus:outline-none focus:border-0 resize-none"
                            value={editingText}
                            onChange={handleInput}
                        />
                        <p className={characters > 0 ? (characters == 280 ? 'text-main-red' : 'text-main-grey') : 'hidden'}>{characters} / 280</p>
                    </div>
                }
                {props.image && 
                    <Image src={props.image} alt={props.author.username + "'s post's image"} maxHeight={500}/>
                }
                <div className="flex flex-row-reverse gap-2 justify-start items-center">

                    <Likes 
                        postId={props.id} 
                        count={props.likes.length} 
                        liked={props.likes.some((like) => like.id === parseInt(userid ? userid : "0", 10))}
                        blocked={props.userBlockedByAuthor}
                    />
                    
                    { // Icone suppression
                        props.belongsToUser && 
                        <img 
                            onClick={() => setDeleting(true)}
                            className="hover:cursor-pointer"
                            src="/assets/icons/delete.svg" alt="delete" 
                        />
                    }

                    { // Icone edition
                        props.belongsToUser && 
                        <img 
                            onClick={() => setEditing(!editing)}
                            className="hover:cursor-pointer"
                            src={"/assets/icons/edit_" + editing + ".svg"}
                            alt="edit"
                        />
                    }

                    { // Bouton validation édition
                        editing &&
                        <button onClick={handleEdit} className="flex h-fit justify-center p-2.5 rounded-4xl bg-main-black text-white hover:cursor-pointer">Save edits</button>
                    }
                </div>

                {/* Popup de suppression */}
                <div className={`
                    ${deleting ? '' : 'hidden'}
                    absolute top-0 left-0 w-full h-full flex gap-4 bg-white rounded shadow-lg items-center justify-center
                `}>
                    <p>Delete post ?</p>
                    <button onClick={() => setDeleting(false)} className="flex h-fit justify-center p-2.5 rounded-4xl border-main-red border-2 text-main-red hover:cursor-pointer">Keep post</button>
                    <button onClick={handleDelete} className="flex h-fit justify-center p-2.5 rounded-4xl bg-main-red text-white hover:cursor-pointer">Delete post</button>
                </div>

                {/* Message de confirmation (après une action) */}
                <div className={`
                    ${popupOpen ? '' : 'hidden'}
                    absolute top-0 left-0 w-full h-full flex gap-4 bg-white rounded shadow-lg items-center justify-center
                `}>
                    <p>{message}</p>
                    <button onClick={() => setPopupOpen(false)} className="flex h-fit justify-center p-2.5 rounded-4xl bg-main-black text-white hover:cursor-pointer">Ok</button>
                </div>
            </div>
        </div>
    )
}