import axios from 'axios';
import auth0Client from '../Auth';
import React, { Component } from 'react';
import SubmitAnswer from './SubmitAnswer';

export default class Question extends Component {
  state = { question: null };

  submitAnswer = this.submitAnswer.bind(this);

  async componentDidMount() {
    await this.refreshQuestion();
  }

  async refreshQuestion() {
    const {
      match: { params }
    } = this.props;
    const question = (await axios.get(
      `http://localhost:8081/${params.questionId}`
    )).data;
    this.setState({
      question
    });
  }

  async submitAnswer(answer) {
    await axios.post(
      `http://localhost:8081/answer/${this.state.question.id}`,
      {
        answer
      },
      {
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      }
    );
    await this.refreshQuestion();
  }

  renderAnswers = () => {
    return this.state.question.answers.map((answer, idx) => (
      <p className="lead" key={idx}>
        {answer.answer}
      </p>
    ));
  };

  render() {
    const { question } = this.state;
    if (question === null) return <p>Loading ...</p>;
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
            <h1 className="display-3">{question.title}</h1>
            <p className="lead">{question.description}</p>
            <hr className="my-4" />
            <SubmitAnswer
              questionId={question.id}
              submitAnswer={this.submitAnswer}
            />
            <p>Answers:</p>
            {this.renderAnswers()}
          </div>
        </div>
      </div>
    );
  }
}
