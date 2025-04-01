import { useLoaderData, Params } from "react-router-dom"
import { getUserProfilePosts, getUserProfile } from "../data/loaders"
import { useState } from "react"
import Post from "../components/Post"
import { api_url } from "../data/loaders";

export async function loader({params}: {params: Params<string>}) {
    const { username } = params;
    if (!username) {
        return {
            id: 0,
            username: "Error",
            email: "An unexpected error occurred",
            posts: []
        }
    }
    const userData = await getUserProfile(username);
    const postsData = await getUserProfilePosts(username);

    const data = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        posts: postsData,
        following: userData.following,
        belongsToUser: userData.belongsToUser
    }
    return data;
}

export default function User() {
    const data = useLoaderData();
    const [following, setFollowing] = useState(data.following);

    function handleFollowBtn(){
        if (!following) {
            handleFollow();
        }
        else {
            handleUnfollow();
        }
    }

    function handleFollow() {
        const token = localStorage.getItem("auth_token");

        fetch (api_url + "user/" + data.id + "/follow", {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
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
                    alert(data.message);
                    return;
                }
                else {
                    setFollowing(true);
                    return;
                }
            })
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    function handleUnfollow() {
        const token = localStorage.getItem("auth_token");

        fetch (api_url + "user/" + data.id + "/unfollow", {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
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
                    alert(data.message);
                    return;
                }
                else {
                    setFollowing(false);
                    return;
                }
            })
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    return (
        <div className="self-stretch w-full h-full flex-grow relative overflow-y-auto">
            <div className="
                absolute w-full flex-auto flex flex-col gap-2.5 py-2.5 px-5 md:px-[25%] items-center
                after:content-[''] after:w-full after:h-[1px] after:bg-main-grey after:-order-1
            ">
                <div className="w-36 h-36 rounded-full bg-main-slate -order-2">
                    <img src="/placeholders/defaultpfp.png" alt="Profile Picture" className="w-full h-full object-cover rounded-full" />
                </div>
                <p className="text-2xl font-bold -order-2">{data.username}</p>
                <p className="text-lg text-main-slate -order-2">{data.email}</p>
                <div className={`flex items-center gap-2.5 -order-2`}>
                    <button 
                        className={`
                            ${data.belongsToUser ? 'hidden' : ''}
                            flex items-center justify-center rounded-md px-5 py-2.5 hover:cursor-pointer
                            ${following ? "bg-main-black text-white" : "border-2 border-main-black text-main-black"}
                        `}
                        onClick={handleFollowBtn}
                    >
                        {following ? "Unfollow" : "Follow"}
                    </button>
                    {data.belongsToUser ? (
                        <p className="text-main-slate">This is your profile.</p>
                    ) : ""}
                </div>
                <div className="flex w-full flex-col">
                    <p className="font-bold text-lg">Posts</p>
                    <div className="w-full flex flex-col gap-8 py-2.5">
                        {
                            data.posts.map((post: any) => (
                                <Post
                                    key={post.id}
                                    id={post.id}
                                    text={post.text}
                                    time={post.time}
                                    author={{
                                        id: post.author.id,
                                        username: post.author.username
                                    }}
                                    image={post.image}
                                    likes={post.likes}
                                    belongsToUser={post.belongs_to_user}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}