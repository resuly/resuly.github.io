function create_heatmap(ith, svg, data, dataMean, type) {
  var tempColor;
  svg.selectAll('rect')
    .append('g')
    .data(data).enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('x', function (d, i) {
      // console.log(i, d[1], xScale(d[1]) - cellSize / 2)
      return xScale(d[1]);
    })
    .attr('y', function (d, i) {
      // console.log('x', i%8+1, yScale(i%8+1))
      return yScale(d[0]);
    })
    .attr('fill', function (d) {

      // https://github.com/d3/d3-scale-chromatic

      if (type == 'in') {
        // return d3.interpolateRdPu(linear(d[2]));
        return d3.interpolateBuPu(linear(d[2]));
      }else{
        return d3.interpolateGnBu(linear(d[2]));
      }

    })
    // .attr("rx", 3)
    // .attr("ry", 3)
    // .on("mouseover", function (d) {
    //   d3.select(this)
    //     .style('fill', "#000")
    //     .style('opacity', .5);
    // })
    .on("mouseover", function (d) {
      tempColor = this.style.fill;
      this.style.fill = 'rgb(255, 167, 167)';
      d3.select(this).style('opacity', .5);
      tooltip.style("visibility", "visible").style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");
      // console.log(d3.mouse(this)[0])
      tooltip.text("flow: " + d[2])
    })
    .on("mouseout", function () {
      this.style.fill = tempColor;
      d3.select(this).style("stroke", "none");
      d3.select(this).style('opacity', 1);
      tooltip.style("visibility", "hidden");
    });
  if (ith == 1) {
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      // .selectAll('text')
      // .attr("transform", function (d) {
      //   return "rotate(-65)";
      // })
  }

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(10," + (y_elements.length * cellSize + cellSize / 2) + ")")
    .call(xAxis)
    .selectAll('text')
    .style("text-anchor", "end").attr("dx", "-.8em").attr("dy", "-.5em")

}


var showD3Clock = function(width,clock) {
  var w = width             // Width of SVG element
  var h = width             // Height of SVG element

  var cx = w / 2          // Center x
  var cy = h / 2          // Center y
  var margin = 4
  var r = w / 2 - margin  // Radius of clock face

  makeClockFace()

  // Create hands from dataset
  clock.selectAll("line.hand")
    .data(getTimeOfDay())
    .enter()
    .append("line")
    .attr("class", function (d) { return d[0] + " hand"})
    .attr("x1", cx)
    .attr("y1", function (d) { return cy + handBackLength(d) })
    .attr("x2", cx)
    .attr("y2", function (d) { return r - handLength(d)})
    .attr("transform", rotationTransform)

  // Update hand positions once per second
  // setInterval(updateHands, 1000)

  function makeClockFace() {
    var hourTickLength = Math.round(r * 0.2)
    var minuteTickLength = Math.round(r * 0.075)
    for (var i = 0; i < 60; ++i) {
      var tickLength, tickClass
      if ((i % 5) == 0) {
        tickLength = hourTickLength
        tickClass = "hourtick"
      }
      else {
        tickLength = minuteTickLength
        tickClass = "minutetick"
      }
      clock.append("line")
        .attr("class", tickClass + " face")
        .attr("x1", cx)
        .attr("y1", margin)
        .attr("x2", cx)
        .attr("y2", margin + tickLength)
        .attr("transform", "rotate(" + i * 6 + "," + cx + "," + cy + ")")
    }
  }

  function getTimeOfDay() {
    var now = new Date()
    var hr = now.getHours()
    var min = now.getMinutes()
    var sec = now.getSeconds()
    return [
      [ "hour",   hr + (min / 60) + (sec / 3600) ],
      [ "minute", min + (sec / 60) ],
      // [ "second", sec ]
    ]
  }

  function handLength(d) {
    if (d[0] == "hour")
      return Math.round(0.45 * r)
    else
      return Math.round(0.90 * r)
  }

  function handBackLength(d) {
    if (d[0] == "second")
      return Math.round(0.25 * r)
    else
      return Math.round(0.10 * r)
  }

  function rotationTransform(d) {
    var angle
    if (d[0] == "hour")
      angle = (d[1] % 12) * 30
    else
      angle = d[1] * 6
    return "rotate(" + angle + "," + cx + "," + cy + ")"
  }

}

function getTimeOfOneDay(now) {
  // var now = new Date()
  var hr = now.getHours()
  var min = now.getMinutes()
  var sec = now.getSeconds()
  return [
    [ "hour",   hr + (min / 60) + (sec / 3600) ],
    [ "minute", min + (sec / 60) ],
    // [ "second", sec ]
  ]
}

function rotationTransform2(d,cx,cy) {
  var angle
  if (d[0] == "hour")
    angle = (d[1] % 12) * 30
  else
    angle = d[1] * 6
  return "rotate(" + angle + "," + cx + "," + cy + ")"
}
