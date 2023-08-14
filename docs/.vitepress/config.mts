import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SWAG Documentation",
  description: "Documentation for Addicting Games and Shockwave APIs and SDKs",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    outline: [2, 3],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'Getting Started', link: '/getting-started' },
          { 
            text: 'Unity', 
            link: '/unity',
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
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
  }
})
