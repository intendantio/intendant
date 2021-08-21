module.exports = {
  docs: [
    'getting-started',
    {
      type: 'category',
      label: 'User guide',
      items: [
        'user-guide/concept',
        {
          type: 'category',
          label: 'Dashboard',
          items: [
            'user-guide/dashboard/getting-started',
            'user-guide/dashboard/smartobject',
            'user-guide/dashboard/module',
            'user-guide/dashboard/process',
            'user-guide/dashboard/widget',
            'user-guide/dashboard/routine',
            'user-guide/dashboard/user',
          ],
        },
        {
          type: 'category',
          label: 'Mobile Application',
          items: [
            'user-guide/mobile/getting-started',
            'user-guide/mobile/preview'
          ],
        }
      ],
    },
    {
      type: 'category',
      label: 'Developer guide',
      items: [
        {
          type: 'category',
          label: 'Module',
          items: [
            'guides/module/introduction',
            'guides/module/custom'
          ],
        },
        {
          type: 'category',
          label: 'Smartobject',
          items: [
            'guides/smartobject/introduction',
            'guides/smartobject/custom'
          ],
        }
      ],
    },
    {
      type: 'category',
      label: 'Api',
      items: [
        'api/authentification',
        'api/authorization',
        'api/client',
        'api/configuration',
        'api/getstarted',
        'api/market',
        'api/module',
        'api/ping',
        'api/process',
        'api/profile',
        'api/routine',
        'api/smartobject',
        'api/user',
        'api/widget',
      ],
    }
  ],
};
