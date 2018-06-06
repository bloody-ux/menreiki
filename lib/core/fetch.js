import fetch from 'isomorphic-fetch';

function getDefaultHeader(req, credential) {
  const header = {};

  if (req && req.headers) {
    if (credential) {
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
 * @param {IncomingMessage} req http request
 * @param {Boolean} credential whether pass cookie to remote server
 */
export default function fetchFactory(req, credential = true) {
  const defaultHeaders = getDefaultHeader(req, credential);

  return function(url, options = {}) {
    url = normalizeUrl(url, req);
    const { headers, ...restOptions } = options;

    return fetch(url, {
      headers: {
        ...defaultHeaders,
        headers,
      },
      ...restOptions,
    });
  };
}
