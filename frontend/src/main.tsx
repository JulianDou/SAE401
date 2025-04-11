import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './routes/Layout';
import Error from './routes/Error';

import Feed, {loader as feedLoader} from './routes/Feed';
import LoginMain from './routes/Login/LoginMain';
import Login from './routes/Login/Login';
import Signup from './routes/Login/Signup';
import Admin, {loader as adminLoader} from './routes/Admin/Admin';
import Users, {loader as adminUsersLoader} from './routes/Admin/Users';


const router = createBrowserRouter([
    {
        path: import.meta.env.BASE_URL,
        element: <Layout />,
        children: [
            {
                path: import.meta.env.BASE_URL,
                element: <Feed />,
                loader: feedLoader,
            },
            {
                path: `${import.meta.env.BASE_URL}user`,
                element: <h1>Profile</h1>,
            },
            {
                path: `${import.meta.env.BASE_URL}login`,
                element: <LoginMain />,
                children: [
                    {
                        path: '',
                        element: <Login />,
                    },
                    {
                        path: 'signup',
                        element: <Signup />,
                    }
                ]
            },
            {
                path: '*',
                element: <Error />,
            },
            {
                path: `${import.meta.env.BASE_URL}admin`,
                element: <Admin />,
                loader: adminLoader,
                children: [
                    {
                        path: 'login',
                        element: <Login />,
                    },
                    {
                        path: 'users',
                        element: <Users />,
                        loader: adminUsersLoader
                    }
                ]
            }
        ]
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
