import { useState } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box } from '@mui/material';

import { useOkteto } from './contexts/Okteto.context';
import PathSelector from './views/PathSelector';
import Environment from './views/Environment';
import Login from './views/Login';
import Loader from './views/Loader';

export function App() {
  const ddClient = createDockerDesktopClient();

  const { currentContext, loading } = useOkteto();
  const [path, setPath] = useState<string | null>(null);

  const handleLaunch = (path: string) => {
    setPath(path);
  };

  const handleReset = () => {
    setPath(null);
  };

  return (
    <Box sx={{
      m: 0,
      px: 1,
      py: 2,
      height: '100vh',
    }}>
      {loading ? <Loader /> : (
        <>
          {!currentContext ? (
            <Login />
          ) : (
            <>
              {path ?
                <Environment path={path} onReset={handleReset} /> :
                <PathSelector onLaunch={handleLaunch} />
              }
            </>
          )}
        </>
      )}
    </Box>
  );
}
