import { Link } from "react-router-dom";

interface IconProps {
    icon: string;
    link: string;
    active: boolean;
    onClick?: () => void;
}

export default function Icon(props: IconProps) {
    const src = import.meta.env.BASE_URL + "assets/icons/" + props.icon + "_" + props.active.toString() + ".svg";

    return (
        <>
            <Link to={props.link} className="flex items-center justify-center w-6 h-6 aspect-square" onClick={props.onClick}>
                <img src={src} alt={props.icon + " icon"} />
            </Link>
        </>
    );
}