import { Box, Button, Typography } from '@mui/material';

import logoDark from '../images/logo-dark.svg';

type HeaderProps = {};

function Header({}: HeaderProps) {
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
      <img src={logoDark} width="100" />
      <div style={{ flex: '1 auto' }} />
      <Typography variant="body2">
        Connected to: <strong>Okteto Cloud</strong>
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={() => {}}
      >
        Logout
      </Button>
    </Box>
  );
}

export default Header;