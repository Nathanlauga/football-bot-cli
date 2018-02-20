#!/usr/bin/env node
const getLuisIntent = require("./luis");

const inquirer = require("inquirer");
const API = require('./api.js');

const api = new API();
inquirer.prompt([
    {
        type: 'input',
        message: 'Bonjour, je suis FootBot, si vous avez une question sur le football posez la moi ! :)',
        name: 'answer'
    }
]).then(async ({ answer }) => {
  const {intent, entities, id} = getLuisIntent(answer);
});