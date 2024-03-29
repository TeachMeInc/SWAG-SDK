import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "AddictingGames Developer Center",
  description: "Documentation for Addicting Games and Shockwave APIs and SDKs",
  outDir: "../../docs",
  // base: "/SWAG-SDK/",
  head: [
    ['link', { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png"}],
    ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png"}],
    ['link', { rel: "shortcut icon", href: "/favicon-16.png"}],
  ],
  appearance: 'dark',

  themeConfig: {
    logo: '/addictingGamesLogo.svg',
    siteTitle: false,

    search: {
      provider: 'local'
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Documentation', link: '/unity/installation' },
      { text: 'Submit Your Game', link: 'https://addictinggameshelp.zendesk.com/hc/en-us/requests/new?tf_1500003702161=addictinggames.com&tf_25644328=game_submissions' }
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
                  { text: 'Achievement (Struct)', link: '/unity/script-reference/AddictingGames/Achievements/Achievement' },
                  { text: 'Achievements (Class)', link: '/unity/script-reference/AddictingGames/Achievements/Achievements' },
                  { text: 'AchievementsCurrentUser (Class)', link: '/unity/script-reference/AddictingGames/Achievements/AchievementsCurrentUser' },
                ]
              },
              {
                text: 'Scores',
                items: [
                  { text: 'Daily Best (Struct)', link: '/unity/script-reference/AddictingGames/Scores/DailyBest' },
                  { text: 'Score (Struct)', link: '/unity/script-reference/AddictingGames/Scores/Score' },
                  { text: 'ScorePeriod (Enum)', link: '/unity/script-reference/AddictingGames/Scores/ScorePeriod' },
                  { text: 'Scores (Class)', link: '/unity/script-reference/AddictingGames/Scores/Scores' },
                  { text: 'ScoresCurrentUser (Class)', link: '/unity/script-reference/AddictingGames/Scores/ScoresCurrentUser' },
                ]
              },
              {
                text: 'User',
                items: [
                  { text: 'UserData (Struct)', link: '/unity/script-reference/AddictingGames/User/UserData' },
                  { text: 'User (Class)', link: '/unity/script-reference/AddictingGames/User/User' },
                ]
              },
              { text: 'AsyncHandler<T> (Class)', link: '/unity/script-reference/AddictingGames/AsyncHandler' },
              { text: 'JSONListHelper (Class)', link: '/unity/script-reference/AddictingGames/JSONListHelper' },
              { text: 'Provider (Enum)', link: '/unity/script-reference/AddictingGames/Provider' },
              { text: 'SWAG (Class)', link: '/unity/script-reference/AddictingGames/SWAG' },
              { text: 'SWAGConfig (Class)', link: '/unity/script-reference/AddictingGames/SWAGConfig' },
              { text: 'ViewMode (Enum)', link: '/unity/script-reference/AddictingGames/ViewMode' },
            ]
          },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TeachMeInc/SWAG-SDK' }
    ],

    footer: {
      message: 'AddictingGames',
      copyright: 'Copyright 2023 Addicting Games, Inc.'
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
