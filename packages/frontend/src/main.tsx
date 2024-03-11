import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes } from '@generouted/react-router';
import { ChakraProvider } from '@chakra-ui/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <Routes />
    </ChakraProvider>
  </React.StrictMode>,
)
