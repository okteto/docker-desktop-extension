import { useState } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, Button } from '@mui/material';

import PathSelector from './views/PathSelector';
import Environment from './views/Environment';

export function App() {
  const ddClient = createDockerDesktopClient();

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
      {!path &&
        <PathSelector onLaunch={handleLaunch} />
      }
      {path &&
        <Environment path={path} onReset={handleReset} />
      }
    </Box>
  );
}
