const { format } = require("date-fns");
const faker = require("faker");

faker.locale = "pt_BR";

const name = faker.name.firstName() + " " + faker.name.lastName();
const email = faker.internet.email().toLowerCase();
const birthDate = format(faker.date.past(), "yyyy-MM-dd");
const password = faker.internet.password();

const newDate = format(new Date(), "dd-MM-yyyy");
const newHours = format(new Date(), "HH-mm-ss-SS");

module.exports = {
  "PASSO 1: Acessar a página de autenticação": function (browser) {
    browser
      .resizeWindow(1300, 900)
      .url("http://localhost:8080")
      .waitForElementVisible("body")
      .assert.titleContains("Ferrari - Hcode Lab")
      .assert.visible("#header > div.menu > div > a")
      .click("#header > div.menu > div > a")
      .pause(1000);
  },

  "PASSO 2: Tentar fazer cadastro": function (browser) {
    browser
      .waitForElementVisible("body")
      .assert.visible("#login > div.actions > div > a:nth-child(2)")
      .click("#login > div.actions > div > a:nth-child(2)")
      .assert.visible("#register")
      .pause(2000)
      .setValue("#email-register", email)
      .setValue("#name", name)
      .setValue("#birth_at", birthDate)
      .setValue("#password-new", password)
      .setValue("#password-confirm", password)
      .saveScreenshot(
        `./tests/screenshots/${newDate}-formulario-ok-${newHours}.png`
      )
      .pause(1000)
      .assert.visible("#register > div.actions > button")
      .click("#register > div.actions > button")
      .pause(1000);
  },

  "PASSO 3: Veificar se autenticou após o cadastro": function (browser) {
    browser
      .waitForElementVisible("body")
      .assert.urlEquals("http://localhost:8080/")
      .assert.visible("#header > div.menu.logged > div > div > div > a > small")
      .saveScreenshot(
        `./tests/screenshots/${newDate}-home-auth-${newHours}.png`
      )
      .assert.containsText(
        "#header > div.menu.logged > div > div > div > a > small",
        email
      )
      .pause(1000)
      .end();
  },
};
