import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import { App } from './App';
import { OktetoProvider } from './contexts/Okteto.context';

ReactDOM.render(
  <React.StrictMode>
    <DockerMuiThemeProvider>
      <CssBaseline />
      <OktetoProvider>
        <App />
      </OktetoProvider>
    </DockerMuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
