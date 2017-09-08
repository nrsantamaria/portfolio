$(document).ready(function(){
  var width = 960,
    height = 500;

  var fill = d3.scale.log()
    .domain([10, 500])
    .range(["brown", "steelblue"]);

  var path = d3.geo.path();

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.json("us.json", function(error, us) {
    svg.append("g")
        .attr("class", "counties")
      .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
      .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) { return fill(path.area(d)); });

    svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }))
      .attr("class", "states")
      .attr("d", path);
  });

  function clicked(d) {
    var x, y, k;

    if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
    } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
    }

    g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

    g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
  }
});
