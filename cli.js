const inquirer = require('inquirer');
const getLuisIntent = require('./luis');
const API = require('./api');
const api = new API();

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
        console.log(findResponse(intent, entities));
        ask('Autre chose ?');
      } catch (error) {
        console.log(error);
      }
    });
}

async function getRanking(competition){
    const { intent, entities } = await getLuisIntent(competition);
    try {
        let competitionId = findCompetitionId(entities);
        console.log(getCompetitionRanking(competitionId));
        ask('Autre chose ?');
    } catch (error) {
        console.log(error);
    }
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

async function getTeamPlayers(team) {
  console.log('getTeamPlayers');
  // api call to get players from the team
  const data = await api.getTeamPlayers(team);
  console.log(data);
  // print list of players
  return 'getTeamPlayers';
}

async function getMatchInfo(params = {}) {
  console.log('getMatchInfo');
  // api call with timeFrame --> getMatchInfos
  // params.timeFrame
  const data = await api.getMatchInfos(team);
  console.log(data);
  // print list of matchs
  return 'getMatchInfo';
}
async function getTeamMatchInfo(params = {}) {
  console.log('getTeamMatchInfo');
  // api call --> getTeamMatchInfos
  // params.teamId & params.timeFrame
  const data = await api.getTeamMatchInfos(team);
  console.log(data);
  // print list of matchs
  return 'getTeamMatchInfo';
}
async function getCompetionMatchInfo(params = {}) {
  console.log('getCompetionMatchInfo');
  // api call --> getCompetitionMatchs
  // params.competitionsId & params.timeFrame
  const data = await api.getCompetitionMatchs(team);
  console.log(data);

  // print list of matchs
  return 'getCompetionMatchInfo';
}

async function getCompetitionTeams(competition) {
  console.log('getCompetitionTeams');
  //api call get competition teams
  const data = await api.getCompitionTeams(competition);
  console.log(data);
  // print list of teams
  return 'getCompetitionTeams';
}

async function getCompetitionRanking(competition) {
  console.log('getCompetitionRanking');
  // api call get competition ranking
  const data = await api.getCompetitionInfo(competition);
  console.log(data);
  // print ranking of competition
  return 'getCompetitionRanking';
}

async function getCompetionInfo(competition) {
  console.log('getCompetionInfo');
  // api call get competition
  const data = await api.getCompetitionInfo(competition);
  console.log(data.standing);
  // print info
  return 'getCompetionInfo';
}

module.exports = {
  ask, getRanking,
};
