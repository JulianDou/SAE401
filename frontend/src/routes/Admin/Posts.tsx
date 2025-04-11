import { fetchPosts } from "../../data/loaders"
import { useLoaderData } from "react-router-dom"
import PostAdminEdit from "../../components/Admin/Post"

export async function loader() {
    const users = await fetchPosts()
    return users;
}

export default function Posts() {
    const posts = useLoaderData();
    return (
        <>
            <div className="self-stretch w-full h-full flex-grow relative overflow-y-auto">
                <div className="absolute w-full flex-auto flex flex-col gap-8 py-2.5 px-5 md:px-[25%] items-center">
                    {
                        posts.map((post: any) => (
                            <PostAdminEdit 
                                key={post.id}
                                id={post.id}
                                text={post.text}
                                time={post.time}
                                author={
                                    {
                                        id: post.author.id,
                                        username: post.author.username,
                                        avatar: post.author.avatar ? (import.meta.env.VITE_API_URL + post.author.avatar) : (import.meta.env.BASE_URL + 'placeholders/defaultpfp.png')
                                    }
                                }
                                media={post.media}
                                replyCount={post.reply_count}
                                censored={post.is_censored}
                            />
                        ))
                    }
                </div>
            </div>
        </>
    )
}