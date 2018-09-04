/**
 * 模块主要结果sofa mvc在post时使用application/x-www-form-urlencoded编码时，
 * 对于复杂数据结构的stringify支持
 * PS. 如果请求头content-type是application/json，那么对数据的处理，直接使用JSON.stringify即可
 */


// 针对多级对象，需要将key取出并重新放置进去，否则后端无法反射
function convertObjectAndArray(prefixKey, value, convertedData) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const newPrefixKey = `${prefixKey}[${index}]`;
      convertObjectAndArray(newPrefixKey, item, convertedData);
    });
  } else if (typeof value === 'object') {
    Object.keys(value).forEach((key) => {
      const v = value[key];
      const requestKey = `${prefixKey}.${key}`;
      convertObjectAndArray(requestKey, v, convertedData);
    });
  } else {
    convertedData[prefixKey] = value;
  }
}

export function stringify(params = {}) {
  const result = {};
  Object.keys(params).forEach((key) => {
    const value = params[key];
    convertObjectAndArray(key, value, result);
  });

  return result;
}
