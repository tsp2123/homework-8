import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

// Create SVG
var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Pie chart and some scales
var pie = d3.pie().value(function(d) {
  return d.minutes
})
var radius = 100
let arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(100)

var labelArc = d3
  .arc()
  .innerRadius(100 + 10)
  .outerRadius(100 + 10)

var colorScale = d3.scaleOrdinal().range(['#7fc97f', '#beaed4', '#fdc086'])
// Reading in the data
d3.csv(require('./data/time-breakdown.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

// Ready function go!
function ready(datapoints) {
  // console.log(pie(datapoints)[0].data.task)
  // centering it all on the svg
  var container = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  // The chart itself
  container
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.task))

  // Slapping on the text.
  // console.log(labelArc.centroid(pie(datapoints)[0]))

  container
    .selectAll('text')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .text(d => d.data.task)
    .attr('transform', d => `translate(${labelArc.centroid(d)})`)
    .attr('text-anchor', d => {
      if (d.startAngle > Math.PI) {
        return 'end'
      } else {
        return 'start'
      }
    })
}
