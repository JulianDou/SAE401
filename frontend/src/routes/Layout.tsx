import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import Navbar from '../components/Navbar';

export default function Layout(){
    return (
        <>
            <Header />
            <main className='flex-auto flex flex-col-reverse md:flex-row'>
                <Navbar />
                <div className='flex flex-auto flex-col'>
                    <Outlet />
                </div>
            </main>
        </>
    )
}