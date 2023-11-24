import { useTheme } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';

import { useOkteto } from '../contexts/Okteto.context';
import { shadows, colors } from '../components/Theme';
import diagramDark from '../images/diagram-dark.svg';
import diagramLight from '../images/diagram-light.svg';

function SelectManifest() {
  const theme = useTheme();
  const { selectManifest, loading } = useOkteto();

  const handleLaunch = async () => {
    const result = await window.ddClient.desktopUI.dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Okteto Manifest', extensions: ['yml', 'yaml'] }]
    });

    const { canceled, filePaths = [] } = result;
    if (!canceled && filePaths.length > 0) {
      selectManifest(filePaths[0]);
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

        <Typography variant="h6" sx={{ maxWidth: '400px', textAlign: 'center' }}>
          Select your Okteto Manifest or Docker Compose to launch your remote development environment.
        </Typography>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          gap: 1
        }}>
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

export default SelectManifest;
