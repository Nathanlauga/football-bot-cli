const axios = require('axios');

class API {
  constructor() {
    this.rootUrl = "http://www.football-data.org";
  }

  async getCompetitions() {
    const {data} = await axios.get(`${this.rootUrl}/v1/competitions/`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    });
    return data;
  }

  async getTeamInfo(teamId) {
    return { data } = await axios.get(`${this.rootUrl}/v1/competitions/${teamId}/teams`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    })
  }

  async getCompetitionInfo(competitionId) {
    return { data } = await axios.get(`${this.rootUrl}/v1/competitions/${competitionId}/leagueTable`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    })
  }

  async getCompetitionMatchs(competitionId) {
    return { data } = await axios.get(`${this.rootUrl}/v1/competitions/${competitionId}/teams`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    })
  }

  async getMatchInfos() {
    return { data } = await axios.get(`${this.rootUrl}/v1/competitions/${competitionId}/teams`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    })
  }

  async getTeamMatchInfos(teamId) {
    return { data } = await axios.get(`${this.rootUrl}/v1/teams/${teamId}/fixtures`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    })
  }

  async getTeamInfos(teamId) {
    return { data } = await axios.get(`${this.rootUrl}/v1/teams/${teamId}`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    })
  }

  async getTeamPlayers(teamId) {
    return { data } = await axios.get(`${this.rootUrl}/v1/teams/${teamId}/players`, {
      headers: { "X-Auth-Token": "29c012ae3c6f465da64b5d671848bbc6" }
    })
  }
}

module.exports = API;