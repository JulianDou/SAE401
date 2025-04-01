import { useState } from "react";
import { api_url } from "../../data/loaders";

interface likesProps {
    postId: number;
    count: number;
    liked: boolean;
}

export default function Likes(props: likesProps) {
    const [likedStatus, setLikedStatus] = useState(props.liked);
    const [likesCount, setLikesCount] = useState(props.count);
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem("auth_token");

    function handleLike() {
        fetch (api_url + "posts/" + props.postId + "/likemanager", {
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
                    setErrorMessage("An unexpected error occurred...");
                    return;
                }
                else {
                    setErrorMessage("");
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
            setErrorMessage(error.message);
        });
    }
    
    return (
        <div className="flex gap-2">
            <p className={`${errorMessage == "" ? 'hidden' : ''} text-sm text-main-red`}>
                {errorMessage}
            </p>
            <img 
                onClick={handleLike}
                className="hover:cursor-pointer"
                src={likedStatus ? "/assets/icons/like_true.svg" : "/assets/icons/like_false.svg"}
                alt="like" 
            />
            <p>{likesCount}</p>
        </div>
    )
}