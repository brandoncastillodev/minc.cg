import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx'
import Home from './componets/Home'
import Videos from './componets/Videos'
import Programming from './componets/Programming'
import Market from './componets/Market'
import AboutUs from './componets/AboutUs'
import ArticleCard from './commons/ArticleCard';
import ProductPage from './commons/ProductPage';
import { Analytics } from "@vercel/analytics/next"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "programming/:slug", element: <ArticleCard /> },
      { path: "programming", element: <Programming /> },
      { path: "videos", element: <Videos /> },
      { path: "market", element: <Market /> },
      { path: "market/:id", element: <ProductPage /> },
      { path: "about-us", element: <AboutUs /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Analytics />
    <RouterProvider router={router} />
  </StrictMode>,
)
