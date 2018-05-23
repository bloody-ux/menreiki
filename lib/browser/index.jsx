import React from 'react';
import { hydrate } from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { Provider } from 'react-redux';
import { bootstrap } from '../core/client';
import App from '../core/App';
import config from '../core/config';

bootstrap()
  .then((store) => {
    hydrate(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>,
      document.querySelector(config.hostElement),
    );
  });
