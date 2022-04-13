import { ReactNode } from 'react';
import { Link as MuiLink, SxProps, Theme, TypographyProps } from '@mui/material';

import { colors } from './Theme';

type LinkProps = {
  children?: ReactNode
  href?: string
  variant?: TypographyProps['variant']
  sx?: SxProps<Theme>
  color?: string
};

function Link({ href, variant = 'body1', color, sx, children }: LinkProps) {
  const handleOpen = () => {
    if (href) {
      window.ddClient.host.openExternal(href);
    }
  };

  return (
    <MuiLink
      variant={variant}
      sx={{
        ...sx,
        cursor: 'pointer',
        color: theme => {
          if (color) return color;
          return theme.palette.mode === 'dark' ? colors.brand.green.dark : colors.brand.green.light;
        }
      }}
      onClick={handleOpen}
    >
      {children}
    </MuiLink>
  );
}

export default Link;