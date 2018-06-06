import fetch from 'isomorphic-fetch';

function getDefaultHeader(req, needCookie) {
  let header = null;

  if (req && req.headers) {
    header = {};
    if (needCookie) {
      header.Cookie = req.headers.cookie;
    }
    header['User-Agent'] = req.headers['user-agent'];
    header.Referer = req.headers.referer;
  }

  return header;
}

export function normalizeUrl(url, req) {
  if (!req) return url;

  const origin = `${req.protocol}://${req.headers.host}`;
  // 是否是以http/ https开头
  if (!/^https?:\/\//.test(url) && origin) {
    return origin + url;
  }

  return url;
}

/**
 * create a fetch instance with current `req` as context
 * @param {url} target url
 * @param {Object} options fetch options
 */
export default function request(url, options = {}) {
  const { req, credentials, headers, ...rest } = options;
  const needCookie = credentials === 'include' || credentials === 'same-origin';
  const defaultHeaders = getDefaultHeader(req, needCookie);
  url = normalizeUrl(url, req);

  const finalOptions = rest;

  if (headers || defaultHeaders) {
    finalOptions.headers = {
      ...headers,
      ...defaultHeaders,
    };
  }

  finalOptions.credentials = credentials;

  return fetch(url, finalOptions);
}

request.raw = fetch;
