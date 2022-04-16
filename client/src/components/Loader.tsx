import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

const WAIT_BEFORE_SHOW = 1000;

function Loader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), WAIT_BEFORE_SHOW);
    return (() => clearTimeout(t));
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {show &&
        <CircularProgress />
      }
    </Box>
  );
}

export default Loader;