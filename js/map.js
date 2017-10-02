$(document).ready(function(){
  //Width and height of map
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var width;
  var height;

  if (windowWidth >=950) {
    var width = 960;
  } else {
    var width = windowWidth * (95/100);
  };

  if (windowHeight >=420) {
    var height = 500;
  } else {
    var height = windowHeight;
  };


  // D3 Projection
  var projection = d3.geo.albersUsa()
  				               .translate([windowWidth/2, windowHeight/2])// translate to center of screen
  				               .scale([windowWidth *(75/100)]);// scale things down so see entire US

  // Define path generator
  var path = d3.geo.path()// path generator that will convert GeoJSON to SVG paths
  		  	         .projection(projection);  // tell path generator to use albersUsa projection

  // Define linear scale for output
  var color = d3.scale.linear()
  			        .range(["rgb(217,198,182)","rgb(169,165,171)","rgb(196,148,140)"]);

  var legendText = ["States Lived", "States Visited", "Need to Visit"];

  //Create SVG element and append map to the SVG
  var svg = d3.select(".map")
  			      .append("svg")
  			      .attr("width", width)
  			      .attr("height", height);

  // Append Div for tooltip to SVG
  var div = d3.select(".map")
  		        .append("div")
      		    .attr("class", "tooltip")
      		    .style("opacity", 0);

  // Load in my states data!
  d3.csv("stateslived.csv", function(data) {
    color.domain([0,1,2]); // setting the range of the input data
    // Load GeoJSON data and merge with states data
    d3.json("us-states.json", function(json) {
      // Loop through each state data value in the .csv file
      for (var i = 0; i < data.length; i++) {
      	// Grab State Name
      	var dataState = data[i].state;
      	// Grab data value
      	var dataValue = data[i].visited;
      	// Find the corresponding state inside the GeoJSON
      	for (var j = 0; j < json.features.length; j++)  {
      		var jsonState = json.features[j].properties.NAME;

          if (dataState == jsonState) {
      		// Copy the data value into the JSON
      		json.features[j].properties.visited = dataValue;
      		// Stop looking through the JSON
      		break;
      		}
      	}
      }
    // // Bind the data to the SVG and create one path per GeoJSON feature
    svg.selectAll("path")
    	.data(json.features)
    	.enter()
    	.append("path")
    	.attr("d", path)
    	.style("stroke", "#fff")
    	.style("stroke-width", "1")
      .on("mouseover", function(json) {
      		var jsonState = json.properties.NAME;
        	div.transition()
          	 .duration(200)
             .style("opacity", .9);
             div.text(jsonState)
             .style("width", "100px")
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
  	})
    // fade out tooltip on mouse out
    .on("mouseout", function(json) {
        div.transition()
           .duration(500)
           .style("opacity", 0);
    })

    .style("fill", function(d) {
    	// Get data value
    	var value = d.properties.visited;

    	if (value) {
    	//If value exists…
    	return color(value);
    	} else {
    	//If value is undefined…
    	return "rgb(213,222,217)";
    	}
    });

    // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
    var legend = d3.select(".map").append("svg")
          		.attr("class", "legend")
         			.attr("width", 140)
        			.attr("height", 75)
              .style('position', 'absolute')
              .style('margin-top', '25%')
              // .style("top", function() {
              //   return window.innerHeight - 25 + "px";
              // })
              .style('left', function() {
                return window.innerWidth * 0.75 + "px";
              })
       				.selectAll("g")
       				.data(color.domain().slice().reverse())
       				.enter()
       				.append("g")
         			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      	legend.append("rect")
       		  .attr("width", 18)
       		  .attr("height", 18)
       		  .style("fill", color);

      	legend.append("text")
      		    .data(legendText)
          	  .attr("x", 24)
          	  .attr("y", 9)
          	  .attr("dy", ".35em")
          	  .text(function(d) { return d; });
  	});
  });
});
