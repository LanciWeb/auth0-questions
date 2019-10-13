//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

//define the express app
const app = express();

//the database
const questions = [];

//enhance app security
app.use(helmet());

//use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// enable all cors requests
app.use(cors());

// loh HTTP requests
app.use(morgan('combined'));

//retreive all questions
app.get('/', (req, res) => {
  const qs = questions.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    answers: q.answers.length
  }));

  res.send(qs);
});

//get a specific question
app.get('/:id', (req, res) => {
  const question = questions.filter(q => q.id === parseInt(req.params.id));

  if (question.length > 1) return res.status(500).send();
  if (question.lngth === 0) return res.status(404).send();
  res.send(question[0]);
});

//this middleware validates the Jason web token
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-96y5ffbs.eu.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'RC1URFAY76Ur19zQ4biLh7O07KAJ6MmB',
  issuer: `https://dev-96y5ffbs.eu.auth0.com/`,
  algorithms: ['RS256']
});

//insert new question
app.post('/', checkJwt, (req, res) => {
  const { title, description } = req.body;
  const newQuestion = {
    id: questions.length + 1,
    title,
    description,
    answers: [],
    author: req.user.name
  };
  questions.push(newQuestion);
  res.status(201).send();
});

// insert a new answer to a question
app.post('/answer/:id', checkJwt, (req, res) => {
  const { answer } = req.body;
  console.log(answer);
  const question = questions.filter(q => q.id === parseInt(req.params.id));
  if (questions.length > 1) res.status(500).send();
  if (question.length === 0) res.status(404).send();
  question[0].answers.push({
    answer,
    author: req.user.name
  });
  res.status(201).send();
});

//start the server
app.listen(8081, () => {
  console.log('listening on port 8081');
});
