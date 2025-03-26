import { Link } from "react-router-dom";

interface UsernameProps {
    username: string;
    id: number;
}

export default function Username(props: UsernameProps) {
    return (
        <Link to={"/user/" + props.username} data-userid={props.id} className="font-bold w-min hover:cursor-pointer">{props.username}</Link>
    );
}