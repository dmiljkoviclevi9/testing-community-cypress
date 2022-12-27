const { defineConfig } = require("cypress");

const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress/configs', `${file}.json`)
  return fs.readJson(pathToConfigFile)
}

module.exports = defineConfig({
  chromeWebSecurity: false,

  env: {
    "username": "tester18@t.com",
    "password": "Test67890@",
    "url": "https://magento.softwaretestingboard.com/"
  },

  e2e: {    
    experimentalSessionAndOrigin: true,
    excludeSpecPattern: ['*.page.js', 'util.js'],
    defaultCommandTimeout: 6000,
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const file = config.env.configFile || 'configQA'
      return getConfigurationByFile(file)
    },
  },
});
