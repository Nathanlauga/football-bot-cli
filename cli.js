const inquirer = require('inquirer');
const getLuisIntent = require('./luis');
const API = require('./api');
const { showRanking, showTeamPlayers } = require('./printer');
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
        await findResponse(intent, entities);
        ask('Autre chose ?');
      } catch (error) {
        console.log(error);
      }
    });
}

async function getRanking(competition) {
  const { intent, entities } = await getLuisIntent(competition);
  try {
    showRanking(await getCompetitionRanking(findCompetitionId(entities)));
    ask('Autre chose ?');
  } catch (error) {
    console.log(error);
  }
}

async function findResponse(intent, entities) {
  switch (intent) {
    case 'GetTeamPlayers':
      return showTeamPlayers(await getTeamPlayers(findTeamId(entities)));

    case 'GetMatchInfo':
      let params = {};
      let competitionId = findCompetitionId(entities, false);
      let teamId = findTeamId(entities, false);

      // if params timeframe empty --> timeFrame : "n7"
      params.timeFrame = 'n7';

      if (competitionId !== "Plus d'une compétition trouvée." && competitionId !== 'Compétitions introuvable.') {
        params.competition = competitionId;
        return getCompetionMatchInfo(params);
      } else if (teamId !== 'Equipe introuvable.' && teamId !== "Plus d'une équipe trouvée.") {
        params.team = teamId;
        return getTeamMatchInfo(params);
      }

      return getMatchInfo(params);

    case 'GetCompetitionTeams':
      return getCompetitionTeams(findCompetitionId(entities));

    case 'GetCompetitionRanking':
      const competition = findCompetitionId(entities);
      if (competition === 'Compétitions introuvable.') {
        return competition;
      }
      showRanking(await getCompetitionRanking(findCompetitionId(entities)));
      break;

    case 'GetCompetionInfo':
      return getCompetionInfo(findCompetitionId(entities));
    default:
      return 'no answer';
  }
}

function findTeamId(entities) {
  let teams = entities.filter((entity) => entity.type === 'Teams');
  if (teams.length === 1) {
    return teams[0].resolution.values;
  } else if (teams.length > 1) {
    return "Plus d'une équipe trouvée.";
  } else {
    return 'Equipe introuvable.';
  }
}

function findCompetitionId(entities) {
  let competitions = entities.filter((entity) => entity.type === 'Competitions');
  if (competitions.length === 1) {
    return competitions[0].resolution.values;
  }
  if (competitions.length > 1) {
    return "Plus d'une compétition trouvée.";
  } else {
    return 'Compétitions introuvable.';
  }
}

async function getTeamPlayers(team) {
  console.log('getTeamPlayers');
  // api call to get players from the team
  // print list of players
  return await api.getTeamPlayers(team);
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
  const data = await api.getTeamMatchInfos(params);
  console.log(data);
  // print list of matchs
  return 'getTeamMatchInfo';
}
async function getCompetionMatchInfo(params = {}) {
  console.log('getCompetionMatchInfo');
  // api call --> getCompetitionMatchs
  // params.competitionsId & params.timeFrame
  const data = await api.getCompetitionMatchs(params);
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
  // print ranking of competition
  return await api.getCompetitionInfo(competition);
}

async function getCompetionInfo(competition) {
  console.log('getCompetionInfo');
  // api call get competition
  // print info
  return await api.getCompetitionInfo(competition);
}

module.exports = {
  ask,
  getRanking,
};
