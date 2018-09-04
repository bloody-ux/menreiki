/* eslint-disable import/order */
import '../core/polyfill';
import { getPublicPath } from './util';

// eslint-disable-next-line
__webpack_public_path__ = getPublicPath(); // 为懒加载添加cdn支持


/* eslint-disable import/first */
import React from 'react';
import { render } from 'react-dom';
// eslint-disable-next-line
import Router from 'react-router-dom/BrowserRouter';
import { Provider } from 'react-redux';
import { bootstrap } from '../core/model';
import App from './App';
import { router } from '../core/config';
import routes from '../core/routes';

import 'nprogress/nprogress.css';

bootstrap(routes)
  .then((store) => {
    const $hostElement = document.querySelector(ELEMENTID);
    if (!$hostElement) {
      return console.error(`${ELEMENTID} doesn't exist on DOM`);
    }

    return render(
      <Provider store={store}>
        <Router {...router}>
          <App routes={routes} />
        </Router>
      </Provider>,
      $hostElement,
    );
  });
