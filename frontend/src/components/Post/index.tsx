import ProfilePic from "../../ui/ProfilePic";
import Image from "../../ui/Image";
import Username from "../../ui/Username";
import Likes from "../../ui/Likes/Index";

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
}

export default function Post(props: PostProps) {
    const userid = localStorage.getItem("user_id");
    
    const formattedTime = new Date(props.time).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return (
        <div className="flex gap-3 w-full">
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
                <div className="flex gap-2 justify-end">
                    <Likes 
                        postId={props.id} 
                        count={props.likes.length} 
                        liked={props.likes.some((like) => like.id === parseInt(userid ? userid : "0", 10))}
                    />
                </div>
            </div>
        </div>
    )
}