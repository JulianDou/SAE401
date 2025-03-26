import { fetchPosts, getUserData } from "../data/loaders"
import { useLoaderData } from "react-router-dom"

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
    const data = useLoaderData()
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
            <div>
                <PostEditor username={data.profile.username} id={data.profile.id} />
            </div>
        </>
    )
}