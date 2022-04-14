import { ChangeEvent, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

import { useOkteto } from '../contexts/Okteto.context';
import { shadows, colors } from '../components/Theme';
import diagramDark from '../images/diagram-dark.svg';
import diagramLight from '../images/diagram-light.svg';

const defaultFile = '';
//'/Users/rlamana/Repositories/okteto/microservices-demo-compose/docker-compose.yml';

function SelectCompose() {
  const theme = useTheme();
  const { selectEnvironment, loading } = useOkteto();
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
          Select a Compose file to launch your remote development environment.
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
              placeholder="/file/to/your/docker-compose.yml"
              onChange={handleFileChange}
            />
          </FormControl>

          <Button
            disabled={loading}
            variant="contained"
            size="large"
            sx={{ fontSize: '1rem', height: '3.2rem' }}
            onClick={handleLaunch}
          >
            Launch Remote Environment
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          px: 3,
          py: 2,
          m: 2,
          borderRadius: 2,
          boxShadow: shadows.primary,
          bgcolor: theme.palette.mode === 'dark' ? colors.card.primary.dark : colors.card.primary.light
        }}
      >
        <Typography variant="body1" sx={{ flex: 1 }}>
          <strong>New to Okteto?</strong><br />
          Learn how Okteto helps simplify the application development process by leveraging remote environments.
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{ fontSize: '.9rem' }}
          onClick={() => window.ddClient.host.openExternal('https://www.okteto.com/docs/')}
        >
          Read Docs
        </Button>
      </Box>
    </>
  );
}

export default SelectCompose;