// main.tsx
import { StrictMode, ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import SignInPage from './pages/auth/SignInPage';
import Home from './pages/Home';
import Setting from './pages/Setting';
import Favorites from './pages/Favorites';
import LandingPage from './pages/Landing';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { MediaStoreProvider } from "@/context/MediaStore";
import { Toaster } from "react-hot-toast";
import SearchResults from './pages/SearchResults';


// Ensure VITE_CLERK_PUBLISHABLE_KEY exists
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const routes: RouteObject[] = [
  // Public routes
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/auth/sign-in',
    element: <SignInPage />
  },
  // Protected routes (wrapped in App for auth check)
  {
    element: <App />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/settings',
        element: <Setting />
      },
      {
        path: '/favorites',
        element: <Favorites/>
      },
      {
        path: "/search-results",
        element: <SearchResults/>
      }
    ]
  }
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <MediaStoreProvider>  
           <RouterProvider router={router} />
            <Toaster position="top-center" reverseOrder={false} />
        </MediaStoreProvider>
    </ClerkProvider>
  </StrictMode>
);

