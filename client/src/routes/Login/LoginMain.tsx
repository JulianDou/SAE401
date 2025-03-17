import { Outlet } from 'react-router-dom';

export default function LoginMain() {
    return (
        <div className="self-stretch w-full h-full flex-grow relative overflow-y-auto">
            <Outlet />
        </div>
    )
}