#!/usr/bin/env node
const program = require('commander');
const { say, getCompetitionRanking, getTeamMatchInfo, getCompetitionMatchInfo, getTeamPlayers } = require('./cli');
const getLuisIntent = require('./luis');

program
  .version('1.0.0')
  .option('-r, --ranking [competition]', 'Show the ranking of a competition, if there is a space don\'t forget the quotes.')
  .option('-p, --players [team]', 'Show the players of the team, if there is a space don\'t forget the quotes.')
  .option('-t, --team [team]', 'Show the team matchs in the next 7 days, if there is a space don\'t forget the quotes.')
  .option('-c, --competition [competition]',
    'Show the next fixtures of the team or the competition you choosed, if there is a space don\'t forget the quotes.')
  .parse(process.argv);

if (program.ranking){
  getLuisIntent(program.ranking)
    .then(({ entities}) => getCompetitionRanking(entities));
} else if(program.team) {
  getLuisIntent(program.team)
    .then(({ entities}) => getTeamMatchInfo(entities));
} else if(program.players) {
  getLuisIntent(program.players)
    .then(({ entities}) => getTeamPlayers(entities));
} else if(program.competition) {
  getLuisIntent(program.competition)
    .then(({ entities}) => getCompetitionMatchInfo(entities));
} else {
  say('Bonjour, je suis FootBot, si vous avez une question sur le football posez la moi ! :)');
}