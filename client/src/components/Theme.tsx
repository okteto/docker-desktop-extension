import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';

export const ThemeProvider = DockerMuiThemeProvider;

export const colors = {
  card: {
    primary: {
      dark: '#37464e',
      light: 'grey.300'
    }
  },
  brand: {
    green: {
      dark: '#00D1CA',
      light: '#0e8e9d'
    }
  }
};

export const shadows = {
  primary: `
    0 100px 80px rgb(0 0 0 / 7%),
    0 42px 32px rgb(0 0 0 / 5%),
    0 22px 18px rgb(0 0 0 / 4%),
    0 12px 10px rgb(0 0 0 / 4%)
  `
};
