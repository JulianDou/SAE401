import { fetchPosts, getUserData } from "../data/loaders"
import { useLoaderData } from "react-router-dom"
import { useState } from "react"

import Post from "../components/Post"
import PostEditor from "../components/PostEditor"

export async function loader() {
    const data = {
        posts: [],
        profile: {}
    }
    data.posts = await fetchPosts()
    const userId = localStorage.getItem("user_id");
    data.profile = await getUserData(userId ? parseInt(userId, 10) : 0);
    return data;
}

export default function Feed() {
    const initialData = useLoaderData()
    const [data, setData] = useState(initialData)

    async function refresh() {
        const newData = {
            posts: await fetchPosts(),
            profile: initialData.profile
        }
        setData(newData);
    }

    return (
        <>
            <div className="self-stretch w-full h-full flex-grow relative overflow-y-auto">
                <div className="absolute w-full flex-auto flex flex-col gap-8 py-2.5 px-5 md:px-[25%] items-center">
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
                            />
                        ))
                    }
                </div>
            </div>
            <div className="relative">
                <button 
                    onClick={refresh}
                    className="
                        absolute w-14 h-14 p-1 aspect-square rounded-full bg-main-white text-main-white
                        right-2.5 -top-16 hover:cursor-pointer
                    "
                >
                    <div className="w-full h-full rounded-full border border-main-black flex items-center justify-center">
                        <img src="/assets/icons/refresh.svg" alt="refresh" className="w-6 h-6" />
                    </div>
                </button>
                <PostEditor username={data.profile.username} id={data.profile.id} />
            </div>
        </>
    )
}