import { useLoaderData, Params, Link } from "react-router-dom"
import { getUserProfilePosts, getUserProfile } from "../../data/loaders"
import { useState } from "react"
import Post from "../../components/Post"
import { api_url } from "../../data/loaders";
import ProfilePic from "../../ui/ProfilePic";
import Username from "../../ui/Username";

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
        belongsToUser: userData.belongsToUser,
        blockedUser: userData.blockedUser,
        isBlocked: userData.isBlocked,
        blockedUsers: userData.blockedUsers,
        avatar: userData.avatar ? (import.meta.env.VITE_API_URL + userData.avatar) : (import.meta.env.BASE_URL + 'placeholders/defaultpfp.png')
    }
    return data;
}

export default function User() {
    const data = useLoaderData();
    const [following, setFollowing] = useState(data.following);
    const [error, setError] = useState("");
    const [blocked, setBlocked] = useState(data.isBlocked);
    const [currentTab, setCurrentTab] = useState("posts");

    function handleFollowBtn(){
        if (!following) {
            handleFollow();
        }
        else {
            handleUnfollow();
        }
    }

    function handleFollow() {
        if (data.blockedUser) {
            return;
        }

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
                    setError(data.message);
                    return;
                }
                else {
                    setFollowing(true);
                    return;
                }
            })
        })
        .catch((error) => {
            setError(error.message);
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

    function handleBlockBtn() {
        if (!blocked) {
            handleBlock();
        }
        else {
            handleUnblock();
        }
    }

    function handleBlock() {
        const token = localStorage.getItem("auth_token");
        fetch (api_url + "user/" + data.id + "/block", {
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
                    setError("An unexpected error occurred");
                    return;
                }
                else {
                    setBlocked(true);
                    return;
                }
            })
        })
        .catch((error) => {
            setError(error.message);
        });
    }

    function handleUnblock() {
        const token = localStorage.getItem("auth_token");
        fetch (api_url + "user/" + data.id + "/unblock", {
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
                    setError("An unexpected error occurred");
                    return;
                }
                else {
                    setBlocked(false);
                    return;
                }
            })
        })
        .catch((error) => {
            setError(error.message);
        });
    }

    return (
        <div className="self-stretch w-full h-full flex-grow relative overflow-y-auto">
            <div className="
                absolute w-full flex-auto flex flex-col gap-2.5 py-2.5 px-5 md:px-[25%] items-center
                after:content-[''] after:w-full after:h-[1px] after:bg-main-grey after:-order-1
            ">
                <div className="w-36 h-36 rounded-full bg-main-slate -order-2">
                    <img 
                        src={data.avatar} 
                        alt="Profile Picture" className="w-full h-full object-cover rounded-full" 
                    />
                </div>
                <p className="text-2xl font-bold -order-2">{data.username}</p>
                <p className="text-lg text-main-slate -order-2">{data.email}</p>
                <div className={`flex items-center gap-2.5 -order-2`}>
                    <button 
                        className={`
                            ${data.belongsToUser ? 'hidden' : ''}
                            flex items-center justify-center rounded-md px-5 py-2.5
                            ${
                                blocked 
                                ? 'bg-main-red text-white hover:cursor-pointer' 
                                : 'border-2 border-main-red text-main-red hover:cursor-pointer'
                            }
                        `}
                        onClick={handleBlockBtn}
                    >
                        {blocked ? "Unblock" : "Block"}
                    </button>
                    <button 
                        className={`
                            ${data.belongsToUser ? 'hidden' : ''}
                            flex items-center justify-center rounded-md px-5 py-2.5
                            ${
                                data.blockedUser 
                                    ? 'border-2 border-main-grey text-main-grey' 
                                    : following 
                                        ? 'bg-main-black text-white hover:cursor-pointer' 
                                        : 'border-2 border-main-black text-main-black hover:cursor-pointer'
                            }
                        `}
                        onClick={handleFollowBtn}
                    >
                        {following ? "Unfollow" : "Follow"}
                    </button>
                    {data.belongsToUser ? (
                        <p className="text-main-slate">This is your profile. <Link to="edit" className="underline">Edit</Link></p>
                    ) : ""}
                </div>
                <p className="-order-2 text-main-red">{error}</p>
                <div className="flex gap-2.5 w-full">
                    <button 
                        className={`${
                            currentTab === 'posts' ? 'border-b-2 border-main-black' : 'text-main-slate'
                        } px-2.5 py-2.5`}
                        onClick={() => setCurrentTab('posts')}
                    >
                        Posts
                    </button>
                    <button 
                        className={`${
                            currentTab === 'blocks' ? 'border-b-2 border-main-black' : 'text-main-slate'
                        } px-2.5 py-2.5`}
                        onClick={() => setCurrentTab('blocks')}
                    >
                        Blocks
                    </button>
                </div>

                {/* Posts */}
                <div className={`${currentTab === 'posts' ? '' : 'hidden'} flex w-full flex-col`}>
                    <p className="font-bold text-lg">Posts</p>
                    <div className="w-full flex flex-col gap-8 py-2.5">
                        {
                            data.posts.length === 0 ? (
                                <p className="text-main-slate">{data.username} has not posted anything yet.</p>
                            ) :
                            data.posts.map((post: any) => (
                                <Post
                                    key={post.id}
                                    id={post.id}
                                    text={post.text}
                                    time={post.time}
                                    author={{
                                        id: post.author.id,
                                        username: post.author.username,
                                        avatar: post.author.avatar ? (import.meta.env.VITE_API_URL + post.author.avatar) : (import.meta.env.BASE_URL + "placeholders/defaultpfp.png")
                                    }}
                                    image={post.image}
                                    likes={post.likes}
                                    belongsToUser={post.belongs_to_user}
                                    userBlockedByAuthor={post.user_blocked_by_author}
                                    replyCount={post.reply_count}
                                    media={post.media}
                                />
                            ))
                        }
                    </div>
                </div>

                {/* Blocked users */}
                <div className={`${currentTab === 'blocks' ? '' : 'hidden'} flex w-full flex-col`}>
                    <p className="font-bold text-lg">Blocked users</p>
                    <div className="w-full flex flex-col gap-8 py-2.5">
                        {
                            data.blockedUsers.length === 0 ? (
                                <p className="text-main-slate">{data.username} has not blocked anyone.</p>
                            ) :
                            data.blockedUsers.map((user: any) => (
                                <div key={user.id} className="flex items-center gap-2.5">
                                    <ProfilePic id={user.id} username={user.username} 
                                        image={user.avatar ? (import.meta.env.VITE_API_URL + user.avatar) : (import.meta.env.BASE_URL + "placeholders/defaultpfp.png")} 
                                        size={2} 
                                    />
                                    <Username id={user.id} username={user.username} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}