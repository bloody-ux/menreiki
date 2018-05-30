/**
 * make relative url to absolute url
 */

let origin = null;

export function setOrigin(o) {
  origin = o;
}

export function normalizeUrl(url) {
  // 是否是以http/ https开头
  if (!/^https?:\/\//.test(url) && origin) {
    return origin + url;
  }

  return url;
}
