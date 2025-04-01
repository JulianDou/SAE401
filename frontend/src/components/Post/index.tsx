import ProfilePic from "../../ui/ProfilePic";
import Image from "../../ui/Image";
import Username from "../../ui/Username";
import Likes from "../../ui/Likes/Index";
import { useState } from "react";
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
}

export default function Post(props: PostProps) {
    const [deleting, setDeleting] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [message, setMessage] = useState("");
    const userid = localStorage.getItem("user_id");
    
    const formattedTime = new Date(props.time).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

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

    return (
        <div className={`${deleted ? 'hidden' : ''} relative flex gap-3 w-full`}>
            <ProfilePic username={props.author.username} id={props.author.id} size={3}/>
            <div className="flex flex-col gap-2.5 flex-auto">
                <div className="flex md:justify-between flex-col md:flex-row">
                    <Username username={props.author.username} id={props.author.id} />
                    <p className="text-main-slate">{formattedTime}</p>
                </div>
                <p className="text-main-slate">{props.text}</p>
                {props.image && 
                    <Image src={props.image} alt={props.author.username + "'s post's image"} maxHeight={500}/>
                }
                <div className="flex flex-row-reverse gap-2 justify-start">
                    <Likes 
                        postId={props.id} 
                        count={props.likes.length} 
                        liked={props.likes.some((like) => like.id === parseInt(userid ? userid : "0", 10))}
                    />
                    {
                        props.belongsToUser && 
                        <img 
                            onClick={() => setDeleting(true)}
                            className="hover:cursor-pointer"
                            src="/assets/icons/delete.svg" alt="delete" 
                        />
                    }
                    <div className={`
                        ${deleting ? '' : 'hidden'}
                        absolute top-0 left-0 w-full h-full flex gap-4 bg-white rounded shadow-lg items-center justify-center
                    `}>
                        <p>Delete post ?</p>
                        <button onClick={() => setDeleting(false)} className="flex h-fit justify-center p-2.5 rounded-4xl border-main-red border-2 text-main-red hover:cursor-pointer">Keep post</button>
                        <button onClick={handleDelete} className="flex h-fit justify-center p-2.5 rounded-4xl bg-main-red text-white hover:cursor-pointer">Delete post</button>
                    </div>
                    <div className={`
                        ${popupOpen ? '' : 'hidden'}
                        absolute top-0 left-0 w-full h-full flex gap-4 bg-white rounded shadow-lg items-center justify-center
                    `}>
                        <p>{message}</p>
                        <button onClick={() => setPopupOpen(false)} className="flex h-fit justify-center p-2.5 rounded-4xl bg-main-black text-white hover:cursor-pointer">Ok</button>
                    </div>
                </div>
            </div>
        </div>
    )
}