import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Questerix Help Center',
  description: 'Guides for parents, teachers, and school admins on the Questerix platform.',
  cleanUrls: true,
  head: [
    ['meta', { name: 'theme-color', content: '#5b4fcf' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Questerix Help',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Parents', link: '/parents/' },
      { text: 'Teachers', link: '/teachers/' },
      { text: 'Admins', link: '/admins/' },
    ],
    sidebar: {
      '/parents/': [
        {
          text: 'Parents',
          items: [
            { text: 'Getting Started', link: '/parents/' },
            { text: 'Viewing Progress', link: '/parents/progress' },
            { text: 'Account & Password', link: '/parents/account' },
          ],
        },
      ],
      '/teachers/': [
        {
          text: 'Teachers',
          items: [
            { text: 'Getting Started', link: '/teachers/' },
            { text: 'Managing Groups', link: '/teachers/groups' },
            { text: 'Reading Reports', link: '/teachers/reports' },
          ],
        },
      ],
      '/admins/': [
        {
          text: 'Admins',
          items: [
            { text: 'School Onboarding', link: '/admins/' },
            { text: 'Managing Users', link: '/admins/users' },
            { text: 'Creating Questions', link: '/admins/questions' },
            { text: 'Bulk Question Import', link: '/admins/bulk-import' },
          ],
        },
      ],
    },
    search: {
      provider: 'local',
    },
    editLink: {
      pattern: 'https://github.com/rmg007/questerix-help-docs/edit/main/:path',
      text: 'Suggest an improvement',
    },
    footer: {
      message: 'Questerix Help Center — Always improving.',
      copyright: 'Copyright © 2025–2026 Questerix',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/rmg007/questerix-help-docs' },
    ],
  },
})
