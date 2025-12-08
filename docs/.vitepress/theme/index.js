import DefaultTheme from 'vitepress/theme'
import './custom.css'

import { YouTubeEmbed } from '@miletorix/vitepress-youtube-embed'
import '@miletorix/vitepress-youtube-embed/style.css'

import { VueSound } from 'vue-sound'
import 'vue-sound/style.css';

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    ctx.app.component('YouTubeEmbed', YouTubeEmbed)
    ctx.app.component('VueSound', VueSound)
  }
}