import fetch from 'isomorphic-fetch';
import config from './config';

function normalizeUrl(url) {
  // 是否是以http/ https开头
  const { origin } = config;
  if (!/^https?:\/\//.test(url) && origin) {
    return origin + url;
  }

  return url;
}

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
export function get(url, options) {
  return fetch(normalizeUrl(url), {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    cache: 'no-cache', // 禁用缓存
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
  return get(url, {
    ...options,
    credentials: 'omit',
  });
}
