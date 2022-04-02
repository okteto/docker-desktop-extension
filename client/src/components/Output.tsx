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
      bgcolor: '#101010',
      color: 'grey.300',
      border: '0',
      borderRadius: 1,
      boxShadow: 1,
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