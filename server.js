// Imports
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

// ICEBOX: mern_review api router paths controllers

// Ports
const port = process.env.PORT || 8080;
const isProduction = (process.env.NODE_ENV === 'production');

// Middleware
const app = express();
app.use(cors());
app.use(express.json()); // incomming
// STRETCH: if Wordnik auth gets fixed, implement custom lists
app.use(express.urlencoded({ extended: true })); // outgoing posts/puts

// mern_review adv.
app.use((err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).send(message);
});

// Configurations
const corsOps = {
  origin: "http://localhost:3000"
};

const reqEndpoint = "http://api.wordnik.com/v4/words.json/randomWords";
const corpusCount = 11000
const reqParams = `?hasDictionaryDef=true&includePartOfSpeech=adjective%2Cverb%2Cadverb&excludePartOfSpeech=given-name%2Cnoun%2Cproper-noun%2Cfamily-name%2Cnoun-plural%2Cabbreviation&minCorpusCount=${corpusCount}&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=5&limit=10&api_key=`

app.get('/apiv1', cors(corsOps), async (req, res) => {
  const response = await fetch(reqEndpoint + reqParams + process.env.WORDNIK_KEY, {
    method: 'GET',      
    Headers: {
      // Authorization: 'api_key ' + process.env.WORDNIK_KEY,
      Accept: 'application/json',
    }
  });
  const jsonRes = await response.json();
  res.json(jsonRes);
});

app.listen(8080, () => {
  console.log(`🌟 SERVER PORT: ${port} ✅ | production: ${isProduction}`);
});
