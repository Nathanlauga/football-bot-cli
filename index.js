#!/usr/bin/env node
const inquirer = require("inquirer");

inquirer.prompt([
    {
        type: 'input',
        message: 'Bonjour, je suis FootBot, si vous avez une question sur le football posez la moi ! :)',
        name: 'answer'
    }
]).then(answers => console.log(answers));