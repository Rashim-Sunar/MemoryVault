// main.tsx
import { StrictMode, ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import SignInPage from './pages/auth/SignInPage';
import Home from './pages/Home';
import Setting from './pages/Setting';
import LandingPage from './pages/Landing';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';

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
      }
    ]
  }
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);

