import DefaultTheme from 'vitepress/theme'
import './custom.css'

import { YouTubeEmbed } from '@miletorix/vitepress-youtube-embed'
import '@miletorix/vitepress-youtube-embed/style.css'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    ctx.app.component('YouTubeEmbed', YouTubeEmbed)
  }
}