const Table = require('cli-table');
const colors = require('colors/safe');
const moment = require('moment');
moment.locale('fr');

function showRanking(data) {
  const table = new Table({
    head: ['Position', 'Nom', "Points", "Joués", "Gagnés", "Nuls", "Perdus", "Buts", "Buts encaissés"],
    colWidths: [10, 30, 10, 10, 10, 10, 10, 10, 20],
  });
  if(!data.standing) {
    console.log("Erreur : Impossible d'acceder à la liste");
  } else {
    for (team of data.standing) {
      {
        table.push([colors.blue(team.position), team.teamName, colors.green(team.points), team.playedGames, team.wins, team.draws, team.losses, team.goals, team.goalsAgainst]);
      }
    }
    console.log(table.toString());
  }
}

function showTeamPlayers(data) {
  const table = new Table({
    head: ['Nom', 'Poste', "Numero Maillot", "Date de naissance", "Nationalité", "Date de fin de contrat"],
  });
  for (player of data.players) {
    const yearsOld = moment().diff(player.dateOfBirth, 'years');
    const dateOfBirthWithAge = `${moment(player.dateOfBirth).format('L')} (${yearsOld})`;
    const dateContract = player.contractUntil ?
      moment(player.contractUntil).format('L')
      : "Inconnu";
    table.push([colors.green(player.name), player.position, player.jerseyNumber||'Inconnu', dateOfBirthWithAge, player.nationality, dateContract]);
  }
  console.log(table.toString());
}

function showTeamsCompetition(data) {
  const table = new Table();

  for (team of data.teams) {
    table.push({
      'Nom': team.name
    });
  }

  console.log(table.toString());
}

function showMatchInfos(data) {
  const status = {
    'TIMED': colors.blue,
    'IN_PLAY': colors.green,
    'POSTPONED': colors.magenta,
    'FINISHED': colors.red,
    'SCHEDULED': colors.blue,
  };

  const table = new Table({
    head: ['Status', 'Date', 'Journée', 'Équipes', 'Résultat', 'Résultat Mi-Temps'],
  });

  for (match of data.fixtures) {

    const date = moment(match.date).format('llll');

    const rencontre = `${match.homeTeamName} - ${match.awayTeamName}`;

    const result = match.result && match.result.goalsHomeTeam !== null
      ? `${match.result.goalsHomeTeam} - ${match.result.goalsAwayTeam}`
      : 'Inconnu';

    const halfTimeResult = match.result && match.result.halfTime && match.result.halfTime.goalsHomeTeam
      ? `${match.result.halfTime.goalsHomeTeam} - ${match.result.halfTime.goalsAwayTeam}`
      : 'Inconnu';

      table.push([
      status[match.status](match.status), date, match.matchday, rencontre, result, halfTimeResult
    ])
  }

  console.log(table.toString());
}

module.exports = { showRanking, showTeamPlayers, showTeamsCompetition, showMatchInfos };
