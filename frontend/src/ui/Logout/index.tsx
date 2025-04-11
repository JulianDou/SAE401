import { api_url } from "../../data/loaders";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const token = localStorage.getItem("auth_token");
    const navigate = useNavigate();

    function logout() {
        fetch(api_url + "logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Authorization": `${token}`
            },
        })
        .then((response) => {
            const res = response.json();
            if (!response.ok) {
                return res.then((err) => {
                    throw new Error(err.message || "An error occurred...");
                });
            }
            res.then((data) => {
                if (data.message === undefined) {
                    alert("An unexpected error occurred.");
                    return;
                }
                else {
                    alert(data.message);
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("isAuthenticated");
                    localStorage.removeItem("user_id");
                    navigate(import.meta.env.BASE_URL + "login");
                }
            })
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    return (
        <div onClick={logout} className="h-8 w-8 hover:cursor-pointer">
            <img className="w-full h-full" src={import.meta.env.BASE_URL + "assets/icons/exit.svg"} alt="logout" />
        </div>
    )
}