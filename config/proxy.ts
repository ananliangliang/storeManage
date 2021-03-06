/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/proxy/warehouse/': {
      target: 'http://192.168.1.36:8082',
      // target: 'http://tools.zjspoint.com',
      // target: 'http://192.168.1.160:80',
      // target: 'http://web.zjspoint.com/',
      // target:'http://192.168.1.101:8082',
      changeOrigin: true,
      pathRewrite: { '^/proxy/': '' },
    },
    '/proxy/common/': {
      target: 'http://192.168.1.36:8081',
      // target: 'http://tools.zjspoint.com',
      // target: 'http://192.168.1.160:80',
      // target: 'http://web.zjspoint.com/',
      // target:'http://192.168.1.101:8082',
      changeOrigin: true,
      pathRewrite: { '^/proxy/': '' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
