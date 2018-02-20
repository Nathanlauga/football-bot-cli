require('dotenv').config();

const axios = require('axios');
const querystring = require('querystring');

module.exports = async function getLuisIntent(utterance) {
  const endpoint = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/';

  const queryParams = {
    'subscription-key': process.env.SUBSRIPTION_KEY,
    timezoneOffset: '0',
    verbose: true,
    q: utterance,
  };

  const luisRequest = `${endpoint}${process.env.LUIS_APP_ID}?${querystring.stringify(queryParams)}`;

  const { data } = await axios.get(luisRequest);
  return {
    intent: data.topScoringIntent.intent,
    entities: data.entities,
  };
};
