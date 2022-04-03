import { ReactNode } from 'react';
import { Link as MuiLink } from '@mui/material';

type LinkProps = {
  children?: ReactNode,
  href?: string
};

function Link({ href, children }: LinkProps) {
  const handleOpen = () => {
    if (href) {
      window.ddClient.host.openExternal(href);
    }
  };

  return (
    <MuiLink
      variant="body1"
      sx={{
        cursor: 'pointer',
        color: theme => theme.palette.mode === 'dark' ? '#00D1CA' : '#1ca8b8'
      }}
      onClick={handleOpen}
    >
      {children}
    </MuiLink>
  );
}

export default Link;