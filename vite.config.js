import {
  defineConfig
} from 'vite'
import {proxyUrl} from './src/api/baseUrl'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {
  ElementPlusResolver
} from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
      refTransform: true
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    port: 6006,
    open: true,
    proxy: { // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
      // 正则表达式写法
      '/proxy': {
        target: proxyUrl, // 后端服务代理地址
        changeOrigin: true, //开启代理
        rewrite: (path) => path.replace(/\/proxy/, '')
      }
    }
  }
})