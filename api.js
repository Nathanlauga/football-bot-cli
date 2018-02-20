const axios = require('axios');

class API {
  constructor() {
    this.rootUrl = "http://www.football-data.org";
  }

  async getCompetitions() {
    const { data } = await axios.get(`${this.rootUrl}/v1/competitions/`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    });
    return data;
  }

  async getCompitionTeams(teamId) {
    const { data } = await axios.get(`${this.rootUrl}/v1/competitions/${teamId}/teams`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    });
    return data;
  }

  async getCompetitionInfo(competitionId) {
    const { data } = await axios.get(`${this.rootUrl}/v1/competitions/${competitionId}/leagueTable`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    });
    return data;
  }

  async getCompetitionMatchs(competitionId) {
    const { data } = await axios.get(`${this.rootUrl}/v1/teams/${competitionId}/fixtures`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    });
    return data;
  }

  async getMatchInfos() {
    const { data } = await axios.get(`${this.rootUrl}/v1/fixtures/`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    });
    return data;
  }

  async getTeamMatchInfos(teamId) {
    const { data } = await axios.get(`${this.rootUrl}/v1/teams/${teamId}/fixtures`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    });
    return data;
  }

  async getTeamPlayers(teamId) {
    const { data } = await axios.get(`${this.rootUrl}/v1/teams/${teamId}/players`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    });
    return data;
  }
}

module.exports = API;