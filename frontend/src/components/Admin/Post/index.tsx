import ProfilePic from "../../../ui/ProfilePic";
import Username from "../../../ui/Username";
import Image from "../../../ui/Image";
import { api_url } from '../../../data/loaders';
import { server_url } from "../../../data/loaders";
import { useState } from "react";

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
    replyCount?: number;
    isReply?: boolean;
    media?: string;
    censored?: boolean;
}

export default function PostAdminEdit(props: PostProps) {
    const [repliesOpen, setRepliesOpen] = useState(false);
    const [replies, setReplies] = useState<any[]>([]);
    const [censored, setCensored] = useState(props.censored);

    const formattedTime = new Date(props.time).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

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
                        return;
                    }
                    else {
                        setReplies(data);
                        setRepliesOpen(true);
                        return;
                    }
                })
            })
        }
    }

    function handleCensor() {
        const token = localStorage.getItem("auth_token");

        fetch (api_url + "admin/posts/" + props.id + "/censor", {
            method: "PATCH",
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
                    return;
                }
                else {
                    setCensored(data.status);
                    return;
                }
            })
        })
    }

    return (
        <div className={`relative flex gap-3 w-full`}>
            <ProfilePic username={props.author.username} id={props.author.id} image={props.author.avatar} size={3}/>
            <div className="flex flex-col gap-2.5 flex-auto">
                <div className="flex md:justify-between flex-col md:flex-row">
                    <Username username={props.author.username} id={props.author.id} />
                    <p className="text-main-slate">{formattedTime}</p>
                </div>
                <p className="text-main-slate">{props.text}</p>
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

                <div className="flex gap-2.5 w-full justify-end">
                    <button 
                        onClick={handleCensor}
                        className={
                            censored ?
                            "text-main-white rounded p-2 bg-main-red hover:cursor-pointer" :
                            "text-main-red border-2 border-main-red p-2 rounded hover:cursor-pointer"
                        }
                    >
                        {censored ? 'Uncensor' : 'Censor'}
                    </button>
                </div>
    
                {
                    props.replyCount &&
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
                    repliesOpen && replies.length > 0 &&
                    <div className="flex flex-col gap-2.5">
                        {replies.map((reply) => (
                            <PostAdminEdit
                                key={reply.id}
                                id={reply.id}
                                text={reply.text}
                                time={reply.time}
                                author={
                                    {
                                        id: reply.author.id,
                                        username: reply.author.username,
                                        avatar: reply.author.avatar ? server_url + reply.author.avatar : '/placeholders/defaultpfp.png'
                                    }
                                }
                                media={reply.media}
                                isReply={true}
                            />
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}