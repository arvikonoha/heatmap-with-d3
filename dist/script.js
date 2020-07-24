document.addEventListener("DOMContentLoaded", async event => {
  let info = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json");
  let data = await info.json();
  console.log(data);

  let plt = data.monthlyVariance;
  let base = data.baseTemperature;

  let w = 1280;
  let h = 420;
  let padding = 64;

  let svg = d3.select("#svgc").
  append("svg").
  attr("width", w).
  attr("height", h);

  let range = d3.max(plt, d => d.year) - d3.min(plt, d => d.year);

  let xScale = d3.scaleLinear().
  domain([d3.min(plt, d => d.year), d3.max(plt, d => d.year)]).
  range([padding, w - padding]);

  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let yScale = d3.scaleBand().
  domain(months).
  range([0, h - padding]);

  let tooltip = d3.select("#tooltip");
  let time = d3.select("#tooltip .time");
  let temp = d3.select("#tooltip .temp");
  let variation = d3.select("#tooltip .variation");

  svg.selectAll("rect").
  data(plt).
  enter().
  append("rect").
  attr("x", d => xScale(d.year)).
  attr("y", d => yScale(months[d.month - 1])).
  attr("width", w / range).
  attr("class", "cell").
  attr("data-month", d => d.month - 1).
  attr("data-year", d => d.year).
  attr("data-temp", d => base + d.variance).
  attr("fill", d => {
    let temp = base + d.variance;
    if (temp < 2.8)
    return "#313695";else
    if (temp < 3.9)
    return "#4575b4";else
    if (temp < 5.0)
    return "#74add1";else
    if (temp < 6.1)
    return "#abd9e9";else
    if (temp < 7.2)
    return "#e0f3f8";else
    if (temp < 8.3)
    return "#ffffbf";else
    if (temp < 9.5)
    return "#fee090";else
    if (temp < 10.6)
    return "#fdae61";else
    if (temp < 11.7)
    return "#f46d43";else
    if (temp < 12.8)
    return "#d73027";else

    return "#a50026";
  }).
  attr("height", h / 13).
  on("mouseover", d => {

    tooltip.transition().
    duration(300).
    style("opacity", 1);

    tooltip.style("top", d3.event.pageY - 72 + "px").
    style("left", d3.event.pageX - 64 + "px").
    attr("data-year", d.year);

    time.html(d.year + " " + months[d.month - 1]);
    temp.html((base + d.variance).toFixed(2) + "C, ");
    variation.html(d.variance.toFixed(2) + "C");

  }).on("mouseout", d => {
    tooltip.transition().
    duration(300).
    style("opacity", 0);
  });

  let fillers = ["#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8", "#ffffbf", "#fee090", "#fdae61", "#f46d43", "#d73027", "#a50026"];

  let xAxis = d3.axisBottom(xScale).ticks(range / 10, d3.format("d"));

  let yAxis = d3.axisLeft(yScale);

  let temps = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];

  let legendScale = d3.scaleBand().domain(temps).range([0, 320]);

  let legendAxis = d3.axisBottom(legendScale);

  let legend = d3.select("#legend");

  legend.selectAll("rect").
  data(fillers).
  enter().
  append("rect").
  attr("width", 32 + "px").
  attr("height", 32 + "px").
  attr("x", (d, i) => i * 32).
  attr("fill", d => d);

  legend.append("g").
  attr("transform", `translate(16,32)`).
  call(legendAxis);

  svg.append("g").
  attr("transform", `translate(${padding},0)`).
  call(yAxis).
  attr("id", "y-axis");

  svg.append("g").
  attr("transform", `translate(0,${h - padding + 2})`).
  call(xAxis).
  attr("id", "x-axis");

});