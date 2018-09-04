import NProgress from 'nprogress';
import { getApp } from './model';
import { logError } from './clue';
import { onRouteChanged, onRouteChanging, onError } from './config';
import { getFinalizedRoutes, updateStore, getPageName } from './common';

function tryUpdatedPageMeta(matchedRoutes) {
  if (typeof window === 'undefined') return;

  let pageNameMeta = document.querySelector('meta[name=pagename]');
  if (!pageNameMeta) {
    pageNameMeta = document.createElement('meta');
    pageNameMeta.name = 'pagename';
    document.querySelector('head').appendChild(pageNameMeta);
  }

  let title = document.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    document.querySelector('head').appendChild(title);
  }

  pageNameMeta.content = getPageName(matchedRoutes);
  title.textContent = pageNameMeta.content;
}

export function routeChanged(location, prevLocation) {
  if (location === prevLocation) return false;

  if (location.pathname === prevLocation.pathname &&
    location.search === prevLocation.search &&
    location.state === prevLocation.state
  ) {
    return false;
  }

  return true;
}

export function handleError(err, context) {
  const result = onError(err, context);
  // if onError returns false, means prevent default error handling
  if (result !== false) {
    console.error(err);
    logError(err);
  }
}

export async function loadAsync(
  routes, path, matchedRoutes, options,
) {
  NProgress.start();

  let finalizedRoutes = null;

  try {
    options = {
      routes,
      path,
      ...options,
    };

    tryUpdatedPageMeta(matchedRoutes);
    // before route changing
    await onRouteChanging(matchedRoutes, options);

    finalizedRoutes = await getFinalizedRoutes(routes, path);

    NProgress.set(0.4); // set to 40% after loading codebase
    try {
      await updateStore(finalizedRoutes, getApp());
    } catch (_) {
      // 不处理dva2次报错
    }
    NProgress.set(0.8); // set to 80% after dispatching action

    // after route changing
    await onRouteChanged(finalizedRoutes, options);
  } catch (ex) {
    handleError(ex, {
      finalizedRoutes,
      options,
    });
  } finally {
    NProgress.done();
  }
}
