import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

const WAIT_BEFORE_SHOW = 1000;

function Loader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), WAIT_BEFORE_SHOW);
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}>
      {show &&
        <CircularProgress />
      }
    </Box>
  );
}

export default Loader;