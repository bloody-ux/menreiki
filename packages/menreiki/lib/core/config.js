const config = require(CONFIGPATH);

function extract(property, defaultResult = {}) {
  const { extensions = [] } = config;
  let result = defaultResult;
  extensions.forEach((ext) => {
    const point = ext[property];
    if (typeof point === 'object') {
      result = {
        ...result,
        ...point,
      };
    } else {
      result = point;
    }
  });

  // 当前应用级别配置优先级最高
  if (typeof config[property] === 'object') {
    result = {
      ...result,
      ...config[property],
    };
  } else {
    result = config[property];
  }

  return result;
}

function run(propery) {
  const { extensions = [] } = config;

  return async function(...args) {
    await extensions
      .filter(ext => typeof ext[propery] === 'function')
      .forEach(async(ext) => {
        await ext[propery].call(null, ...args);
      });

    if (typeof config[propery] === 'function') {
      await config[propery].call(null, ...args);
    }
  };
}

export const router = extract('router');
export const onRouteChanging = run('onRouteChanging');
export const onRouteChanged = run('onRouteChanged');
export const onError = run('onError');
export const onDvaError = run('onDvaError');
