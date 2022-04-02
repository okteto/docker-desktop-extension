import { ReactNode } from 'react';
import { Box, Icon, Typography } from '@mui/material';

type AtomProps = {
  children?: ReactNode,
  label?: string,
  icon?: ReactNode
};

function Atom({ children, label, icon }: AtomProps) {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}>
        {icon}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {label &&
            <Typography variant="body1" sx={{ color: '#B0BCD7'}}>
              {label}
            </Typography>
          }
          {children}
        </Box>
      </Box>
    </>
  );
}

export default Atom;