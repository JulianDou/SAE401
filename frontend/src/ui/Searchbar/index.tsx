import { api_url } from "../../data/loaders"

export default function Searchbar() {
    function showHelp() {
        const helpText = "Need help ? \n\n You can use the following settings :\n - from:username to search for posts from a specific user \n Other searches will simply search for text.";
        alert(helpText);
    }

    function search() {
        const token = localStorage.getItem("auth_token");
        const input = document.querySelector("#search-input") as HTMLInputElement;
        const query = input.value;

        if (query.length === 0) {
            return;
        }

        fetch(api_url + "posts/search?query=" + query, {
            method: "GET",
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
                    // Handle the search results here
                    console.log(data);
                }
            })
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    return (
        <div 
            className="relative flex px-2 py-0.5 bg-main-grey rounded-full"
        >
            <input 
                id="search-input"
                type="text" placeholder="Search..." 
                className="
                    text-sm outline-none px-2 py-1 
                    w-full min-w-20 md:min-w-40
                "
            />
            <div 
                onClick={search}
                className="flex w-5 h-7 items-center justify-center hover:cursor-pointer"
            >
                <img src="/assets/icons/search.svg" alt="search" className="w-5 h-5"/>
            </div>

            <div
                onClick={showHelp}
                className="absolute h-4 w-4 top-1 right-1 translate-x-1/2 -translate-y-1/2 text-center select-none
                rounded-full bg-main-white border-[1px] border-main-grey text-xs text-main-grey hover:cursor-pointer"
            >
                ?
            </div>
        </div>
    )
}