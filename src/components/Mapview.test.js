import React from 'react';
import MapView from './MapView';
import { shallow } from 'enzyme';
// Stop eslint complaining about 'it'
/* eslint-disable no-undef */

it('does a shallow render', () => {
  const wrapper = shallow((<MapView />));
  expect(wrapper).toBeDefined();
});