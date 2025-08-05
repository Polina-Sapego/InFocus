import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios';
import '@styles/index.sass';
import NewsGrid from '@components/newsGrid';
import LogIn from '@components/logIn';

const router = createBrowserRouter([
  {
    path: '/',
    element: <NewsGrid />,
    loader: async () => {
      const res = await axios.get("http://localhost:3000/news");
      return res.data;
    },
  },
  {
    path: '/login',
    element: <LogIn />,
  },
  {
    path: '*',
    element: <div>404 – Страница не найдена</div>,
  },
]);

const domNode: HTMLElement = document.getElementById('root') as HTMLElement;
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
