/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Intendant.io',
  tagline: 'Automate your home',
  url: 'https://intendant.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'intendantio', // Usually your GitHub org/user name.
  projectName: 'Intendant',
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
    },
    navbar: {
      title: 'Intendant',
      logo: {
        alt: 'intendant',
        src: 'img/logo.svg',
      },
      items: [
        { to: 'docs/getting-started', activeBasePath: 'docs', label: 'Docs', position: 'left' },
        { to: 'https://demo.intendant.io', activeBasePath: 'docs', label: 'Demo', position: 'right' },
        { to: 'https://github.com/intendantio/intendant', activeBasePath: 'docs', label: 'Github', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Intendant.io`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
