import { Box, CircularProgress } from '@mui/material';

function Loader() {
  return (
    <Box sx={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}>
      <CircularProgress />
    </Box>
  );
}

export default Loader;