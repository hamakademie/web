import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "HAM Akademie",
  description: "Výukový portál pro budoucí radioamatéry",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: 'O amatérském rádiu', link: '/zaciname/' },
      { text: 'Příprava ke zkouškám', link: '/priprava-ke-zkouskam/' }
    ],

    sidebar: [
      {
        text: 'O amatérském rádiu',
        items: [
          { text: 'Úvod', link: '/zaciname/' },
          { text: 'Co je to amatérské rádio', link: '/zaciname/co-je-to-amaterske-radio' },
          { text: 'Příklady HAM aktivit', link: '/zaciname/priklady-aktivit' },
          { text: 'Kdo je to radioamatér', link: '/zaciname/kdo-je-radioamater' },
          { text: 'Jak se stát radioamatérem', link: '/zaciname/jak-se-stat-radioamaterem' },
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
        text: 'Příprava k získání oprávnění',
        items: [
          { text: 'Příprava ke zkouškám', link: '/priprava-ke-zkouskam/' },
          { text: 'Radiokomunikační předpisy', link: '/priprava-ke-zkouskam/predpisy' },
          { text: 'Rozvrh kmitočtů a druhů provozu', link: '/priprava-ke-zkouskam/rozvrh-kmitoctu' },
          { text: 'Provozní dovednosti', link: '/priprava-ke-zkouskam/provozni-dovednosti' },
          { text: 'Q kódy', link: '/priprava-ke-zkouskam/q-kody' },
          { text: 'Hláskovací abeceda', link: '/priprava-ke-zkouskam/hlaskovaci-abeceda' },
        ]
      },
      {
        text: 'Přihlášení ke zkouškám',
        items: [
          { text: 'Jak se přihlásit', link: '/prihlaseni-ke-zkouskam/' },
          { text: 'Jak zkouška probíhá', link: '/prihlaseni-ke-zkouskam/jak-zkouska-probiha' },
        ]
      },
      {
        text: 'Tvoje nové oprávnění',
        items: [
          { text: 'Právě jsem složil zkoušku', link: '/nove-opravneni/' },
        ]
      },
      {
        text: 'O projektu',
        items: [
          { text: 'O projektu HAM Akademie', link: '/o-projektu/' },
        ]
      },
    ],

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ],

    footer: {
      message: '<a href="https://github.com/hamakademie/web">HAM Akademie</a> je open source',
      copyright: 'Copyright © 2026 HAM Akademie'
    },
  }
})
