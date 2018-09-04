import { message } from '@alife/frog';

// 全局捕捉服务器返回的异常或者dva effect处理过程中的异常
export const onDvaError = function(error) {
  message.error(`出错啦：${error.message}`);
};
