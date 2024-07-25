function createBarChart(sortedTags) {
    const margin = {top: 20, right: 20, bottom: 100, left: 40};
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Remove existing svg if present
    d3.select("#barChart").select("svg").remove();

    // Create the SVG container and set the origin
    const svg = d3.select("#barChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set the ranges
    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    const y = d3.scaleLinear()
        .range([height, 0]);

    // Scale the range of the data in the domains
    x.domain(sortedTags.slice(0, 25).map(d => d[0])); // Limit to top 25
    y.domain([0, d3.max(sortedTags.slice(0, 25), d => d[1])]); // Limit to top 25

    // Append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(sortedTags.slice(0, 25)) // Limit to top 25
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[0]))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d[1]))
        .attr("height", d => height - y(d[1]))
        .attr("fill", "steelblue");

    // Add the x Axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .attr("transform", "rotate(-60)")
        .style("text-anchor", "end");

    // Add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
}

