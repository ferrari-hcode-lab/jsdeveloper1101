const seleniumServer = require("selenium-server");
const chromeDriver = require("chromedriver");
const geckoDriver = require("geckodriver");

module.exports = {
  src_folders: ["tests"],

  selenium: {
    start_process: true,
    start_session: false,
    server_path: seleniumServer.path,
    check_process_delay: 10000,
    host: "127.0.0.1",
    port: 4444,
    cli_args: {
      "webdriver.chrome.driver": chromeDriver.path,
      "webdriver.gecko.driver": geckoDriver.path,
    },
  },

  test_settings: {
    default: {
      desireCapabilities: {
        browserName: "chrome",
      },
    },
    firefox: {
      desiredCapabilities: {
        browserName: "firefox",
        javascriptEnabled: true,
        acceptSslCerts: true,
        marionette: true,
      },
    },
    chrome: {
      desireCapabilities: {
        browserName: "chrome",
        javasriptEnabled: true,
        acceptSslCerts: true,
        chromeOptions: {
          w3c: false,
          args: ["disable-gpu"],
        },
      },
    },
    headlessChrome: {
      desireCapabilities: {
        browserName: "chrome",
        javasriptEnabled: true,
        acceptSslCerts: true,
        chromeOptions: {
          w3c: false,
          args: ["disable-gpu", "headless"],
        },
      },
    },
  },
};
