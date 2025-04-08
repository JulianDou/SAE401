import { useState } from "react";
import { api_url } from "../../data/loaders";

interface likesProps {
    postId: number;
    count: number;
    liked: boolean;
    blocked: boolean;
    isReply?: boolean;
}

export default function Likes(props: likesProps) {
    const [likedStatus, setLikedStatus] = useState(props.liked);
    const [likesCount, setLikesCount] = useState(props.count);
    const token = localStorage.getItem("auth_token");

    function handleLike() {
        if (props.blocked) {
            return;
        }
        
        let target = 'posts/';

        if (props.isReply) {
            target = 'reply/';
        }

        fetch (api_url + target + props.postId + "/likemanager", {
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
                if (data.message === undefined) {
                    alert("An unexpected error occurred...");
                    return;
                }
                else {
                    switch (data.status) {
                        case "added":
                            setLikedStatus(true);
                            setLikesCount(likesCount + 1);
                            break;
                        case "removed":
                            setLikedStatus(false);
                            setLikesCount(likesCount - 1);
                            break;
                    }
                    return;
                }
            })
        })
        .catch((error) => {
            alert(error.message);
        });
    }
    
    return (
        <div className="flex gap-2 h-6 w-fit">
            <img 
                onClick={handleLike}
                className={props.blocked ? '' : 'hover:cursor-pointer'}
                src={import.meta.env.BASE_URL + (likedStatus ? "assets/icons/like_true.svg" : "assets/icons/like_false.svg")}
                alt="like" 
            />
            <p>{likesCount}</p>
        </div>
    )
}