import { useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
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
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            borderRight: '1px solid',
            borderColor: theme.palette.divider,
            height: '100%',
            justifyContent: 'center',
            pr: 6,
          }}
        >
          <img
            src={theme.palette.mode === 'dark' ? logoDark : logoLight}
            width="240"
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'start',
            gap: 2,
          }}
        >
          <Typography variant="h4" component="div" sx={{ maxWidth: '620px' }}>
            Ready to level up your development experience with Okteto?
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: 1,
              width: '100%',
            }}
          >
            <Card
              variant="outlined"
              sx={{
                width: '100%',
                maxWidth: '500px',
                background: 'transparent',
                border: 0
              }}
            >
              <Box
                sx={{
                  m: 2,
                  flexDirection: 'column',
                  display: 'flex',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.12)'
                          : 'rgba(0, 0, 0, 0.12)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    1
                  </Box>
                  <Typography variant="h5" component="div">
                    Install Okteto on your Kubernetes cluster:
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: '40px'
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ fontSize: '1.1rem' }}
                    onClick={handleTrial}
                  >
                    Install Okteto for Free
                  </Button>
                </Box>
              </Box>
            </Card>

            <Card
              variant="outlined"
              sx={{
                width: '100%',
                maxWidth: '500px',
                background: 'transparent',
                border: 0,
              }}
            >
              <Box
                sx={{
                  m: 2,
                  flexDirection: 'column',
                  display: 'flex',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.12)'
                          : 'rgba(0, 0, 0, 0.12)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    2
                  </Box>
                  <Typography variant="h5" component="div">
                    Configure the context pointing to your cluster:
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: '40px'
                  }}
                >
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
            </Card>
          </Box>
        </Box>
      </Box>
      <ContextDialog open={open} onClose={handleCloseDialog} />
    </Box>
  );
}

export default Login;
