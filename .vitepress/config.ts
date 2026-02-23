import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Questerix Help Center',
  description: 'Guides for parents, teachers, and admins on the Questerix platform.',
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Parents', link: '/parents/' },
      { text: 'Teachers', link: '/teachers/' },
      { text: 'Admins', link: '/admins/' },
    ],
    sidebar: {
      '/parents/': [
        { text: 'Getting Started', link: '/parents/' },
        { text: 'Viewing Progress', link: '/parents/progress' },
        { text: 'Account & Billing', link: '/parents/billing' },
      ],
      '/teachers/': [
        { text: 'Getting Started', link: '/teachers/' },
        { text: 'Managing Groups', link: '/teachers/groups' },
        { text: 'Assignments', link: '/teachers/assignments' },
        { text: 'Reports', link: '/teachers/reports' },
      ],
      '/admins/': [
        { text: 'Onboarding', link: '/admins/' },
        { text: 'School Setup', link: '/admins/setup' },
        { text: 'Managing Users', link: '/admins/users' },
        { text: 'Subscription', link: '/admins/subscription' },
      ],
    },
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Questerix Help Center',
      copyright: 'Copyright © 2025 Questerix',
    },
  },
})
