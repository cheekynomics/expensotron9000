import React, { Component } from 'react';

import MapView from './components/MapView';
// import InfoView from './components/InfoView';

import './Expensotron.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      focusedRegion: null,
      focusedConstituency: null
    };
    this._unselectRegion = this._unselectRegion.bind(this);
    this._toggleConstituency = this._toggleConstituency.bind(this);
    this._selectRegion = this._selectRegion.bind(this);
  }

  _unselectRegion() {
    this.setState({
      focusedRegion: null,
      focusedConstituency: null
    });
  }

  _toggleConstituency(constituencyID) {
    let newConst = constituencyID;
    if (constituencyID === this.state.focusedConstituency) {
      newConst = null;
    }
    this.setState({
      focusedConstituency: newConst
    });
  }

  _selectRegion(regionID) {
    this.setState({
      focusedRegion: regionID,
      focusedConstituency: null
    });
  }

  render() {
    return (
      <div className="expensotron">
        <MapView
                 unselectRegion={ this._unselectRegion }
                 selectRegion={ this._selectRegion }
                 toggleConstituency={ this._toggleConstituency }
                 focusedRegion={ this.state.focusedRegion }
                 focusedConstituency={ this.state.focusedConstituency } />
      </div>);
  }
}

export default App;
