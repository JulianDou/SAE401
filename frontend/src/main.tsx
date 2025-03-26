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
import User, {loader as userLoader} from './routes/User';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Feed />,
                loader: feedLoader,
            },
            {
                path: 'user/:username',
                element: <User />,
                loader: userLoader,
            },
            {
                path: 'login',
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
                path: 'admin',
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
