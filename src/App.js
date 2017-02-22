import React, { Component } from 'react';

import MapView from './components/MapView';
import InfoView from './components/InfoView';
import GroupedBarChart from './components/GroupedBar';
import * as expenses from './datafiles/SummariesByRegionAndYear.json';

import './Expensotron.css';
const id_to_name = {
  'E15000001': 'North East',
  'E15000002': 'North West',
  'E15000003': 'Yorkshire & the Humber',
  'E15000004': 'East Midlands',
  'E15000005': 'West Midlands',
  'E15000006': 'Eastern',
  'E15000007': 'London',
  'E15000008': 'South East',
  'E15000009': 'South West'
};
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
        <InfoView>
          <GroupedBarChart margin={{l : 100,
                                    t : 20,
                                    b : 70,
                                    r : 20}}
                            data = {expenses}
                            focusedRegion= { id_to_name[this.state.focusedRegion] }/>
        </InfoView>
      </div>);
  }
}

export default App;
