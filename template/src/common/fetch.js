import { fetch } from 'menreiki';

function processError(err) {
  if (err) {
    return Promise.reject(err);
  }

  const error = new Error('Unkonw Error');
  error.success = false;
  return Promise.reject(error);
}

function processResponse(res) {
  // 如果不是404/500什么的
  if (res.ok) {
    return res.json().then(v => ({
      ...v,
      success: v.stat === 'ok',
      message: v.msg,
    }));
  }

  console.log(res);
  return processError(new Error(res.statusText));
}

/**
 * get resource with credential
 * @param {string} url target url
 * @param {object} options fetch options
 */
export function get(url, options = {}) {
  return fetch(options.req)(url, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    cache: 'no-cache', // 禁用缓存
    ...options,
  })
    .then(processResponse, processError);
}

/**
 * post resource with credential
 * @param {string} url target url
 * @param {object} data data to post in body
 * @param {object} options fetch options
 */
export function post(url, data = {}, options) {
  const { req, ...restParams } = data;
  return fetch(req)(url, {
    body: JSON.stringify(restParams),
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
    .then(processResponse, processError);
}

/**
 * get resource without credential
 * @param {string} url target url to visit
 * @param {object} options fetch options
 */
export function getResource(url, options) {
  return fetch.raw(url, {
    ...options,
    credentials: 'omit',
  });
}
