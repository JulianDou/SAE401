import { Link } from "react-router-dom"
import Logout from "../../ui/Logout"

export default function Header() {
    return (
        <>
            <div className="bg-main-white sticky flex px-5 py-2.5 gap-5 items-center border-b-[1px] border-main-grey">
                <Link to='/' className="w-fit"><img src="/assets/Logo.png" alt="logo" className="md:min-w-25"/></Link>
                <div className="h-[3rem] md:w-full"></div>
                <div className="flex rounded-full bg-main-grey px-2 py-1 gap-2 items-center justify-center">
                    <input 
                        type="text" placeholder="Search..." 
                        className="bg-main-grey text-sm outline-none px-2 py-1 rounded-full w-full min-w-20 md:min-w-40"
                    />
                    <img src="/assets/search.png" alt="search" className="w-5 h-5"/>
                </div>
                <Logout />
            </div>
        </>
    )
}