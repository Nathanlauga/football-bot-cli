const Table = require('cli-table');

function showRanking(data) {
  const table = new Table({
    head: ['Position', 'Nom', "Points", "Joués", "Gagnés", "Nuls", "Perdus", "Buts", "Buts encaissés"],
    colWidths: [10, 30, 10, 10, 10, 10, 10, 10, 20],
  });
  for (team of data.standing) {
    {
      table.push([team.position, team.teamName, team.points, team.playedGames, team.wins, team.draws, team.losses, team.goals, team.goalsAgainst]);
    }
  }
  console.log(table.toString());
}

function showTeamPlayers(data) {
  const table = new Table({
    head: ['Nom', 'Poste', "Numero Maillot", "Date de naissance", "Nationalité", "Date de fin de contrat"],
    colWidths: [10, 10, 10, 10, 10, 20],
  });
  for (player of data.players) {
    table.push([player.name, player.position, player.jerseyNumber, player.dateOfBirth, player.nationality, player.contractUntil]);
  }
  console.log(table.toString());
}

module.exports = { showRanking, showTeamPlayers };
