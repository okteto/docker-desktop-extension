import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import { OktetoProvider } from './contexts/Okteto.context';
import { App } from './App';

ReactDOM.render(
  <React.StrictMode>
    <OktetoProvider>
      <DockerMuiThemeProvider>
        <CssBaseline />
          <App />
      </DockerMuiThemeProvider>
    </OktetoProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
