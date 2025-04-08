import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './routes/Layout';
import Error from './routes/Error';

import Feed, {loader as feedLoader, forYouLoader as feedLoaderFollowed} from './routes/Feed';
import LoginMain from './routes/Login/LoginMain';
import Login from './routes/Login/Login';
import Signup from './routes/Login/Signup';
import Admin, {loader as adminLoader} from './routes/Admin/Admin';
import Users, {loader as adminUsersLoader} from './routes/Admin/Users';
import Posts, {loader as adminPostsLoader} from './routes/Admin/Posts';
import User, {loader as userLoader} from './routes/User/User';
import UserEdit from './routes/User/UserEdit';


const router = createBrowserRouter([
    {
        path: import.meta.env.BASE_URL, // Use the base URL for the root path
        element: <Layout />,
        children: [
            {
                path: import.meta.env.BASE_URL, // Feed route
                element: <Feed />,
                loader: feedLoader,
            },
            {
                path: `${import.meta.env.BASE_URL}user/:username`, // User profile route
                element: <User />,
                loader: userLoader,
            },
            {
                path: `${import.meta.env.BASE_URL}user/:username/edit`, // User edit route
                element: <UserEdit />,
                loader: userLoader,
            },
            {
                path: `${import.meta.env.BASE_URL}foryou`, // For You feed route
                element: <Feed />,
                loader: feedLoaderFollowed,
            },
            {
                path: `${import.meta.env.BASE_URL}login`, // Login route
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
                path: '*', // Catch-all route for errors
                element: <Error />,
            },
            {
                path: `${import.meta.env.BASE_URL}admin`, // Admin dashboard route
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
                    },
                    {
                        path: 'posts',
                        element: <Posts />,
                        loader: adminPostsLoader
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
