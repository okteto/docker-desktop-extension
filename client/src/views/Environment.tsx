import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LinkIcon from '@mui/icons-material/Link';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import ReplayIcon from '@mui/icons-material/Replay';
import { useTheme } from '@mui/material/styles';
import useInterval from 'use-interval';

import { colors } from '../components/Theme';
import { useOkteto } from '../contexts/Okteto.context';
import okteto from '../api/okteto';
import Output from '../components/Output';
import Atom from '../components/Atom';
import Link from '../components/Link';

const ENDPOINTS_POLLING_INTERVAL = 5000;

function Environment() {
  const theme = useTheme();
  const { output, environment, stopEnvironment, redeployEnvironment } = useOkteto();
  const [endpoints, setEndpoints] = useState<Array<string>>([]);

  const handleOpenEnvironment = () => {
    if (environment) {
      window.ddClient.host.openExternal(environment.link);
    }
  };

  useInterval(async () => {
    if (!environment) return;
    const list = await okteto.endpoints(environment.file, environment.contextName);
    setEndpoints(list);
  }, ENDPOINTS_POLLING_INTERVAL);

  const iconColor = theme.palette.mode === 'dark' ? '#B0BCD7' : '#888';

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        bgcolor: theme => theme.palette.mode === 'dark' ? colors.card.primary.dark : colors.card.primary.light,
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
            Dev Environment
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
            sx={{
              bgcolor: colors.brand.green.light,
              '&:hover': {
                filter: 'brightness(.9)',
                bgcolor: colors.brand.green.light,
              }
            }}
            startIcon={<ReplayIcon />}
            onClick={redeployEnvironment}
          >
            Redeploy
          </Button>
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
          label="Okteto Manifest:"
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
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        bgcolor: '#101010',
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: 1,
        m: 0,
        px: 3,
        py: 2,
        pr: .5,
        pb: 0,
        gap: 1,
        overflow: 'hidden'
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Output
        </Typography>
        <Output output={output} />
      </Box>
    </>
  );
}

export default Environment;