let dataNum = 240, dataMax = 219, dataMean=9.987-2, dataMin=0;
let linear = d3.scaleLinear()
  .domain([0, dataMax])
  .range([0.01, 1])

var lPatchWidth = 200;
var margin = {
    top: 50,
    right: 20,
    bottom: 120,
    left: 50
  };
var data,subdata;
var width = 800 - margin.right - margin.left;
var height = 400 - margin.top - margin.bottom;
var cellSize = (width)/(8*5.8);

// scale & axis
var x_elements = [1,2,3,4,5,6,7,8];
var y_elements = [16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1];
var xScale = d3.scaleBand()
  .domain(x_elements)
  .range([0, x_elements.length * cellSize])
  // .paddingInner(20)
  // .paddingOuter(cellSize / 2);
var xAxis = d3.axisBottom()
  .scale(xScale).tickFormat(function (d) {
    return d;
  });
var yScale = d3.scaleBand()
  .domain(y_elements).range([0, y_elements.length * cellSize])
  // .paddingInner(.2)
  // .paddingOuter(.2);
var yAxis = d3.axisLeft()
  .scale(yScale)
  .tickFormat(function (d) {
    return d;
  });

var legendScale = d3.scaleLinear()
  .domain([dataMax, dataMin])
  .range([0, y_elements.length * cellSize])
var legendAxis = d3.axisRight()
  .scale(legendScale)
  .tickFormat(function (d) {
    return d;
  });

// tooltip
tooltip = d3.select("body")
  .append("div")
    .attr('class', 'tooltip');
toolval = tooltip.append("div");

window.onload = function () {
  d3.json('http://7xml0w.com1.z0.glb.clouddn.com/bike_comparison.json').then(function (response) {
    dataMax = response.max;
    dataMean = response.mean;
    data = response.data;

    invertcolors = 0;
    // Inverting color scale
    if (invertcolors) {
      colorHold.reverse();
    }

    var rootsvg = d3.select('.heatmap').append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
    d3.select('.heatmap').style('width',width + margin.left + margin.right);
    var g1 = rootsvg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var g2 = rootsvg.append("g").attr("transform", "translate(" + (margin.left+cellSize*8.5) + "," + margin.top + ")");
    var g3 = rootsvg.append("g").attr("transform", "translate(" + (margin.left+cellSize*19) + "," + margin.top + ")");
    var g4 = rootsvg.append("g").attr("transform", "translate(" + (margin.left+cellSize*27.5) + "," + margin.top + ")");
    var initN = 0;
    create_heatmap(1, g1, data[initN]['in'][0], dataMean, 'in');
    create_heatmap(2, g2, data[initN]['in'][1], dataMean, 'in');
    create_heatmap(3, g3, data[initN]['out'][0], dataMean, 'out');
    create_heatmap(4, g4, data[initN]['out'][1], dataMean, 'out');
    d3.select('#in_rmse').text(data[initN]['in_rmse']);
    d3.select('#out_rmse').text(data[initN]['out_rmse']);

    /////////////////// Legends ///////////////////////////
    // https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient
    //Append a defs (for definition) element to your SVG
    var defs = rootsvg.append("defs");
    //Append a linearGradient element to the defs and give it a unique id
    var linearGradientIn = defs.append("linearGradient").attr("id", "linear-gradient-in");
    var linearGradientOut = defs.append("linearGradient").attr("id", "linear-gradient-out");
    //Vertical gradient
    linearGradientIn.attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
    linearGradientOut.attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
    //Set the color for the start (0%)
    for (var i = 0; i <= 100; i++) {
      linearGradientIn.append("stop")
        .attr("offset", i+"%").attr("stop-color", d3.interpolateBuPu(1-i/100));
      linearGradientOut.append("stop")
        .attr("offset", i+"%").attr("stop-color", d3.interpolateGnBu(1-i/100));
    }
    //Draw the rectangle and fill with gradient
    legend1 = rootsvg.append("g")
    legend1.attr("transform", "translate("+(cellSize*19)+","+(margin.top)+")")
    legend1.append("rect")
        .attr("width", cellSize*0.5)
        .attr("height", cellSize*16)
        .style("fill", "url(#linear-gradient-in)");
    legend2 = rootsvg.append("g")
    legend2.attr("transform", "translate("+(cellSize*38)+","+(margin.top)+")")
    legend2.append("rect")
        .attr("width", cellSize*0.5)
        .attr("height", cellSize*16)
        .style("fill", "url(#linear-gradient-out)");
    // add axis
    legend1.append("g")
      .attr("transform", "translate(10,-10)")
      .attr("class", "y axis")
      .call(legendAxis)
    legend2.append("g")
      .attr("transform", "translate(10,-10)")
      .attr("class", "y axis")
      .call(legendAxis)

    ////////////////// Heading ///////////////////////////
    var heading = rootsvg.append("g").attr("transform", "translate(0,"+(margin.top-10)+")")
    heading.append("text")
        .attr("x", (cellSize * 4 ))
        .attr("class", 'headtitle in')
        .text("Flow In - Real")
    heading.append("text")
        .attr("x", (cellSize * 12.2 ))
        .attr("class", 'headtitle in')
        .text("Flow In - Prediction")
    heading.append("text")
        .attr("x", (cellSize * 23 ))
        .attr("class", 'headtitle out')
        .text("Flow Out - Real")
    heading.append("text")
        .attr("x", (cellSize * 30.8 ))
        .attr("class", 'headtitle out')
        .text("Flow Out - Prediction")
    ////////// clock////////////
    var clock = rootsvg.append("g")
        .attr("class", "clock")
        .attr("transform", "translate(" + (margin.left+cellSize*39.5) + "," + margin.top + ")");

    ////////// slider //////////
    var formatDateIntoYear = d3.timeFormat("%Y");
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
    // var formatDateLocal = d3.timeFormat("%m-%d %H");
    var formatDateLocal = d3.timeFormat("%m/%d");
    var parseDate = d3.timeParse("%m/%d/%y");
    var startDate = new Date('2014-09-21'),
    endDate = new Date('2014-10-01');
    var moving = false;
    var currentValue = 0;
    var targetValue = width-cellSize*9.5;
    var playButton = d3.append('g').
      selectAll("rect").append('rect').attr('id', 'play-button');
    var error = d3.select("#error");
    // playButton
    //   .style('top', cellSize*12 + 'px')
    //   .style('right', cellSize*3 + 'px');
    // error
    //   .style('width', cellSize*7 + 'px')
    //   .style('top', cellSize*14 + 'px')
    //   .style('right', cellSize*0.7 + 'px');

    var x = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, targetValue])
        .clamp(true);
    var x2d = d3.scaleLinear()
        .domain([x.range()[0], x.range()[1]])
        .range([0, data.length-1])
        .clamp(true);
    var slider = rootsvg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + (cellSize*22) + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
          .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
          .attr("class", "track-overlay")
          .call(d3.drag()
              .on("start", function() { slider.interrupt(); })
              .on("drag", function() {
                currentValue = d3.event.x;
                var currentFrame = parseInt(x2d(currentValue))
                // update position and text of label according to slider scale
                handle.attr("cx", x(x.invert(currentValue)));
                label.text(data[currentFrame]['t']);
                console.log("currentFrame",currentFrame)
                // update g1,2,3,4
                subdata = data[currentFrame];
                update(g1, subdata['in'][0], 'in');
                update(g2, subdata['in'][1], 'in');
                update(g3, subdata['out'][0], 'out');
                update(g4, subdata['out'][1], 'out');
                // update Clock
                updateClock(new Date(data[currentFrame]['t']));
                // updateClock(x.invert(currentValue));
                d3.select('#in_rmse').text(data[currentFrame]['in_rmse']);
                d3.select('#out_rmse').text(data[currentFrame]['out_rmse']);
              })
          );

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
          .data(x.ticks(11))
          .enter()
          .append("text")
          .attr("x", x)
          .attr("y", 10)
          .attr("text-anchor", "middle")
          .text(function(d) {
            return formatDateLocal(d);
          });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    var label = clock.append("text")
        .attr("class", "label")
        .style("fill", "#336")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", "translate("+cellSize*3.5+"," + cellSize*8 + ")")
        .text(data[initN]['t'])

    function update(g, data, type) {
        g.selectAll('rect')
          .remove();
        g.selectAll('rect')
          .data(data).enter()
          .append('rect')
          .attr('class', 'cell')
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('x', function (d, i) {
            return xScale(d[1]);
          })
          .attr('y', function (d, i) {
            return yScale(d[0]);
          })
          .attr('fill', function (d) {
            if (d[2] < 0){d[2] = 0}
            if (type == 'in') {
              return d3.interpolateBuPu(linear(d[2]));
            }else{
              return d3.interpolateGnBu(linear(d[2]));
            }
          })
          .on("mouseover", function (d) {
            d3.select(this).style('opacity', .5);
          })
          .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
            d3.select(this).style('opacity', 1);
            tooltip.style("visibility", "hidden");
          })
          .on("mousemove", function (d) {
            tooltip.style("visibility", "visible").style("top", (d3.event.pageY - 30) + "px").style("left", (d3.event.pageX + 20) + "px");
            tooltip.text("flow: " + d[2])
          });
    }

    playButton.on("click", function() {
        var button = d3.select(this);
        if (button.text() == "Pause") {
          moving = false;
          clearInterval(timer);
          // timer = 0;
          button.text("Play");
        } else {
          moving = true;
          timer = setInterval(step, 300);
          button.text("Pause");
        }
        console.log("Slider moving: " + moving);
    });
    function step() {
      // update position and text of label according to slider scale
      var currentFrame = parseInt(x2d(currentValue))
      handle.attr("cx", x(x.invert(currentValue)));
      label.text(data[currentFrame]['t']);
      // update g1,2,3,4
      subdata = data[currentFrame];
      update(g1, subdata['in'][0], 'in');
      update(g2, subdata['in'][1], 'in');
      update(g3, subdata['out'][0], 'out');
      update(g4, subdata['out'][1], 'out');
      updateClock(new Date(data[currentFrame]['t']));
      d3.select('#in_rmse').text(data[currentFrame]['in_rmse']);
      d3.select('#out_rmse').text(data[currentFrame]['out_rmse']);

      currentValue = currentValue + (targetValue/151);
      if (currentValue > targetValue) {
        moving = false;
        currentValue = 0;
        clearInterval(timer);
        // timer = 0;
        playButton.text("Play");
        console.log("Slider moving: " + moving);
      }
    }

    // clock
    showD3Clock(cellSize*7, clock);
    updateClock(new Date(data[initN]['t']));
    function updateClock(date) {
      // console.log(getTimeOfOneDay(date))
      // console.log(clock.select("line.hand"))
      clock.selectAll("line.hand")
        .data(getTimeOfOneDay(date))
        // .transition()
        // .ease(d3.easeElastic)
        .attr("transform", function(d){
          var cx = cellSize*7/2;
          var cy = cellSize*7/2;
          var angle;
          if (d[0] == "hour")
            angle = (d[1] % 12) * 30
          else
            angle = d[1] * 6
          return "rotate(" + angle + "," + cx + "," + cy + ")";
        });
    }

  });
}
