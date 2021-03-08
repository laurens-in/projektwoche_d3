let height = 300
let width = 800

margin = ({ top: 20, right: 30, bottom: 30, left: 40 })
var parseTime = d3.timeParse("%Y-%m-%d")






d3.csv("formattedTweets.csv", d => {
    return {
        date: parseTime(d.date),
        controversiality: +d.controversiality,
        tweet: d.text
    };

}).then(data => {
    data.sort(function (a, b) { return a.date - b.date; })
    data.y = "Controversiality"
    console.log(data)


    //X Axis
    let xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    //Y Axis
    let yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y))

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.controversiality)]).nice()
        .range([height - margin.bottom, margin.top])

    let x = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right])

    let line = d3.line()
        .defined(d => !isNaN(d.controversiality))
        .x(d => x(d.date))
        .y(d => y(d.controversiality))


    // Callout
    callout = (g, value) => {
        if (!value) return g.style("display", "none");

        g
            .style("display", null)
            .style("pointer-events", "none")
            .style("font", "10px sans-serif");

        const path = g.selectAll("path")
            .data([null])
            .join("path")
            .attr("fill", "#37516f")
            .attr("stroke", "#37516f")


        const text = g.selectAll("text")
            .data([null])
            .join("text")
            .call(text => text
                .selectAll("tspan")
                .data((value + "").split(/\n/))
                .join("tspan")
                .attr("x", 0)
                .attr("y", (d, i) => `${i * 1.1}em`)
                .style("font-weight", (_, i) => i ? null : "bold")
                .style("font-size", "6px")
                .style("fill", "#facd00")
                .text(d => d));

        const { x, y, width: w, height: h } = text.node().getBBox();

        text.attr("transform", `translate(${-w / 2},${15 - y})`);
        path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
    }

    // some weird shit don't ask me

    // const bisectD = d3.bisector(d => d.date).left;
    // const bisect = mx => {
    //     const date = x.invert(mx);
    //     const index = bisectD(data, date, 1);
    //     const a = data[index - 1];
    //     const b = data[index];
    //     return b && (date - a.date > b.date - date) ? b : a;
    // };
    const getIndex = d3.bisector(d => d.date)
    let bisect = (mx) => {
        const date = x.invert(mx);
        const index = getIndex.left(data, date, 1);
        const a = data[index - 1];
        const b = data[index];
        return b && (date - a.date > b.date - date) ? b : a;
    };



    //SVG Render
    let svg = d3.select("#container")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("overflow", "visible")


    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#37516f")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

    // Add tooltip
    const tooltip = svg.append("g");
    svg.on("touchmove mousemove", function (event) {
        const { date, controversiality, tweet } = bisect(d3.pointer(event, this)[0]);
        console.log(d3.pointer(event, this)[0])

        tooltip
            .attr("transform", `translate(${x(date)},${y(controversiality)})`)
            .call(callout, `${tweet}
    ${parseInt(controversiality)}`);
    });

    svg.on("touchend mouseleave", () => tooltip.call(callout, null));
})