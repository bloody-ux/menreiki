import routes from '../core/routes';
import { noop } from '../core';
import { getFinalizedRoutes, updateStore, getPageName } from '../core/common';
import { getRequestPath, createApp, httpHandler, ssrHandler } from '../core/server';

export default webpackResult => async(req, res, next) => {
  try {
    const app = createApp(noop); // dva's onError should do nothing, or else distaching returns an error will throw two times
    const path = getRequestPath(req);
    const finalizedRoutes = await getFinalizedRoutes(routes, path);
    await updateStore(finalizedRoutes, app, SSR, req);
    const pageName = getPageName(finalizedRoutes);

    (SSR ? ssrHandler : httpHandler)(req, res, app, webpackResult, pageName);
  } catch (ex) {
    next(ex);
  }
};
