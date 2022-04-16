import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ConfirmProvider } from 'material-ui-confirm';

import { ThemeProvider } from './components/Theme';
import { OktetoProvider } from './contexts/Okteto.context';
import { App } from './App';

ReactDOM.render(
  <React.StrictMode>
    <OktetoProvider>
      <ThemeProvider>
        <CssBaseline />
        <ConfirmProvider>
          <App />
        </ConfirmProvider>
      </ThemeProvider>
    </OktetoProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
