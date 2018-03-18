const inquirer = require('inquirer');
const getLuisIntent = require('./luis');
const API = require('./api');
const { showRanking, showTeamPlayers, showTeamsCompetition, showMatchInfos } = require('./printer');
const api = new API();

function say(message) {
  const handlerIntents = new Map();
  handlerIntents.set('GetTeamPlayers', getTeamPlayers);
  handlerIntents.set('GetCompetitionRanking', getCompetitionRanking);
  handlerIntents.set('GetCompetitionTeams', getCompetitionTeams);
  handlerIntents.set('GetMatchInfo', getMatchInfo);
  handlerIntents.set(null, () => console.log("Je n'ai pas bien compris ce que vous voulez dire"));

  inquirer.prompt([
    {
      type: 'input',
      name: 'answer',
      message,
    },
  ]).then(async ({ answer }) => {
    if (answer === 'exit' || answer === 'quit' || answer === '') {
      return;
    }
    const { intent, entities } = await getLuisIntent(answer);
    try {
      await handlerIntents.get(intent)(entities);
      say('Autre chose ?');
    } catch (error) {
      console.log(error);
    }
  });
}

function findTeamId(entities) {
  let teams = entities.filter((entity) => entity.type === 'Teams');
  if (teams.length === 1) {
    return teams[0].resolution.values;
  } else if (teams.length > 1) {
    const teamsValues = [];
    for (team of teams) {
      teamsValues.push(team.resolution.values);
    }
  } else {
    return null;
  }
}

function findCompetitionId(entities) {
  let competitions = entities.filter((entity) => entity.type === 'Competitions');
  if (competitions.length === 1) {
    return competitions[0].resolution.values;
  } else if (competitions.length > 1) {
    const competitionsValues = [];
    for (competition of competitions) {
      competitionsValues.push(competition.resolution.values);
    }
  } else {
    return null;
  }
}

async function getTeamPlayers(entities) {
  const team = findTeamId(entities);
  console.log('getTeamPlayers');
  // api call to get players from the team
  // print list of players
  const data = await api.getTeamPlayers(team);
  showTeamPlayers(data);
  return data;
}

async function getMatchInfo(entities) {
  let params = {};

  params.timeFrame = 'n7';

  let competitionId = findCompetitionId(entities);
  let teamId = findTeamId(entities);

  if (competitionId !== null && competitionId.length === 1) {
    params.competitionId = competitionId[0];
    const data = await api.getCompetitionMatchs(params);
    showMatchInfos(data);
    return data;
  } else if (teamId !== null && teamId.length === 1) {
    params.teamId = teamId[0];
    const data = await api.getTeamMatchInfos(params);
    showMatchInfos(data);
    return data;
  } else {
    const data = await api.getMatchInfos();
    showMatchInfos(data);
    return data;
  }
}

async function getTeamMatchInfo(entities) {
  const params = {};
  params.timeFrame = 'n7';

  let teamId = findTeamId(entities);
  if (teamId !== null && teamId.length === 1) {
    params.teamId = teamId[0];
    const data = await api.getTeamMatchInfos(params);
    showMatchInfos(data);
  }
}

async function getCompetitionMatchInfo(entities) {
  const params = {};
  params.timeFrame = "n7";
  let competitionId = findCompetitionId(entities);
  if (competitionId !== null && competitionId.length === 1) {
    params.competitionId = competitionId[0];
    const data = await api.getCompetitionMatchs(params);
    showMatchInfos(data);
  }
}

async function getCompetitionTeams(entities) {
  console.log('getCompetitionTeams');
  //api call get competition teams
  const competition = findCompetitionId(entities);
  const data = await api.getCompitionTeams(competition);
  return showTeamsCompetition(data);
}

async function getCompetitionRanking(entities) {
  try {
    const competition = findCompetitionId(entities);
    if (competition !== null) {
      const results = await api.getCompetitionInfo(competition);
      return showRanking(results);
    } else {
      return console.log("Je n'ai pas compris le nom de la compétition.")
    }
  } catch (error) {
    console.error(error);
  }
}

async function getRanking(competition) {
  const { entities } = await getLuisIntent(competition);
  try {
    await getCompetitionRanking(entities);
    say('Autre chose ?');
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  say,
  getCompetitionRanking,
  getTeamPlayers,
  getTeamMatchInfo,
  getCompetitionMatchInfo,
  getCompetitionTeams
};
