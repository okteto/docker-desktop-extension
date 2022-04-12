import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinkIcon from '@mui/icons-material/Link';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import { useTheme } from '@mui/material/styles';
import useInterval from 'use-interval';

import { useOkteto } from '../contexts/Okteto.context';
import okteto from '../api/okteto';
import Output from '../components/Output';
import Atom from '../components/Atom';
import Link from '../components/Link';

const ENDPOINTS_POLLING_INTERVAL = 5000;

function Environment() {
  const theme = useTheme();
  const { environment, stopEnvironment } = useOkteto();
  const [endpoints, setEndpoints] = useState<Array<string>>([]);
  const [output, setOutput] = useState('');

  const handleOpenEnvironment = () => {
    if (environment) {
      window.ddClient.host.openExternal(environment.link);
    }
  };

  useEffect(() => {
    if (!environment?.file) return;
    okteto.up(environment.file, (stdout) => {
      setOutput(stdout);
    });
  }, [environment]);

  useInterval(async () => {
    if (!environment?.file) return;
    const { value, error } = await okteto.endpoints(environment?.file);
    if (!error && value) {
      setEndpoints(value);
    }
  }, ENDPOINTS_POLLING_INTERVAL);

  const iconColor = theme.palette.mode === 'dark' ? '#B0BCD7' : '#BABABA';

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        bgcolor: theme => theme.palette.mode === 'dark' ? '#13222a' : 'grey.200',
        border: '1px solid',
        borderColor: theme => theme.palette.mode === 'dark' ? 'transparent' : 'grey.300',
        borderRadius: 1,
        px: 3,
        py: 2,
        gap: 2,
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          width: '100%',
          gap: 1
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Remote Environment
          </Typography>

          <div style={{ flex: '1 auto' }} />

          {environment?.link &&
            <Button
              variant="contained"
              color="primary"
              startIcon={<OpenInBrowserIcon />}
              onClick={handleOpenEnvironment}
            >
              Open in Okteto
            </Button>
          }

          <Button
            variant="contained"
            color="error"
            startIcon={<StopCircleIcon />}
            onClick={stopEnvironment}
          >
            Stop
          </Button>
        </Box>

        <Atom
          label="Compose File:"
          icon={<InsertDriveFileIcon htmlColor={iconColor} />}
        >
          <Typography variant="body1">{environment?.file}</Typography>
        </Atom>

        <Atom
          label="Endpoints:"
          icon={<LinkIcon htmlColor={iconColor} />}
        >
          {endpoints.length === 0 &&
            <Typography variant="body1">No endpoints available</Typography>
          }
          {endpoints.map(endpoint => (
            <Link href={endpoint} key={endpoint}>
              {endpoint}
            </Link>
          ))}
        </Atom>
      </Box>

      <Output output={output ?? ''} />
    </>
  );
}

export default Environment;