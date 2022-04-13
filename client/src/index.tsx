import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './components/Theme';
import { OktetoProvider } from './contexts/Okteto.context';
import { App } from './App';

ReactDOM.render(
  <React.StrictMode>
    <OktetoProvider>
      <ThemeProvider>
        <CssBaseline />
          <App />
      </ThemeProvider>
    </OktetoProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
