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
}

module.exports = API;