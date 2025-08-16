// App.tsx
import { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const App = (): ReactElement => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    return <Navigate to="/" />; // redirect to landing if not signed in
  }

  return <Outlet />;
};

export default App;
