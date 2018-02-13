#!/usr/bin/env node
const inquirer = require("inquirer");
const API = require('./api.js');

const api = new API();
inquirer.prompt([
    {
        type: 'input',
        message: 'Bonjour, je suis FootBot, si vous avez une question sur le football posez la moi ! :)',
        name: 'answer'
    }
]).then(answers => {
  const result = api.getCompetitions();
  console.log(result);
});