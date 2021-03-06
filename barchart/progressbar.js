// Dummy value
let CURRENT_VALUE = 75;

const barHeight = 20,
  tooltip = { width: 40, height: 25 },
  margin = { left: 130, right: 20 },
  width = 500 - margin.left - margin.right,
  height = barHeight + tooltip.height + 20;

const x = d3.scaleLinear().range([0, width]).domain([0, 100]);

// Append SVG to body
const svg = d3.select("body").append("svg");

// Append text label with `Progress` text
const textLabel = svg
  .append("text")
  .attr("x", margin.left)
  .attr("y", tooltip.height + barHeight / 2 + 10)
  .attr("dx", "-1rem")
  .attr("dy", "0.5rem")
  .attr("class", "text-label")
  .text("Progress");

// Append group for progress bar
const g = svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height)
  .append("g")
  .attr(
    "transform",
    `translate(${margin.left},${tooltip.height})`
  );

// Generate linear gradient
const grad = g.append("defs").append("linearGradient").attr("id", "grad");

grad
  .selectAll("stop")
  .data([1, 2, 3, 4])
  .enter()
  .append("stop")
  .style("stop-color", (d, i) => d3.interpolateRdYlGn(i / (4 - 1)))
  .attr("offset", (d, i) => 100 * (i / (4 - 1)) + "%");

// Append gray rect in background
g.append("rect")
  .attr("width", width)
  .attr("height", barHeight)
  .attr("y", 10)
  .attr("rx", 10)
  .attr("ry", 10)
  .style("fill", "#dadde2");

// Append clipping path
g.append("clipPath")
  .attr("id", "ellipse-clip")
  .append("rect")
  .attr("width", x(CURRENT_VALUE))
  .attr("height", barHeight)
  .attr("y", 10)
  .attr("rx", 10)
  .attr("ry", 10)
  .style("fill", "url(#grad)");

// Append main rect with gradient fill
g.append("rect")
  .attr("width", width)
  .attr("height", barHeight)
  .attr("y", 10)
  .attr("rx", 10)
  .attr("ry", 10)
  .attr("clip-path", "url(#ellipse-clip)")
  .style("fill", "url(#grad)");

// Append Axis with ticks
g.append("g")
  .attr("transform", `translate(0,${barHeight + 20})`)
  .call(
    d3
      .axisBottom(x)
      .tickValues([25, 50, 75])
      .tickSizeInner(-barHeight - 20)
      .tickSizeOuter(0)
      .tickPadding(0)
  );

// Append tooltip
const tip = svg
  .append("g")
  .attr(
    "transform",
    `translate(${margin.left + x(CURRENT_VALUE) - tooltip.width / 2}, 5)`
  );

tip
  .append("rect")
  .attr("width", tooltip.width)
  .attr("rx", 5)
  .attr("ry", 5)
  .style("fill", "#333")
  .attr("height", tooltip.height);

// Append small triangle to the tooltip
tip
  .append("path")
  .attr(
    "d",
    `M${tooltip.width / 2 - 5},${tooltip.height} L${tooltip.width / 2},${tooltip.height + 5} L${tooltip.width / 2 + 5},${tooltip.height} z`
  )
  .attr("class", "arrow");

tip
  .append("text")
  .attr("x", tooltip.width / 2)
  .attr("y", 0)
  .attr("dy", "1rem")
  .attr("class", "value-label")
  .text(`${CURRENT_VALUE}%`);