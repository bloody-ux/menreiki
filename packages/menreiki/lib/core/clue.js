/**
 * clue错误码
 */
export const ErrorCode = {
  Js: 1,
  Interface: 2,
  Performance: 3
};

/**
 * 记录clue 错误
 * @param {Error} error 异常错误
 * @param {Number} code 错误码，默认是1， 代表js错误， 2代表接口异常, 3，代表性能
 */
export function logError(error, code = ErrorCode.Js) {
  // 本地环境不上报clue
  if (process.env.NODE_ENV !== 'production') return;

  const tracker = typeof window !== 'undefined' && window.tracker;
  if (tracker) {
    try {
      tracker.log(error, {
        code,
      });
    } catch (_) {
      // tracker自身打点错误不上报
    }
  }
}
