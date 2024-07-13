import { Suspense } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { BlockletStudio } from '@blocklet/ui-react';
import ProfileDisplay from '../components/profile-display';
import Navbar from '../components/navbar';
import './home.css';

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  console.log('isMobile', isMobile);
  return (
    <main className="page-container">
      <Navbar />
      {/* <RequestProfileConnect /> */}
      <div className="flex flex-col sm:flex-row w-full p-4 gap-4">
        <div className="w-full min-w-[375px] sm:w-[375px] bg-blue-500 text-white p-4 mb-4 sm:mb-0 rounded">

          <Suspense fallback={<div>Loading...</div>}>
            <ProfileDisplay />
          </Suspense>

        </div>
        <div className="w-full sm:flex-grow bg-green-500 text-white p-4 rounded">
          test
          <BlockletStudio
            // mode="dialog"
            tenantScope={'zNKZf4onrVd5VLadbwHTHG99H2upX5oJAusQ'}
            componentDid={'zNKZf4onrVd5VLadbwHTHG99H2upX5oJAusQ'}
            open={false}
            setOpen={() => ''}
            onOpened={() => ''}
          />
        </div>
      </div>
    </main >
  );
}

export default Home;
