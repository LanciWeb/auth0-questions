import auth0Client from '../Auth';
import { withRouter } from 'react-router-dom';
import React, { Component, Fragment } from 'react';

class SubmitAnswer extends Component {
  state = { answer: '' };

  updateAnswer(value) {
    this.setState({
      answer: value
    });
  }

  submit() {
    this.props.submitAnswer(this.state.answer);

    this.setState({
      answer: ''
    });
  }

  render() {
    if (!auth0Client.isAuthenticated()) return null;
    return (
      <Fragment>
        <div className="form-group text-center">
          <label htmlFor="exampleInputEmail1">Answer:</label>
          <input
            type="text"
            onChange={e => {
              this.updateAnswer(e.target.value);
            }}
            className="form-control"
            placeholder="Share your answer."
            value={this.state.answer}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            this.submit();
          }}
        >
          Submit
        </button>
        <hr className="my-4" />
      </Fragment>
    );
  }
}

export default withRouter(SubmitAnswer);
