import React from 'react';
import { hydrate } from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { Provider } from 'react-redux';
import { bootstrap } from '../core/client';
import App from '../core/App';
import config from '../core/config';

bootstrap()
  .then((store) => {
    const $hostElement = document.querySelector(config.hostElement);
    if (!$hostElement) {
      return console.error(`${config.hostElment} doesn't exist on DOM, please check \`menreiki.config.js > hostElement\``);
    }

    return hydrate(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>,
      $hostElement,
    );
  });
