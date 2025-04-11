import { Link } from "react-router-dom"
import Logout from "../../ui/Logout"
import Searchbar from "../../ui/Searchbar"

export default function Header() {
    return (
        <>
            <div className="bg-main-white sticky flex px-5 py-2.5 gap-5 items-center border-b-[1px] border-main-grey">
                <Link to='/' className="w-fit"><img src="/assets/Logo.png" alt="logo" className="md:min-w-25"/></Link>
                <div className="h-[3rem] md:w-full"></div>
                <Searchbar />
                <Logout />
            </div>
        </>
    )
}