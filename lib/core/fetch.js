import config from './config';

/**
 * make relative url to absolute url
 */
export function normalizeUrl(url) {
  // 是否是以http/ https开头
  const { origin } = config;
  if (!/^https?:\/\//.test(url) && origin) {
    return origin + url;
  }

  return url;
}
