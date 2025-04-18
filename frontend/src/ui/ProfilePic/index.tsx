import { Link } from "react-router-dom"

interface ProfilePicProps {
    size: number;
    image?: string;
    id: number;
    username: string;
}

export default function ProfilePic({ size, image=(import.meta.env.BASE_URL + 'placeholders/defaultpfp.png'), id, username }: ProfilePicProps) {

    return (
        <Link to={import.meta.env.BASE_URL + "user/" + username} data-userid={id} style={
            {
                width: `${size}rem`,
                aspectRatio: '1/1',
                height: `${size}rem`,
                borderRadius: '100%',
                background: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }
        }></Link>
    )
}