require('dotenv').config();

const request = require('request');
const querystring = require('querystring');

module.exports = function getLuisIntent(utterance) {

  const endpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/";

  const queryParams = {
    "subscription-key": process.env.SUBSRIPTION_KEY,
    "timezoneOffset": "0",
    "verbose":  true,
    "q": utterance
  };

  const luisRequest = `${endpoint}${process.env.LUIS_APP_ID}?${querystring.stringify((queryParams))}`;

  request(luisRequest, (err, response, body) => {
      if (err)
        console.log(err);
      else {
        const data = JSON.parse(body);
        console.log(data);

        return {
          intent: data.topScoringIntent.intent,
          entities: data.entities,
          id: data.entities[0].resolution.values,
        };
      }
    });
};