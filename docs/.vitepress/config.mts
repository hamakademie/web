import { defineConfig, type DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "HAM Akademie",
  description: "Výukový portál pro budoucí radioamatéry",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: 'O amatérském rádiu', link: '/zaciname/' },
      { text: 'Příprava ke zkouškám', link: '/priprava-ke-zkouskam/' },
      { text: 'Tvoje nové oprávnění', link: '/nove-opravneni/' },
      { text: 'O projektu', link: '/o-projektu/' },
    ],

    sidebar: {
      '/zaciname/': { base: '/zaciname/', items: sidebarGettingStarted() },
      '/priprava-ke-zkouskam/': { base: '/priprava-ke-zkouskam/', items: sidebarExamPreparation() }
    },

    footer: {
      message: '<a href="https://github.com/hamakademie/web">HAM Akademie</a> je open source',
      copyright: 'Copyright © 2026 HAM Akademie'
    },
  }
})


function sidebarGettingStarted(): DefaultTheme.SidebarItem[] {
  return [
      {
        text: 'O amatérském rádiu',
        items: [
          { text: 'Úvod', link: '/' },
          { text: 'Co je to amatérské rádio', link: '/co-je-to-amaterske-radio' },
          { text: 'Příklady HAM aktivit', link: '/priklady-aktivit' },
          { text: 'Kdo je to radioamatér', link: '/kdo-je-radioamater' },
          { text: 'Jak se stát radioamatérem', link: '/jak-se-stat-radioamaterem' },
        ]
      },
  ]
}

function sidebarExamPreparation(): DefaultTheme.SidebarItem[] {
  return [
      {
        text: 'Úvod',
        items: [
          { text: 'Základní informace', link: '/' },
          { text: 'Jak se přihlásit', link: '/jak-se-prihlasit' },
          { text: 'Jak zkouška probíhá', link: '/jak-zkouska-probiha' },
        ]
      },
      {
        text: 'Rádiový provoz',
        items: [
          { text: 'Základní informace', link: '/radiovy-provoz/' },
          { text: 'Volací znak', link: '/radiovy-provoz/volaci-znak' },
          { text: 'Systém RST', link: '/radiovy-provoz/system-rst' },
          { text: 'Šíření rádiových vln', link: '/radiovy-provoz/sireni-vln' },
          { text: 'Etika a ham spirit', link: '/radiovy-provoz/hamspirit' },
        ]
      },
      {
        text: 'Zkoušková témata',
        items: [
          { text: 'Radiokomunikační předpisy', link: '/zkouskova-temata/predpisy' },
          { text: 'Rozvrh kmitočtů a druhů provozu', link: '/zkouskova-temata/rozvrh-kmitoctu' },
          { text: 'Provozní dovednosti', link: '/zkouskova-temata/provozni-dovednosti' },
          { text: 'Q kódy', link: '/zkouskova-temata/q-kody' },
          { text: 'Hláskovací abeceda', link: '/zkouskova-temata/hlaskovaci-abeceda' },
        ]
      },
  ]
}