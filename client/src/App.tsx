import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, Select } from '@mui/material';

import { useOkteto } from './contexts/Okteto.context';
import Header from './components/Header';
import Environment from './views/Environment';
import SelectManifest from './views/SelectManifest';
import SelectDev from './views/SelectDev';
import Login from './views/Login';
import Loader from './components/Loader';

type AppStep =
  'SelectManifest' |
  'SelectDev' |
  'RunEnvironment';

export function App() {
  createDockerDesktopClient();

  const { contextList, currentManifest, currentDev, environment, ready } = useOkteto();
  const isLoggedIn = contextList?.length > 0;

  console.log(environment);
  
  let step : AppStep = 'SelectManifest';
  if (!currentManifest) step = 'SelectManifest';
  else if (!currentDev) step = 'SelectDev';
  else step = 'RunEnvironment';

  return (
    <Box sx={{
      m: 0,
      px: 0,
      py: 2,
      height: '100vh',
    }}>
      {!ready ? (
        <Box sx={{ display: 'flex', height: '100%' }}>
          <Loader />
        </Box>
      ) : (
        <>
          {!isLoggedIn ? (
            <Login />
          ) : (
            <>
              {step == 'SelectManifest' &&
                <Box sx={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'column',
                  height: '100%',
                  gap: 1
                }}>
                  <SelectManifest />
                </Box>
              }
              {step == 'SelectDev' &&
                <Box sx={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'column',
                  height: '100%',
                  gap: 1
                }}>
                  <SelectDev />
                </Box>
              }
              {step == 'RunEnvironment' &&
                <Box sx={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'column',
                  height: '100%',
                  gap: 1
                }}>
                  <Header />
                  {environment?.file &&
                    <Environment key={environment.file} /> 
                  }
                </Box>
              }
            </>
          )}
        </>
      )}
    </Box>
  );
}
