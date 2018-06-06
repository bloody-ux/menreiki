import routes from '../core/routes';
import { getFinalizedRoutes, updateStore, getPageName } from '../core/common';
import { getRequestPath, createApp, httpHandler, ssrHandler } from '../core/server';

export default webpackResult => async(req, res, next) => {
  let handled = false;
  const onError = (err) => {
    // prevent duplicated error handling
    if (handled) return;
    handled = true;
    next(err);
  };

  try {
    const app = createApp(onError);
    const path = getRequestPath(req);
    const finalizedRoutes = await getFinalizedRoutes(routes, path);
    await updateStore(finalizedRoutes, app, SSR, req);
    const pageName = getPageName(finalizedRoutes);

    (SSR ? ssrHandler : httpHandler)(req, res, app, webpackResult, pageName);
  } catch (ex) {
    onError(ex);
  }
};
