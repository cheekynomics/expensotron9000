import React, { Component } from 'react';


class InfoView extends Component {

  render() {

    return (
      <div className="infoview">
        {this.props.children}
      </div>);
  }
}


export default InfoView;