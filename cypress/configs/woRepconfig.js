const { defineConfig } = require("cypress");


module.exports = defineConfig({
  chromeWebSecurity: false,

  env: {
    "username": "tester18@t.com",
    "password": "Test67890@",
    "url": "https://magento.softwaretestingboard.com/"
  },

  e2e: {  
    video:false,  
    experimentalSessionAndOrigin: true,
    excludeSpecPattern: ['*.page.js', 'util.js'],
    defaultCommandTimeout: 6000,
  },
});