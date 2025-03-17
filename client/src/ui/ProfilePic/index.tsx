import { Link } from "react-router-dom"

interface ProfilePicProps {
    size: number;
    image?: string;
    profile: string;
}

export default function ProfilePic({ size, image='placeholders/defaultpfp.png', profile }: ProfilePicProps) {
    return (
        <Link to={"profile"} style={
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