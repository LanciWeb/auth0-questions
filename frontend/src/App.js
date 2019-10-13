import Callback from './Callback';
import NavBar from './NavBar/NavBar';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Question from './Question/Question';
import Questions from './Questions/Questions';
class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Route exact path="/" component={Questions} />
        <Route exact path="/callback" component={Callback} />
        <Route exact path="/question/:questionId" component={Question} />
      </div>
    );
  }
}

export default App;
