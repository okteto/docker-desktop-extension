import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import { GlobalStyles } from '@mui/material';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';

export const colors = {
  card: {
    primary: {
      dark: '#37464e',
      light: 'grey.300',
    },
  },
  brand: {
    green: {
      dark: '#00D1CA',
      light: '#0e8e9d',
    },
  },
};

export const shadows = {
  primary: `
    0 100px 80px rgb(0 0 0 / 7%),
    0 42px 32px rgb(0 0 0 / 5%),
    0 22px 18px rgb(0 0 0 / 4%),
    0 12px 10px rgb(0 0 0 / 4%)
  `,
};

type ThemeProviderProps = {
  children?: ReactNode;
};

export default ({ children }: ThemeProviderProps) => {
  return (
    <DockerMuiThemeProvider>
      <ThemeProvider
        theme={(theme: Theme) =>
          createTheme({
            ...theme,
            // Here override of the theme.
            components: {
              ...theme.components,
              MuiMenu: {
                styleOverrides: {
                  ...theme.components?.MuiMenu?.styleOverrides,
                  paper: {
                    boxShadow: shadows.primary,
                  },
                },
              },
              MuiMenuItem: {
                styleOverrides: {
                  ...theme.components?.MuiMenuItem?.styleOverrides,
                  root: {
                    '&:hover': {
                      backgroundColor: theme.palette.divider
                    },
                  },
                },
              },
            },
          })
        }
      >
        <GlobalStyles
          styles={{
            body: {
              margin: 0,
            },
          }}
        />
        {children}
      </ThemeProvider>
    </DockerMuiThemeProvider>
  );
};
