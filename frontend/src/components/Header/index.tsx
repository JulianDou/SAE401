import { Link } from "react-router-dom"

export default function Header() {
    return (
        <>
            <div className="bg-main-white sticky flex px-5 py-2.5 gap-5 items-center border-b-[1px] border-main-grey">
                <Link to={import.meta.env.BASE_URL} className="w-fit"><img src={import.meta.env.BASE_URL + "assets/Logo.png"} alt="logo"/></Link>
                <div className="h-[3rem] w-full"></div>
            </div>
        </>
    )
}