import {
  getMatchedRoutesMeta
} from 'menreiki';
import {
  setSession,
  getSession
} from './utils';

/**
 * 当路由变更时，自动将页面滚动到头部， 对于返回操作的路由变更，不进行处理
 * @param {Object} options scrollIntoView的选项
 * {
 *   behavior: "auto"  | "instant" | "smooth",
 *   block:    "start" | "end" | "center" | "nearest",
 *   inline:   "start" | "end" | "center" | "nearest",
 * }
 */
export default function(options = true) {
  window.history.scrollRestoration = 'manual';

  return {
    onRouteChanged(matchedRoutes, {
      isFirstRender, props, prevProps,
    }) {
      // 首次渲染的时候，这时候无法获取组件的props信息
      if (isFirstRender) return;

      const {
        action
      } = props.history;

      // 是否是首次加载，如果prevProps为空，那么代表不是首次
      if (prevProps) {
        // 存储之前路径的位置
        setSession(prevProps.location.key || '', {
          x: window.pageXOffset,
          y: window.pageYOffset,
        });
      }

      // 通过页面操作跳转的，如果要自动滚动，那么自动跳到页面头部
      if (action !== 'POP') {
        const autoScroll = getMatchedRoutesMeta(
          matchedRoutes,
          route => route.autoScroll,
        );

        if (autoScroll) {
          document.querySelector('body').scrollIntoView(options);
        }
      } else {
        // 通过浏览器向前/返回操作的，恢复位置
        const offset = getSession(props.location.key || '');
        if (typeof offset !== 'undefined') {
          setTimeout(() => {
            window.scrollTo(offset.x, offset.y);
          });
        }
      }
    }
  };
}
