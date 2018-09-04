import '@babel/polyfill';

// IE下如果没有console的时候
if (!(window.console && console.log)) {
  const printNothing = () => {};
  window.console = {
    log: printNothing,
    debug: printNothing,
    info: printNothing,
    warn: printNothing,
    error: printNothing,
  };
}

// IE 10 and below
// 对于IE 10，由于其没有__proto__这个属性，从而导致了core-js/modules/es6.object.set-prototype-of无法设置上
// 这里做一个暴力copy的实现，目前只会给react-hot-loader使用
if (!Object.setPrototypeOf) {
  Object.setPrototypeOf = function mixinProperties(obj, proto) {
    const { hasOwnProperty } = Object.prototype;
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in proto) {
      if (!hasOwnProperty.call(obj, prop)) {
        obj[prop] = proto[prop];
      }
    }
    return obj;
  };
}
