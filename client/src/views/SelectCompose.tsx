import { ChangeEvent, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

import { useOkteto } from '../contexts/Okteto.context';
import diagramDark from '../images/diagram-dark.svg';
import diagramLight from '../images/diagram-light.svg';

const defaultFile = '';
// /Users/rlamana/Repositories/okteto/compose-getting-started/docker-compose.yml';

function SelectCompose() {
  const theme = useTheme();
  const { selectEnvironment } = useOkteto();
  const [file, setFile] = useState(defaultFile);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.value);
  };

  const handleLaunch = () => {
    if (file) {
      selectEnvironment(file);
    }
  };

  return (
    <>
      <Box sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: 4
      }}>
        <img
          src={theme.palette.mode === 'dark' ? diagramDark : diagramLight}
          width="240"
        />

        <Typography variant="h6" sx={{ maxWidth: '540px', textAlign: 'center' }}>
          Select a docker-compose.yml file to spin up a cloud environment with your application stack.
        </Typography>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          gap: 2
        }}>
          <FormControl sx={{ flex: 1, width: '100%', maxWidth: '540px'}}>
            <TextField
              defaultValue={defaultFile}
              hiddenLabel
              placeholder="/file/to/your/docker-compose"
              onChange={handleFileChange}
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
        </Box>
      </Box>
    </>
  );
}

export default SelectCompose;