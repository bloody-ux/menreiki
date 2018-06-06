import { fetch, parseUrl } from 'menreiki';

/**
 * base request api
 * @param {String} url target url
 * @param {Object} options fetch options
 */
export function request(url, options = {}) {
  function processError(err) {
    console.error(err);
    return Promise.reject(err || new Error('unkown error'));
  }

  function processResponse(res) {
    if (res.ok) {
      return res;
    }

    console.log(res);
    return Promise.reject(new Error(res.statusText));
  }

  return fetch(url, options)
    .then(processResponse)
    .then(res => res.json())
    .catch(processError);
}

export function get(url, data = {}) {
  const { req, ...rest } = data;
  const parsedUrl = parseUrl(url);
  Object.keys(rest).forEach((key) => {
    parsedUrl.set(key, rest[key]);
  });

  url = parsedUrl.toString();

  return request(url, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    cache: 'no-cache', // 禁用缓存
    req,
  });
}

export function post(url, data = {}) {
  const { req, ...rest } = data;

  return request(url, {
    body: JSON.stringify(rest),
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    req,
  });
}

export function getResource(url) {
  return request(url, {
    credentials: 'omit',
  });
}
