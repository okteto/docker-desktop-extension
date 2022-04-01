import { ReactNode } from 'react';
import { Box } from '@mui/material';

type OutputProps = {
  children?: ReactNode
};

function Output({ children }: OutputProps) {
  return (
    <Box component="code" sx={{
      display: 'block',
      flex: 1,
      width: '100%',
      px: 3,
      py: 2,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
      color: theme => theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
      border: '0',
      borderRadius: 2,
      fontSize: '0.8rem',
      fontWeight: 'normal',
      overflowX: 'hidden',
      overflowY: 'auto'
    }}>
      <Box component="pre" sx={{ m: 0, p: 0 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Output;