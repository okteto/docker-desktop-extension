import { ChangeEvent, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';

import okteto from '../api/okteto';
import logoDark from '../images/logo-dark.svg';

type PathSelectorProps = {
  onLaunch?: (path: string) => void
};

const defaultPath = '/Users/rlamana/Repositories/okteto/compose-getting-started/docker-compose.yml';

function PathSelector({ onLaunch }: PathSelectorProps) {
  const [path, setPath] = useState(defaultPath);

  const handlePathChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPath(e.target.value);
  };

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        bgcolor: theme => theme.palette.mode === 'dark' ? '#13222a' : 'grey.800',
        borderRadius: 1,
        boxShadow: 2,
        py: 2,
        px: 3,
        mb: 2,
        gap: 2
      }}>
        <img src={logoDark} width="100" />
        <div style={{ flex: '1 auto' }} />
        <Typography variant="body2">
          Connected to: <strong>Okteto Cloud</strong>
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {}}
        >
          Logout
        </Button>
      </Box>

      <Box sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        width: '100%'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          gap: 1
        }}>
          <FormControl sx={{ flex: 1, width: '100%'}}>
            <TextField
              defaultValue={defaultPath}
              hiddenLabel
              placeholder="/path/to/your/docker-compose"
              onChange={handlePathChange}
            />
          </FormControl>

          <Button
            variant="contained"
            size="large"
            sx={{ fontSize: '1rem', height: '3.2rem' }}
            onClick={() => onLaunch?.(path)}
          >
            Launch Remote Environment
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default PathSelector;