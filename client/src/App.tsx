import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box } from '@mui/material';

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
  
  let step : AppStep = 'SelectManifest';
  if (!currentManifest) step = 'SelectManifest';
  else if (!currentDev) step = 'SelectDev';
  else step = 'RunEnvironment';

  return (
    <Box sx={{
      m: 0,
      py: 0,
      height: '100vh',
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0
    }}>
      {!ready ? (
        <Box sx={{ display: 'flex', height: '100%' }}>
          <Loader />
        </Box>
      ) : (
        <Box sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          height: '100%',
          gap: 1,
          px: 3,
          py: 2
        }}>
          {!isLoggedIn ? (
            <>
              <Header noLogo />
              <Login />
            </>
          ) : (
            <>
              <Header />
              {step == 'SelectManifest' &&
                <SelectManifest />
              }
              {step == 'SelectDev' &&
                <SelectDev />
              }
              {step == 'RunEnvironment' &&
                <>
                  {environment?.file &&
                    <Environment key={environment.file} /> 
                  }
                </>
              }
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
