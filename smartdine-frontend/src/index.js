import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/usercontext';
import '@mantine/core/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Notifications />
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </MantineProvider>
);
