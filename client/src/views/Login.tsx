import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import logoDark from '../images/logo-dark.svg';
import logoLight from '../images/logo-light.svg';
import { useOkteto } from '../contexts/Okteto.context';

function Login() {
  const theme = useTheme();
  const { login } = useOkteto();

  const handleLogin = () => {
    login();
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
      <img src={theme.palette.mode === 'dark' ? logoDark : logoLight} width="240" />

      <Typography variant="h4">
      Hybrid Development made Simple
      </Typography>

      <Typography variant="h6" sx={{ maxWidth: '650px', textAlign: 'center' }}>
        Seamlessly combine Docker Desktop's local containers with cloud-based Kubernetes clusters and experiment the future of cloud-native development
      </Typography>

      <Button
        variant="contained"
        size="large"
        sx={{ mt: '20px', fontSize: '1.1rem' }}
        onClick={handleLogin}
      >
        Login
      </Button>
    </Box>
  );
}

export default Login;