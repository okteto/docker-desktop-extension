import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';

import Output from '../components/Output';

type LoginProps = {
};

function Login({}: LoginProps) {
  return (
    <Box sx={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 1
    }}>
      <Button variant="contained" size="large">
        Login
      </Button>
    </Box>
  );
}

export default Login;