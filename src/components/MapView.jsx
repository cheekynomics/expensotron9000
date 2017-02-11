import * as d3 from 'd3';
import * as _ from 'lodash';
import React, { Component } from 'react';
import * as topojson from 'topojson';

import regions_topo from '../datafiles/regions.json';
import scotland_topo from '../datafiles/scotland.json';
import wales_topo from '../datafiles/wales.json';
import constituencies_topo from '../datafiles/constituencies.json';
import con_to_reg from '../datafiles/con_to_reg.json';

// Variables
const bg_gray = '#dddddd';
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

let eer = topojson.feature(regions_topo, regions_topo.objects.eer);
let eer_regions = eer.features;
let wales = topojson.feature(wales_topo, wales_topo.objects.eer).features;
let scotland = topojson.feature(scotland_topo, scotland_topo.objects.eer).features;
let constituencies_obj = topojson.feature(constituencies_topo, constituencies_topo.objects.wpc);
let constituencies = constituencies_obj.features;

class MapView extends Component {

  componentDidMount() {
    this._svg.style('width', '100%');
    this._svg.style('height', '100%');
    this._transGroup = this._svg.append('g');

    let pad = 20;
    let svg = this._svg;

    svg
      .on('click', this.props.unselectRegion);

    let g = this._transGroup;

    let bs = svg._groups[0][0].getBoundingClientRect();
    this._bs = bs;

    this._zoom = d3.zoom().on('zoom', () => {
      this._transGroup.attr('transform', d3.event.transform);
    });

    let projection = d3.geoAlbers()
      .parallels([50, 60]) // Conic parallels (latitudes) that sandwich GBR for minimal distortion.
      .rotate([-4, 0]) // Rotate to minimise distortion over the UK.
      .fitExtent([[pad, pad], [bs.width - pad, bs.height - pad]], constituencies_obj);

    let path = d3.geoPath()
      .projection(projection);

    this._bounds = {};
    this._centroids = {};

    _.forEach(eer_regions, (reg) => {
      this._bounds[reg.id] = path.bounds(reg);
      this._centroids[reg.id] = path.centroid(reg);
    });

    _.forEach(constituencies, (c) => {
      c.info = con_to_reg[c.id];
      c.info.regName = id_to_name[c.info.reg];
    });

    let cheekyPalette = ['rgb(148,166,253)', 'rgb(3,98,160)', 'rgb(72,182,234)',
      'rgb(94,67,147)', 'rgb(164,119,251)', 'rgb(46,33,208)',
      'rgb(46,236,230)', 'rgb(141,25,147)', 'rgb(247,94,240)'];
    this._colours = d3.scaleOrdinal(cheekyPalette).domain(_.keys(id_to_name));

    g.selectAll('.scotland')
      .data(scotland)
      .enter()
      .append('path')
      .attr('class', 'scotland geom')
      .attr('d', path)
      .style('fill', bg_gray);

    g.selectAll('.wales')
      .data(wales)
      .enter()
      .append('path')
      .attr('class', 'wales geom')
      .attr('d', path)
      .style('fill', bg_gray);

    g.selectAll('.cons')
      .data(constituencies)
      .enter()
      .append('path')
      .attr('class', (d) => {
        return `geom cons ${(d.id)}`;
      })
      .attr('d', path)
      .style('fill', (d) => this._colours(d.info.reg))
      .on('click', (d) => {
        // Prevent re-zoom
        d3.event.stopPropagation();

        // If region not selected:
        let thisRegion = d.info.reg;
        if (thisRegion === this.props.focusedRegion) {
          // Toggle constituency
          this.props.toggleConstituency(d.id);
        } else {
          // Zoom to region.
          this.props.selectRegion(d.info.reg);
        }
      });

    this._geoms = g.selectAll('.geom');
    this._cons = g.selectAll('.cons');

    this._cons.append('title').text((d) => d.info.regName);
  }

  /*
  * Check whether the constituency datum belongs to the focused region.
  */
  _isFocusedRegion(d) {
    return this.props.focusedRegion && d.info.reg === this.props.focusedRegion;
  }

  render() {
    if (this._transGroup) {

      // 1st set relevant transform on group element
      let transform = d3.zoomIdentity;
      if (this.props.focusedRegion !== null) {
        let bounds = this._bounds[this.props.focusedRegion];
        let dx = bounds[1][0] - bounds[0][0];
        let dy = bounds[1][1] - bounds[0][1];
        let x = (bounds[0][0] + bounds[1][0]) / 2;
        let y = (bounds[0][1] + bounds[1][1]) / 2;
        let scale = .9 / Math.max(dx / this._bs.width, dy / this._bs.height);
        let translate = [this._bs.width / 2 - scale * x, this._bs.height / 2 - scale * y];
        transform = d3.zoomIdentity.translate(...translate).scale(scale);
      }

      this._transGroup.transition().duration(500)
        .call(this._zoom.transform, transform);

      // 2nd Set relevant transitions on constituency elements
      this._cons
        .classed('zoomed', this.props.focusedRegion)
        .classed('focused', (d) => this._isFocusedRegion(d))
        .classed('selected', (d) => this.props.focusedConstituency === d.id)
        .style('stroke', (d) => {
          if (this.props.focusedConstituency === d.id) {
            return 'black';
          } else {
            return this._colours(d.info.reg);
          }
        });
    }

    return (
      <div className="mapview">
        <svg ref={ (c) => this._svg = d3.select(c) } />
      </div>);
  }
}

export default MapView;