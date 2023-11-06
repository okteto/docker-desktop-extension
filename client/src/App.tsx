import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box } from '@mui/material';

import { useOkteto } from './contexts/Okteto.context';
import Header from './components/Header';
import Environment from './views/Environment';
import SelectCompose from './views/SelectCompose';
import Login from './views/Login';
import Loader from './components/Loader';

export function App() {
  createDockerDesktopClient();

  const { contextList, environment, ready } = useOkteto();
  const isLoggedIn = contextList?.length > 0;

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
            <Box sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              height: '100%',
              gap: 1
            }}>
              <Header />
              {environment?.file ?
                <Environment key={environment.file} /> :
                <SelectCompose />
              }
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
