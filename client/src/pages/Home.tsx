// Home.tsx
import { ReactElement } from 'react';
import { UserButton } from '@clerk/clerk-react';

const Home = (): ReactElement => {
  return (
    <div>
      <UserButton />
    </div>
  );
};

export default Home;
