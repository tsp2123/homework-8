import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

// Create SVG
var svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Creating Pie Chart Scales
var pie = d3.pie().value(function(d) {
  return d.minutes
})

let radius = 80

var colorScale = d3.scaleOrdinal().range(['#7fc97f', '#beaed4', '#fdc086'])

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)


var xPositionScale = d3
  .scalePoint()
  .range([0, width])
  .padding(0.5)

// Reading in the data
d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // console.log('data is', datapoints)

  // Creating a domain for our xPositionScale
  var projectList= datapoints.map(d => d.project)
  xPositionScale.domain(projectList)

  // Nesting the data by project
  var nested = d3
    .nest()
    .key(d => d.project)
    .entries(datapoints)


  svg
    .selectAll('.small-multiples')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'small-multiples')
    .attr('transform', d => {
      return `translate(${xPositionScale(d.key)},${height / 2})`
    })
    .each(function(d) {
      var container = d3.select(this)

      // The pies
      container
        .selectAll('path')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))
      container
        .append('text')
        .datum(nested)
        .text(d.key)
        .attr('x', 0)
        .attr('y', radius)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'hanging')
        .attr('dy', 10)
    })
}