import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Icon from "../../ui/Icon";

export default function Navbar() {
    const location = useLocation();
    const [activeIcon, setActiveIcon] = useState("home");
    const username = localStorage.getItem("username");

    useEffect(() => {
        const path = location.pathname;
        if (path === "/") {
            setActiveIcon("home");
        } else if (path.startsWith("/login") || path.startsWith("/user")) {
            setActiveIcon("profile");
        } else if (path === "/foryou") {
            setActiveIcon("followed");
        }
    }, [location]);

    return (
        <>
            <div className="flex flex-row md:flex-col px-6 py-3 justify-between md:justify-start pb-12 md:pb-0 md:gap-8 self-stretch border-r-0 border-t-[1px] md:border-r-[1px] md:border-t-0 border-main-grey">
                <Icon icon="home" link="/" active={activeIcon === "home"} />
                <Icon icon="profile" link={username? ("/user/" + username) : "/login"} active={activeIcon === "profile"} />
                <Icon icon="followed" link="/foryou" active={activeIcon === "followed"} />
            </div>
        </>
    );
}