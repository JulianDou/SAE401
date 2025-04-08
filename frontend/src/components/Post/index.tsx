import ProfilePic from "../../ui/ProfilePic";
import Image from "../../ui/Image";
import Username from "../../ui/Username";
import Likes from "../../ui/Likes/Index";
import { useState, useRef } from "react";
import { api_url } from "../../data/loaders";
import PostEditor from "../PostEditor";

interface PostProps {
    id: number;
    text: string;
    time: string;
    author: {
        id: number;
        username: string;
        avatar?: string;
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
    replyCount?: number;
    isReply?: boolean;
    media?: string;
    isCensored?: boolean;
}

export default function Post(props: PostProps) {

    const [initialText, setInitialText] = useState(props.text);

    const [deleting, setDeleting] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingText, setEditingText] = useState(initialText);
    const [replying, setReplying] = useState(false);
    const [repliesOpen, setRepliesOpen] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [characters, setCharacters] = useState(props.text.length);
    const [replies, setReplies] = useState<any[]>([]);
    const userid = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
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

        let target = "posts/";
        if (props.isReply) {
            target = "reply/";
        }

        fetch (api_url + target + props.id, {
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

        let target = "posts/";

        if (props.isReply) {
            target = "reply/";
        }

        fetch (api_url + target + props.id, {
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

    function handleReplies() {
        if (repliesOpen) {
            setRepliesOpen(false);
        }
        else {
            if (replies.length > 0 && props.replyCount && props.replyCount === replies.length) {
                setRepliesOpen(true);
                console.log(replies);
                return;
            }

            const token = localStorage.getItem("auth_token");

            fetch (api_url + "posts/" + props.id + "/replies", {
                method: "GET",
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
                    if (!data) {
                        setPopupOpen(true);
                        setMessage("An unexpected error occurred...");
                        return;
                    }
                    else {
                        setReplies(data);
                        setRepliesOpen(true);
                        return;
                    }
                })
            })
            .catch((error) => {
                setPopupOpen(true);
                setMessage(error.message);
            });
        }
    }

    return (
        <div className={`${deleted ? 'hidden' : ''} relative flex gap-3 w-full`}>
            <ProfilePic username={props.author.username} id={props.author.id} image={props.author.avatar} size={3}/>
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
                {props.media ? (
                    props.media.endsWith('.mp4') || props.media.endsWith('.webm') ? (
                        <video controls className="w-full max-h-96">
                            <source src={props.media} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <Image src={props.media} alt={props.author.username + "'s post's image"} maxHeight={500}/>
                    )
                ) : null}
                {
                    !props.isCensored &&
                    <div className="flex flex-row-reverse gap-2 justify-start items-center">

                        <Likes 
                            postId={props.id} 
                            count={props.likes.length} 
                            liked={props.likes.some((like) => like.id === parseInt(userid ? userid : "0", 10))}
                            blocked={props.userBlockedByAuthor}
                            isReply={props.isReply}
                        />
                        
                        { // Icone suppression
                            props.belongsToUser && 
                            <img 
                                onClick={() => setDeleting(true)}
                                className="hover:cursor-pointer"
                                src={import.meta.env.BASE_URL + "assets/icons/delete.svg"} alt="delete" 
                            />
                        }

                        { // Icone edition
                            props.belongsToUser && 
                            <img 
                                onClick={() => setEditing(!editing)}
                                className="hover:cursor-pointer"
                                src={import.meta.env.BASE_URL + "assets/icons/edit_" + editing + ".svg"}
                                alt="edit"
                            />
                        }

                        { // Icone reponse
                            !props.userBlockedByAuthor && !props.isReply &&
                            <img
                                className="hover:cursor-pointer"
                                onClick={() => setReplying(!replying)}
                                src={import.meta.env.BASE_URL + "assets/icons/reply_" + replying + ".svg"}
                                alt="reply"
                            />
                        }

                        { // Bouton validation édition
                            editing &&
                            <button onClick={handleEdit} className="flex h-fit justify-center p-2.5 rounded-4xl bg-main-black text-white hover:cursor-pointer">Save edits</button>
                        }
                    </div>
                }

                {
                    replying && !props.isReply &&
                    <PostEditor mode="reply" postId={props.id} id={parseInt(userid ? userid : "0")} username={username ? username : "Unknown"}></PostEditor>
                }

                {
                    props.replyCount && !props.isCensored &&
                    <div className="flex gap-2.5">
                        <p 
                        onClick={handleReplies}
                        className="
                            flex w-full items-center gap-2.5
                            before:content-[''] before:block before:w-full before:h-[1px] before:bg-main-grey before:border-0
                            text-main-grey text-nowrap hover:cursor-pointer
                            after:content-[''] after:block after:w-full after:h-[1px] after:bg-main-grey after:border-0
                        ">
                            {
                                repliesOpen ?
                                    'Hide replies' :
                                    'Show replies'
                                +
                                ' (' + props.replyCount + ')'
                            }
                        </p>
                    </div>                    
                }

                {
                    repliesOpen && replies.length > 0 && !props.isCensored &&
                    <div className="flex flex-col gap-2.5">
                        {replies.map((reply) => (
                            <Post 
                                key={reply.id}
                                id={reply.id}
                                text={reply.text}
                                time={reply.time}
                                author={
                                    {
                                        id: reply.author.id,
                                        username: reply.author.username,
                                        avatar: reply.author.avatar ? (import.meta.env.VITE_API_URL + reply.author.avatar) : undefined
                                    }
                                }
                                image={reply.image}
                                likes={reply.likes}
                                belongsToUser={reply.belongs_to_user}
                                userBlockedByAuthor={reply.user_blocked_by_author}
                                isReply={true}
                                media={reply.media}
                                isCensored={reply.is_censored}
                            />
                        ))}
                    </div>
                }

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