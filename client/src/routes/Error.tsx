import { useNavigate } from "react-router-dom";

export default function Error() {
    const navigate = useNavigate();
    // const location = useLocation();
    // const error = location.state?.errorMessage || "Unfortunately, no information is available.";

    return (
        <div className="h-full w-full flex flex-col gap-10 p-2.5 items-center justify-center">
            <img src="assets/LogoErreur.png" alt="error" className="w-24"/>
            <p className="text-main-slate">An error occured...</p>
            <button onClick={() => navigate(-1)} className="flex p-2.5 rounded-4xl bg-main-black text-white hover:cursor-pointer">Go Back</button>
            {/* <div className="flex flex-col max-w-96 p-2.5 gap-2.5 items-center">
                <p className="text-main-grey">More information :</p>
                <p>
                    {error}
                </p>
            </div> */}
        </div>
    )
}