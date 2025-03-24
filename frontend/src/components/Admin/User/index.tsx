import Username from "../../../ui/Username";
import ProfilePic from "../../../ui/ProfilePic";

interface UserProps {
    id: number;
    username: string;
    email: string;
    verified: boolean;
    admin: boolean;
}

export default function User(props: UserProps) {
    return (
        <div className="w-full p-2.5 gap-2.5 flex border-[1px] border-main-grey rounded-md">
            <ProfilePic id={props.id} username={props.username} size={4}/>
            <div className="w-full flex flex-col md:flex-row p-2.5 gap-2.5 after:content-[''] after:w-full after:md:w-[1px] after:h-[1px] after:md:h-full after:bg-main-grey after:order-1">
                <div className="flex flex-col gap-2.5 order-0">
                    <Username id={props.id} username={props.username} />
                    <p><span className="font-bold">ID : </span>{props.id}</p>
                </div>
                <div className="flex flex-col gap-2.5 order-3">
                    <p>{props.email}</p>
                    <div className="flex gap-2.5">
                        <div className="flex gap-2.5 after:content-[''] after:w-[1px] after:h-full after:bg-main-grey">
                            <p className="font-bold">Verified</p>
                            <input type="checkbox" readOnly checked={props.verified} />
                        </div>
                        <div className="flex gap-2.5">
                            <p className="font-bold">Admin</p>
                            <input type="checkbox" readOnly checked={props.admin} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}