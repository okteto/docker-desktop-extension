import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useOkteto } from '../contexts/Okteto.context';
import logoDark from '../images/logo-dark.svg';
import logoLight from '../images/logo-light.svg';

type HeaderProps = {};

function Header({}: HeaderProps) {
  const theme = useTheme();
  const { logout } = useOkteto();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      borderRadius: 1,
      py: 2,
      px: 1,
      gap: 2
    }}>
      <img src={theme.palette.mode === 'dark' ? logoDark : logoLight} width="100" />
      <div style={{ flex: '1 auto' }} />
      <Typography variant="body2">
        Connected to: <strong>Okteto Cloud</strong>
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={logout}
        sx={{
          color: theme => theme.palette.mode === 'dark' ? 'white' : 'primary',
          borderColor: theme => theme.palette.mode === 'dark' ? 'white' : 'primary'
        }}
      >
        Logout
      </Button>
    </Box>
  );
}

export default Header;