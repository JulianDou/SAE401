import { fetchPosts } from "../data/loaders"
import { useLoaderData } from "react-router-dom"

import Post from "../components/Post"
import PostEditor from "../components/PostEditor"

export async function loader() {
    const posts = await fetchPosts()
    return posts;
}

export default function Feed() {
    const posts = useLoaderData()
    return (
        <>
            <div className="self-stretch w-full h-full flex-grow relative overflow-y-auto">
                <div className="absolute w-full flex-auto flex flex-col gap-8 py-2.5 px-5 md:px-[25%] items-center">
                    {
                        posts.map((post: any) => (
                            <Post
                                key={post.id}
                                id={post.id}
                                author={post.author}
                                text={post.text}
                                time={post.time}
                                image={post.image}
                            />
                        ))
                    }
                </div>
            </div>
            <div>
                <PostEditor />
            </div>
        </>
    )
}