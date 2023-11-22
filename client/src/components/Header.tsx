import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import { useOkteto } from '../contexts/Okteto.context';
import logoDark from '../images/logo-dark.svg';
import logoLight from '../images/logo-light.svg';
import ContextSelector from './ContextSelector';

function Header({ noLogo = false }) {
  const theme = useTheme();
  const { loading } = useOkteto();

  return (
    <>
      <Box sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%'
      }}>
        {loading &&
          <LinearProgress />
        }
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderRadius: 1,
        py: 2,
        px: 1,
        gap: 1
      }}>
        {!noLogo && 
          <img src={theme.palette.mode === 'dark' ? logoDark : logoLight} width="100" />
        }
        <div style={{ flex: '1 auto' }} />
        <Typography variant="body2">
          Connected to:
        </Typography>

        <ContextSelector />
      </Box>
    </>
  );
}

export default Header;