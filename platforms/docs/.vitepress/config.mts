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
      { 
        text: 'HTML5 (version 5)', 
        items: [
          { text: 'Installation', link: '/html5/version-5/installation' },
          { text: 'Usage & Examples', link: '/html5/version-5/usage-and-examples' },
          { text: 'Toolbar Icons', link: '/html5/version-5/toolbar-icons' },
          { text: 'Customization', link: '/html5/version-5/customization-css-variables' },
          { text: 'Score Configuration', link: '/html5/version-5/score-config-and-formatting' },
          { text: 'TypeScript Support', link: '/html5/version-5/typescript-support' },
          { text: 'Migration Guide', link: '/html5/version-5/migration-guide' },
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
