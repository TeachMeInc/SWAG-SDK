import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Shockwave Developer Center",
  description: "Documentation for Shockwave APIs and SDKs",
  outDir: "../../docs",
  // base: "/SWAG-SDK/",
  head: [
    // ['link', { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48.png"}],
    // ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png"}],
    // ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png"}],
    ['link', { rel: "shortcut icon", href: "/favicon.ico"}],
  ],
  // appearance: 'dark',

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: false,

    search: {
      provider: 'local'
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Documentation', link: '/unity/installation' },
      { text: 'Submit Your Game', link: 'https://addictinggameshelp.zendesk.com/hc/en-us/requests/new?tf_1500003702161=shockwave.com&tf_25644328=game_submissions' }
    ],

    outline: [2, 3],

    sidebar: [
      // {
      //   text: 'Documentation',
      //   items: [
      //     // { text: 'Markdown Examples', link: '/markdown-examples' },
      //     // { text: 'Runtime API Examples', link: '/api-examples' },
      //     // { text: 'Getting Started', link: '/getting-started' },
      //   ]
      // },
      { 
        text: 'HTML5', 
        items: [
          { text: 'Installation', link: '/html5/installation' },
          { text: 'Usage & Examples', link: '/html5/usage-and-examples' },
        ]
      },
      { 
        text: 'Unity', 
        items: [
          { text: 'Installation', link: '/unity/installation' },
          { text: 'Usage & Examples', link: '/unity/usage-and-examples' },
          {
            text: 'Script Reference',
            items: [
              {
                text: 'Achievements',
                items: [
                  { text: 'Achievement (Struct)', link: '/unity/script-reference/Shockwave/Achievements/Achievement' },
                  { text: 'Achievements (Class)', link: '/unity/script-reference/Shockwave/Achievements/Achievements' },
                  { text: 'AchievementsCurrentUser (Class)', link: '/unity/script-reference/Shockwave/Achievements/AchievementsCurrentUser' },
                ]
              },
              {
                text: 'Scores',
                items: [
                  { text: 'Daily Best (Struct)', link: '/unity/script-reference/Shockwave/Scores/DailyBest' },
                  { text: 'Score (Struct)', link: '/unity/script-reference/Shockwave/Scores/Score' },
                  { text: 'ScorePeriod (Enum)', link: '/unity/script-reference/Shockwave/Scores/ScorePeriod' },
                  { text: 'Scores (Class)', link: '/unity/script-reference/Shockwave/Scores/Scores' },
                  { text: 'ScoresCurrentUser (Class)', link: '/unity/script-reference/Shockwave/Scores/ScoresCurrentUser' },
                ]
              },
              {
                text: 'User',
                items: [
                  { text: 'UserData (Struct)', link: '/unity/script-reference/Shockwave/User/UserData' },
                  { text: 'User (Class)', link: '/unity/script-reference/Shockwave/User/User' },
                ]
              },
              { text: 'AsyncHandler<T> (Class)', link: '/unity/script-reference/Shockwave/AsyncHandler' },
              { text: 'JSONListHelper (Class)', link: '/unity/script-reference/Shockwave/JSONListHelper' },
              { text: 'Provider (Enum)', link: '/unity/script-reference/Shockwave/Provider' },
              { text: 'SWAG (Class)', link: '/unity/script-reference/Shockwave/SWAG' },
              { text: 'SWAGConfig (Class)', link: '/unity/script-reference/Shockwave/SWAGConfig' },
              { text: 'ViewMode (Enum)', link: '/unity/script-reference/Shockwave/ViewMode' },
            ]
          },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TeachMeInc/SWAG-SDK' }
    ],

    footer: {
      message: 'Shockwave',
      copyright: 'Copyright 2023 Shockwave, Inc.'
    }
  },

  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPHome\.vue$/,
          replacement: fileURLToPath(
            new URL('./components/Home.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPFooter\.vue$/,
          replacement: fileURLToPath(
            new URL('./components/Footer.vue', import.meta.url)
          )
        }
      ]
    }
  }
})
