// 全局捕捉服务器返回的异常或者dva effect处理过程中的异常
export const onDvaError = function(error) {
  window.alert(`出错啦：${error.message}`);
  console.error(error.stack || error.message);
};
