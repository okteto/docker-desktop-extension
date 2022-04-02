import { ChangeEvent, useState } from 'react';
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

import { useOkteto } from '../contexts/Okteto.context';
import okteto from '../api/okteto';

const defaultPath = '/Users/rlamana/Repositories/okteto/compose-getting-started/docker-compose.yml';

function SelectCompose() {
  const { launchEnvironment } = useOkteto();
  const [path, setPath] = useState(defaultPath);

  const handlePathChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPath(e.target.value);
  };

  const handleLaunch = () => {
    launchEnvironment(path);
  };

  return (
    <>
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
            onClick={handleLaunch}
          >
            Launch Remote Environment
          </Button>

          <Button
            variant="contained"
            size="large"
            sx={{ fontSize: '1rem', height: '3.2rem' }}
            onClick={() => {
              okteto.getEndpointsList(defaultPath);
            }}
          >
            Test
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default SelectCompose;