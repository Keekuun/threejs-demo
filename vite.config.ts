import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import { ViteMinifyPlugin as minify } from 'vite-plugin-minify'
import { ViteMpPlugin as mp } from 'vite-plugin-mp'
export default defineConfig(() => {
  return {
    plugins: [UnoCSS(), mp(), minify()]
  }
})
