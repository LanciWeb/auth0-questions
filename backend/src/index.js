//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

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

//insert new question
app.post('/', (req, res) => {
  const { title, description } = req.body;
  const newQuestion = {
    id: questions.length + 1,
    title,
    description,
    answers: []
  };
  questions.push(newQuestion);
  res.status(201).send();
});

// insert a new answer to a question
app.post('/answer/:id', (req, res) => {
  const { answer } = req.body;
  const question = questions.filter(q => q.id === parseInt(req.params.id));
  if (questions.length > 1) res.status(500).send();
  if (question.length === 0) res.status(404).send();
  res.status(201).send();
});

//start the server
app.listen(8081, () => {
  console.log('listening on port 8081');
});
