const fs = require('fs');
const path = require('path');
const defaultOptions = require('./default');

const cwd = process.cwd();
const pkg = require(path.resolve(cwd, 'package.json'));

class OcHtmlPlugin {
  /**
   * options: {
   *  clue?: string,
   *  spm?: {
   *    spmA: string,
   *    spmB: string
   *  },
   *  title?: string,
   *  icon?: string,
   *  charset?: string,
   *  template?: string | function(styles, js, elementId, optional)
   * }
   */
  constructor(options) {
    this.options = options || {};
  }

  getTemplate() {
    const { clue, spm, template,
      title = '',
      icon = 'https://zos.alipayobjects.com/rmsportal/nDgBIDOgapQuIrT.ico',
      charset = 'utf-8'
    } = this.options;
    let templateFun = defaultOptions.template;

    // 如果是个文件路径，那么读取内容
    if (typeof template === 'string') {
      const code = fs.readFileSync(path.resolve(process.cwd(), template));
      // eslint-disable-next-line no-new-func
      templateFun = new Function('styles', 'js', 'elementId', 'optional', code);
    } else if (typeof template === 'function') {
      templateFun = template;
    }

    return function({ styles, js, elementId, publicPath, isDevServer }) {
      // basement资源处理
      let cmsParseStatement = '';
      if (!isDevServer) {
        const cdn = '$assetsUrl';
        const swiftPath = `${pkg.family}/${pkg.name}`;
        const segment = `/g/${swiftPath}/$assetsVersion`;

        cmsParseStatement = `#cmsparse("/swift-assets/${swiftPath}/version.vm")
    #set($assetsPublicPath = "${cdn + segment}")`;

        publicPath = '$assetsPublicPath';
      }

      styles = styles.map(style => `<link rel="stylesheet" href="${publicPath}/${style}" />`);

      if (typeof clue === 'string') {
        js.unshift(`<script type="text/javascript" crossorigin src="https://g.alicdn.com/dt/tracker/3.5.4/??tracker.Tracker.js,tracker.interfaceTrackerPlugin.js,tracker.performanceTrackerPlugin.js"></script>
    <script>
      var tracker = new window.Tracker({
        pid: '${clue}',
        plugins: [
          [window.interfaceTrackerPlugin],
          [window.performanceTrackerPlugin]
        ],
      });
      tracker.install();
    </script>
    `);
      }

      js = js.map(script => `<script crossorigin type="text/javascript" src="${publicPath}/${script}" defer></script>`);

      if (typeof spm === 'object' &&
        typeof spm.spmA === 'string' &&
        typeof spm.spmB === 'string'
      ) {
        js.push(`
    <script>
      !function(t,e,a,r,c){t.TracertCmdCache=t.TracertCmdCache||[],t[c]=window[c]||
        {_isInit:!0,call:function(){t.TracertCmdCache.push(arguments)},
        start:function(t){this.call('start',t)}},t[c].l=new Date;
        var n=e.createElement(a),s=e.getElementsByTagName(a)[0];
        n.async=!0,n.src=r,s.parentNode.insertBefore(n,s)}
      (window,document,'script','https://tracert.alipay.com/tracert.js','Tracert');
        (typeof Tracert.start === 'function') && Tracert.start({
          spmAPos: '${spm.spmA}',
          spmBPos: '${spm.spmB}',
        });
    </script>`);
      }

      return templateFun(styles, js, elementId, {
        icon,
        title,
        charset,
        publicPath,
        cmsParseStatement,
      });
    };
  }

  build({ build }) {
    build.render = this.getTemplate();
  }
}

module.exports = OcHtmlPlugin;
