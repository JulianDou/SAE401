import { Outlet } from 'react-router-dom';
import { fetchAdmin } from "../../data/loaders"
import { useLoaderData } from "react-router-dom"

export async function loader() {
    const users = await fetchAdmin()
    return users;
}

export default function Admin() {
    const data = useLoaderData();
    return (
        <div className="flex flex-col justify-center items-center self-stretch w-full h-full flex-grow relative overflow-y-auto">
            <div className="w-full flex justify-center items-center p-2">
                <p className="text-lg font-medium">{data.message}</p>
            </div>
            <Outlet />
        </div>
    )
}

