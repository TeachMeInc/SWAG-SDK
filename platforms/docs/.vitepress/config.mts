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
      { text: 'Documentation', link: '/html5/version-5/installation' },
      { text: 'Submit Your Game', link: 'https://shockwavehelp.zendesk.com/hc/en-us/requests/new' }
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
        text: 'HTML5 v5', 
        items: [
          { text: 'Installation', link: '/html5/version-5/installation' },
          { text: 'Usage & Examples', link: '/html5/version-5/usage-and-examples' },
          {
            text: 'Script Reference',
            items: [
              { text: 'APIWrapper', link: '/html5/version-5/script-reference/APIWrapper' },
              { text: 'DailyGameProgress', link: '/html5/version-5/script-reference/DailyGameProgress' },
              { text: 'DailyGameStreak', link: '/html5/version-5/script-reference/DailyGameStreak' },
              { text: 'Entity', link: '/html5/version-5/script-reference/Entity' },
              { text: 'Game', link: '/html5/version-5/script-reference/Game' },
              { text: 'GameModeData', link: '/html5/version-5/script-reference/GameModeData' },
              { text: 'GlobalEventType', link: '/html5/version-5/script-reference/GlobalEventType' },
              { text: 'LeaderboardData', link: '/html5/version-5/script-reference/LeaderboardData' },
              { text: 'MessageEventName', link: '/html5/version-5/script-reference/MessageEventName' },
              { text: 'MessagePayload', link: '/html5/version-5/script-reference/MessagePayload' },
              { text: 'PostScoreOptions', link: '/html5/version-5/script-reference/PostScoreOptions' },
              { text: 'SWAGAPI', link: '/html5/version-5/script-reference/SWAGAPI' },
              { text: 'SWAGAPIOptions', link: '/html5/version-5/script-reference/SWAGAPIOptions' },
              { text: 'ToolbarItem', link: '/html5/version-5/script-reference/ToolbarItem' },
              { text: 'ToolbarState', link: '/html5/version-5/script-reference/ToolbarState' },
            ]
          },
        ]
      },
      { 
        text: 'HTML5 (legacy)', 
        items: [
          { text: 'Installation', link: '/html5/legacy/installation' },
          { text: 'Usage & Examples', link: '/html5/legacy/usage-and-examples' },
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
