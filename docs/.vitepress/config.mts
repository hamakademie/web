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
      { text: 'Začínáme s provozem', link: '/zaciname-s-provozem/' },
      { text: 'Informace', items: [
        { text: 'O projektu', link: '/informace/o-projektu/' },
        { text: 'O českém radioklubu', link: '/informace/o-ceskem-radioklubu/' },
      ] },
    ],

    sidebar: {
      '/zaciname/': { base: '/zaciname/', items: sidebarGettingStarted() },
      '/priprava-ke-zkouskam/': { base: '/priprava-ke-zkouskam/', items: sidebarExamPreparation() },
      '/zaciname-s-provozem/': { base: '/zaciname-s-provozem/', items: sidebarGettingStartedOnAir() },
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
          { text: 'Jak vyplnit formuláře', link: '/jak-vyplnit-formulare' },
          { text: 'Jak zkouška probíhá', link: '/jak-zkouska-probiha' },
        ]
      },
      {
        text: 'Rádiový provoz',
        items: [
          { text: 'Základní informace', link: '/radiovy-provoz/' },
          { text: 'Volací znak', link: '/radiovy-provoz/volaci-znak' },
          { text: 'Systém RST', link: '/radiovy-provoz/system-rst' },
          { text: 'Hláskovací abeceda', link: '/radiovy-provoz/hlaskovaci-abeceda' },
          { text: 'Zkratky a Q kódy', link: '/radiovy-provoz/zkratky-q-kody' },
        ]
      },
      {
        text: 'Rádiové vlny a šíření',
        items: [
          { text: 'O rádiových vlnách', link: '/sireni-radiovych-vln/' },
          { text: 'Rádiové spektrum', link: '/sireni-radiovych-vln/radiove-spektrum' },
          { text: 'Polarizace', link: '/sireni-radiovych-vln/polarizace' },
          { text: 'Atmosféra a její vliv', link: '/sireni-radiovych-vln/atmosfera-a-jeji-vliv-na-sireni' },
        ]
      },
      {
        text: 'Technika',
        items: [
          { text: 'TODO', link: '/zkouskova-temata/predpisy' },
        ]
      },
      {
        text: 'Ostatní zkoušková témata',
        items: [
          { text: 'Radiokomunikační předpisy', link: '/zkouskova-temata/predpisy' },
          { text: 'Rozvrh kmitočtů a druhů provozu', link: '/zkouskova-temata/rozvrh-kmitoctu' },
          { text: 'Provozní dovednosti', link: '/zkouskova-temata/provozni-dovednosti' },
        ]
      },
      {
        text: 'Další studijní materiály',
        items: [
          { text: 'TODO', link: '/zkouskova-temata/predpisy' },
        ]
      },
  ]
}

function sidebarGettingStartedOnAir(): DefaultTheme.SidebarItem[] {
  return [
      {
        text: 'Než začneš vysílat',
        items: [
          { text: 'Právě jsem složil zkoušku', link: '/' },
          { text: 'Jaké rádio si mám pořídít?', link: '/nez-zacnes-vysilat/jake-radio-si-poridit' },
          { text: 'Kde můžu vysílat?', link: '/nez-zacnes-vysilat/kde-muzu-vysilat' },
          { text: 'Staniční deník', link: '/stanicni-denik' },
          { text: 'QSL lístky a QSL služba', link: '/nez-zacnes-vysilat/qsl-ĺistky' },
          { text: 'HAM online služby', link: '/nez-zacnes-vysilat/ham-online-sluzby' },
        ]
      },
      {
        text: 'Provoz na pásmu',
        items: [
          { text: 'Úvod', link: '/provoz-na-pasmu/' },
          { text: 'Etika a ham spirit', link: '/provoz-na-pasmu/hamspirit' },
          { text: 'Jak navázat spojení?', link: '/provoz-na-pasmu/jak-navazat-spojeni' },
          { text: 'Převaděčový provoz', link: '/provoz-na-pasmu/prevadecovy-provoz' },
        ]
      },
      {
        text: 'Pokročilé',
        items: [
          { text: 'Split provoz', link: '/pokrocile/split-provoz' },
          { text: 'DX Cluster', link: '/pokrocile/dx-cluster' },
        ]
      },
      {
        text: 'Praktické',
        items: [
          { text: 'Měření PSV', link: '/prakticke/mereni-psv' },
          { text: 'Lokátory', link: '/prakticke/lokatory' },
        ]
      },
      {
        text: 'Další studijní materiály',
        items: [
          { text: 'Kodex chování DX', link: '/dalsi-materialy/kodex-dx' },
        ]
      },
  ]
}