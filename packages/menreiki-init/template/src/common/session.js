import { Modal, message } from '@alife/frog';
import debug from './debug';

/**
 * 跳转重新登录页面处理逻辑
 */
function login() {
  return new Promise((resolve) => {
    const win = window.open('/platform/closeAfterLogin.htm', '_blank');
    // 消息回调监听
    function messageListener(e) {
      if (e.data === 'relogin-success' && e.source === win) {
        window.removeEventListener('message', messageListener);
        resolve();
      }
    }

    window.addEventListener('message', messageListener, false);
  });
}

let blockRequests = null;
export function sessionExpiredConfirm() {
  return new Promise((resolve, reject) => {
    if (!blockRequests) {
      blockRequests = [];
      Modal.confirm({
        title: '登录超时',
        content: '您的登录已经超时，是否要在新窗口重新登录？',
        okText: '重新登录',
        onOk: () => login().then(() => {
          // 重现登录后，执行回调，重现执行之前中止的请求
          if (!blockRequests) {
            return;
          }
          message.info('登录成功，继续执行之前的请求...');
          //
          const toRequests = blockRequests;
          blockRequests = null;
          //
          toRequests.forEach((item) => {
            try {
              item.resolve();
            } catch (e) {
              debug.error(e);
            }
          });
        }),
        onCancel: () => {
          if (!blockRequests) {
            return;
          }
          blockRequests.forEach((item) => {
            item.reject(new Error('登录超时，请求中止'));
          });
          blockRequests = null;
        },
      });
    }

    blockRequests.push({ resolve, reject });
  });
}
