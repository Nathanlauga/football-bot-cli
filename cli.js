const inquirer = require('inquirer');
const getLuisIntent = require('./luis');

function ask(message = 'Bonjour, je suis FootBot, si vous avez une question sur le football posez la moi ! :)') {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'answer',
        message,
      },
    ])
    .then(async ({ answer }) => {
      if (answer === 'exit' || answer === 'quit') {
        return;
      }
      const { intent, entities } = await getLuisIntent(answer);
      try {
        findResponse(intent, entities);
        ask('Autre chose ?');
      } catch (error) {
        console.log(error);
      }
    });
}

function findResponse(intent, entities) {
  switch (intent) {
    case 'GetTeamPlayers':
      return getTeamPlayers(findTeamId(entities));

    case 'GetMatchInfo':
      let params = {};
      let competitionId = findCompetitionId(entities, false);
      let teamId = findTeamId(entities, false);

      // if params timeframe empty --> timeFrame : "n7"
      params.timeFrame = 'n7';

      if (competitionId !== null) {
        params.competition = competitionId;
        return getCompetionMatchInfo(params);
      } else if (teamId !== null) {
        params.team = teamId;
        return getTeamMatchInfo(params);
      }

      return getMatchInfo(params);

    case 'GetCompetitionTeams':
      return getCompetitionTeams(findCompetitionId(entities));

    case 'GetCompetitionRanking':
      return getCompetitionRanking(findCompetitionId(entities));

    case 'GetCompetionInfo':
      return getCompetionInfo(findCompetitionId(entities));

    default:
      return 'no answer';
  }
}

function findTeamId(entities, throwError = true) {
  let teams = entities.filter((entity) => entity.type === 'Teams');
  if (teams.length === 1) {
    return teams[0].resolution.values;
  } else if (throwError) {
    if (teams.length > 1) throw new Error('too much teams');
    else throw new Error('team not found');
  } else {
    if (teams.length > 1) throw new Error('too much teams');
    else return null;
  }
}

function findCompetitionId(entities, throwError = true) {
  let competitions = entities.filter((entity) => entity.type === 'Competitions');
  if (competitions.length === 1) {
    return competitions[0].resolution.values;
  } else if (throwError) {
    if (competitions.length > 1) throw new Error('too much competitions');
    else throw new Error('competition not found');
  } else {
    if (competitions.length > 1) throw new Error('too much competitions');
    else return null;
  }
}

function getTeamPlayers(team) {
  console.log('getTeamPlayers');
  // api call to get players from the team

  // print list of players
  return 'getTeamPlayers';
}

function getMatchInfo(params = {}) {
  console.log('getMatchInfo');
  // api call with timeFrame --> getMatchInfos
  // params.timeFrame

  // print list of matchs
  return 'getMatchInfo';
}
function getTeamMatchInfo(params = {}) {
  console.log('getTeamMatchInfo');
  // api call --> getTeamMatchInfos
  // params.teamId & params.timeFrame

  // print list of matchs
  return 'getTeamMatchInfo';
}
function getCompetionMatchInfo(params = {}) {
  console.log('getCompetionMatchInfo');
  // api call --> getCompetitionMatchs
  // params.competitionsId & params.timeFrame

  // print list of matchs
  return 'getCompetionMatchInfo';
}

function getCompetitionTeams(competition) {
  console.log('getCompetitionTeams');
  //api call get competition teams

  // print list of teams
  return 'getCompetitionTeams';
}

function getCompetitionRanking(competition) {
  console.log('getCompetitionRanking');
  // api call get competition ranking

  // print ranking of competition
  return 'getCompetitionRanking';
}

function getCompetionInfo(competition) {
  console.log('getCompetionInfo');
  // api call get competition

  // print info
  return 'getCompetionInfo';
}

module.exports = {
  ask,
};
