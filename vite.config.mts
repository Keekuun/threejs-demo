import {defineConfig, loadEnv} from 'vite'
import UnoCSS from 'unocss/vite'
import {ViteMinifyPlugin as minify} from 'vite-plugin-minify'
import {ViteMpPlugin as mp} from 'vite-plugin-mp'

export default defineConfig(({mode}) => {
  const {VITE_APP_BASE = '/'} = loadEnv(mode, process.cwd());
  console.log('[mode]', mode);
  console.log('[VITE_APP_BASE]', VITE_APP_BASE);
  return {
    base: VITE_APP_BASE,
    plugins: [
      UnoCSS(),
      mp(),
      minify(),
    ]
  }
})
