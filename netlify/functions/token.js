/* eslint-disable no-undef */
const axios = require('axios');
require('dotenv').config();

// eslint-disable-next-line no-unused-vars
exports.handler = async function(event, context) {
  const { code } = JSON.parse(event.body);

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error fetching token:', error);
    return {
      statusCode: 500,
      body: 'Error fetching token'
    };
  }
};
