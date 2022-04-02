import { useState } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box } from '@mui/material';

import { useOkteto } from './contexts/Okteto.context';
import PathSelector from './views/PathSelector';
import Environment from './views/Environment';
import Login from './views/Login';
import Loader from './views/Loader';
import Header from './components/Header';

export function App() {
  const ddClient = createDockerDesktopClient();

  const { currentContext, loading, ready } = useOkteto();
  const [path, setPath] = useState<string | null>(null);
  const isLoggedIn = !!currentContext;

  const handleLaunch = (path: string) => {
    setPath(path);
  };

  const handleReset = () => {
    setPath(null);
  };

  return (
    <Box sx={{
      m: 0,
      px: 0,
      py: 2,
      height: '100vh',
    }}>
      {!ready || loading ? <Loader /> : (
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
              {path ?
                <Environment path={path} onReset={handleReset} /> :
                <PathSelector onLaunch={handleLaunch} />
              }
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
