import React from 'react';
import { hydrate, render } from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { Provider } from 'react-redux';
import { bootstrap } from '../core/client';
import App from '../core/App';

bootstrap()
  .then((store) => {
    const $hostElement = document.querySelector('#app');
    if (!$hostElement) {
      return console.error('#app doesn\'t exist on DOM');
    }

    return (SSR ? hydrate : render)(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>,
      $hostElement,
    );
  });
