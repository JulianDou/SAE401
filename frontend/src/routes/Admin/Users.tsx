import { fetchUsers } from "../../data/loaders"
import { useLoaderData } from "react-router-dom"

export async function loader() {
    const users = await fetchUsers()
    return users;
}

export default function Users() {
    const users = useLoaderData()
    return (
        <>
            <div className="self-stretch w-full h-full flex-grow relative overflow-y-auto">
                <div className="absolute w-full flex-auto flex flex-col gap-8 py-2.5 px-5 md:px-[25%] items-center">
                </div>
            </div>
        </>
    )
}