import {defineConfig} from 'vite'
import UnoCSS from 'unocss/vite'
import {ViteMinifyPlugin as minify} from 'vite-plugin-minify'
import {ViteMpPlugin as mp} from 'vite-plugin-mp'

export default defineConfig(({mode}) => {
  return {
    base: mode === 'production' ? '/threejs-demo/' : '/',
    plugins: [UnoCSS(), mp(), minify()]
  }
})
