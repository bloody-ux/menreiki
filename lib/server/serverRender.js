import routes from '../core/routes';
import { getFinalizedRoutes, updateStore, getPageName } from '../core/common';
import { getRequestPath, createApp, httpHandler } from '../core/server';
import { setOrigin } from '../core/fetch';

export default webpackResult => async(req, res, next) => {
  let handled = false;
  const onError = (err) => {
    // prevent duplicated error handling
    if (handled) return;
    handled = true;
    next(err);
  };

  try {
    // updated origin to configuration
    setOrigin(`${req.protocol}://${req.headers.host}`);

    const app = createApp(onError);
    const path = getRequestPath(req);
    const finalizedRoutes = await getFinalizedRoutes(routes, path);
    await updateStore(finalizedRoutes, app);
    const pageName = getPageName(finalizedRoutes);

    httpHandler(req, res, app, webpackResult, pageName);
  } catch (ex) {
    onError(ex);
  }
};
