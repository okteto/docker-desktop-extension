import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import logoDark from '../images/logo-dark.svg';
import logoLight from '../images/logo-light.svg';
import ContextDialog from '../components/ContextDialog';

function Login() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  
  const handleTrial = () => {
    window.ddClient.host.openExternal('https://www.okteto.com/free-trial/');
  }

  return (
    <Box sx={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 2
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6
      }}>
        <Box sx={{
          display: 'flex',
          borderRight: '1px solid',
          borderColor: 'white',
          height: '100%',
          justifyContent: 'center',
          pr: 6,
        }}>
          <img src={theme.palette.mode === 'dark' ? logoDark : logoLight} width="240" />
        </Box>
        <Box sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          alignItems: 'start',
          gap: 2
        }}>
          <Typography variant="h5" component="div">
            Ready to level up your development experience with Okteto?<br/>
            Install Okteto on your Kubernetes cluster.
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Button
              variant="contained"
              size="large"
              sx={{ fontSize: '1.1rem' }}
              onClick={handleTrial}
            >
              Try for Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ fontSize: '1.1rem' }}
              onClick={handleOpenDialog}
            >
              Add your context
            </Button>
          </Box>
        </Box>
      </Box>
      <ContextDialog open={open} onClose={handleCloseDialog}/>
    </Box>
  );
}

export default Login;