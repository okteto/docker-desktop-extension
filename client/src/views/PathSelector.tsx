import { ChangeEvent, useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';

import okteto from '../api/okteto';

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
    <Box sx={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: 2
      }}>
        <FormControl sx={{ flex: 1, width: '100%'}}>
          <FormLabel>Docker-compose.yml full path:</FormLabel>
          <TextField
            defaultValue={defaultPath}
            hiddenLabel
            placeholder="/path/to/your/docker-compose"
            onChange={handlePathChange}
          />
        </FormControl>

        <Button variant="contained" size="large" onClick={() => onLaunch?.(path)}>
          Launch Remote Environment
        </Button>

        {false && <Button variant="contained" size="large" onClick={async () => {
          const contexts = await okteto.getContextList();
          console.log(contexts);
        }}>
          Login
        </Button>}
      </Box>
    </Box>
  );
}

export default PathSelector;