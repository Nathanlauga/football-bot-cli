#!/usr/bin/env node
const program = require('commander');
const { ask, getRanking } = require('./cli');

program
    .version('1.0.0')
    .option('-r, --ranking [competition]', 'Show the ranking of a competition, if there is a space don\'t forget the quotes.')
    .option('-t, --team [team]', 'Show the team matchs in the next 7 days, if there is a space don\'t forget the quotes.')
    .parse(process.argv);

if (program.ranking){
    getRanking(program.ranking);
} else {
    ask();
}