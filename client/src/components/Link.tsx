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
    <MuiLink variant="body1" sx={{ cursor: 'pointer', color: '#00D1CA' }} onClick={handleOpen}>
      {children}
    </MuiLink>
  );
}

export default Link;