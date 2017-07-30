import React, { Component } from 'react';
import * as d3 from 'd3';

import { connect } from 'react-redux';
import { fetchData } from '../actions/index';

class App extends Component {
  constructor(props) {
    super(props);
    this.createScatterplot = this.createScatterplot.bind(this);
    this.props.fetchData();
    if (this.props.data.length > 0) {
      this.createScatterplot();
    }
  }

  componentDidUpdate() {
    this.createScatterplot();
  }

  createScatterplot() {
    const { data } = this.props;

    const w = 850;
    const h = 500;

    const margin = {
      top: 30,
      right: 80,
      bottom: 80,
      left: 50
    };

    const fastestTime = d3.min(data, d => {
      return d.Seconds;
    });

    data.forEach(d => {
      d.Behind = d.Seconds - fastestTime;
    });


    const minTime = new Date(d3.min(data, d => {
      return d.Behind * 1000;
    }));
    const maxTime = new Date(d3.max(data, d => {
      return (d.Behind + 5) * 1000;
    }));

    const xScale = d3.scaleTime()
                     .domain([maxTime, minTime])
                     .range([margin.left, w - margin.right]);

    const firstPlace = d3.min(data, d => {
      return d.Place;
    });

    const lastPlace = d3.max(data, d => {
      return d.Place;
    });

    const yScale = d3.scaleLinear()
                     .domain([firstPlace, lastPlace + 1])
                     .range([margin.top, h - margin.bottom]);

    const svg = d3.select('.chart')
                  .append('svg')
                  .attr('width', w)
                  .attr('height', h);

    const div = d3.select('body')
                  .append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0);

    svg.selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .attr('cx', d => {
         return xScale(new Date(d.Behind * 1000));
       })
       .attr('cy', d => {
         return yScale(d.Place);
       })
       .attr('r', 5)
       .attr('fill', d => {
         if (d.Doping == "") {
           return "#333";
         } else {
           return "#ff2121";
         }
       })
       .on('mouseover', function(d) {
         const xPosition = parseFloat(d3.select(this).attr('cx'));

         const yPosition = parseFloat(d3.select(this).attr('cy'));

         div.transition()
            .duration(100)
            .style('opacity', 0.9)

          div.html(`<strong>${d.Name} (${d.Nationality})</strong><br>Year: ${d.Year}, Time: ${d.Time}<br>${d.Doping}`)
          .style('left', `${xPosition + 150}px`)
          .style('top', `${yPosition - 10}px`);
       })
       .on('mouseout', function(d) {
         div.transition()
            .duration(100)
            .style('opacity', 0);
       });

    svg.selectAll('text')
       .data(data)
       .enter()
       .append('text')
       .text(d => { return d.Name })
       .attr('x', d => {
         return xScale(new Date(d.Behind * 1000));
       })
       .attr('y', d => { return yScale(d.Place) })
       .attr('font-family', 'sans-serif')
       .attr('font-size', '10px')
       .attr('fill', '#333')
       .attr('transform', 'translate(5, 3)');


    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat("%M:%S"));

    svg.append('g')
       .attr('class', 'axis')
       .attr('transform', `translate(0, ${h - margin.bottom})`)
       .call(xAxis);

    svg.append('text')
       .attr('x', w / 2)
       .attr('y', (h - margin.bottom / 2))
       .style('text-anchor', 'middle')
       .text('Minutes Behind Fastest Time');

    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
       .attr('class', 'axis')
       .attr('transform', `translate(${margin.left}, 0)`)
       .call(yAxis);
       console.log(data);

    svg.append('text')
       .attr('transform', 'rotate(-90)')
       .attr('x', -margin.top)
       .attr('y', margin.left / 2)
       .style('text-anchor', 'end')
       .text('Ranking');

    svg.append('text')
       .attr('x', w / 2)
       .attr('y', margin.top / 2)
       .attr('class', 'subtitle')
       .style('text-anchor', 'middle')
       .text("35 Fastest Times Up Alpe d'Huez");

    svg.append('text')
       .attr('x', w / 2)
       .attr('y', margin.top / 2 + 20)
       .style('text-anchor', 'middle')
       .text('Normalized to 13.8km distance');

    svg.append('circle')
       .attr('cx', w * 0.7)
       .attr('cy', h * 0.5)
       .attr('r', 5)
       .attr('fill', '#333');

    svg.append('text')
       .attr('x', w * 0.71)
       .attr('y', h * 0.505)
       .style('text-anchor', 'start')
       .style('font-size', '10px')
       .text('No doping allegations');

    svg.append('circle')
       .attr('cx', w * 0.7)
       .attr('cy', h * 0.55)
       .attr('r', 5)
       .attr('fill', '#ff2121');

    svg.append('text')
       .attr('x', w * 0.71)
       .attr('y', h * 0.555)
       .style('text-anchor', 'start')
       .style('font-size', '10px')
       .text('Riders with doping allegations');
  }

  render() {

    return(
      <div>
        <h1>Doping in Professional Bicycle Racing</h1>
        <div className='chart'></div>
      </div>
    )
  }
}

function mapStateToProps({ data }) {
  return {
    data: data
  };
}

export default connect(mapStateToProps, { fetchData })(App);
