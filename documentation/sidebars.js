module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Installation',
      items: [
        'installation/getting-started',
      ],
    },
    {
      type: 'category',
      label: 'Main Concepts',
      items: [
        {
          type: 'category',
          label: 'Core',
          items: [
            'concepts/core/introduction',
            'concepts/core/lifecycle'
          ],
        },
        {
          type: 'category',
          label: 'Connector',
          items: [
            'concepts/connector/introduction',
            {
              type: 'category',
              label: 'Basic Connector',
              items: [
                'concepts/connector/mysql'
              ],
            },
            'concepts/connector/custom'
          ],
        },
        {
          type: 'category',
          label: 'Module',
          items: [
            'concepts/module/introduction',
            {
              type: 'category',
              label: 'Basic Module',
              items: [
                'concepts/module/weather-manager',
                'concepts/module/list-manager',
                'concepts/module/recipe-manager'
              ],
            },
            'concepts/module/custom'
          ],
        },
        {
          type: 'category',
          label: 'Smartobject',
          items: [
            'concepts/smartobject/introduction',
            {
              type: 'category',
              label: 'Basic Smartobject',
              items: [
                'concepts/smartobject/philips-hue-light',
                'concepts/smartobject/philips-hue-sensor',
                'concepts/smartobject/philips-smart-plug',
                'concepts/smartobject/netatmo-home-coach'
              ],
            },
            'concepts/smartobject/custom'
            
          ],
        },
        {
          type: 'category',
          label: 'Logging',
          items: [
            'concepts/logging/introduction',
            {
              type: 'category',
              label: 'Basic Logging',
              items: [
                'concepts/logging/console'
              ],
            },
            'concepts/logging/custom'
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Web API',
      items: [
        'api/authorization',
        'api/module',
        'api/process',
        'api/routine',
        'api/smartobject',
        'api/widget',
      ],
    }
  ],
};
