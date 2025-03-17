import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './routes/Layout';
import Error from './routes/Error';

import Feed, {loader as feedLoader} from './routes/Feed';

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
                path: 'profile',
                element: <h1>Profile</h1>,
            },
            {
                path: 'notifications',
                element: <h1>Notifications</h1>,
            },
            {
                path: '*',
                element: <Error />,
            }
        ]
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
