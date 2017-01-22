import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// Stop eslint complaining about 'it'
/* eslint-disable no-undef */

it('renders everything without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
