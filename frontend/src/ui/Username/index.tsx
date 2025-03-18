import { Link } from "react-router-dom";

interface UsernameProps {
    profile: string;
}

export default function Username(props: UsernameProps) {
    return (
        <Link to={"/profile?=" + props.profile} className="font-bold hover:cursor-pointer">{props.profile}</Link>
    );
}