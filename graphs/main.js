const width = 960;
const height = 500;
const margin = 5;
const padding = 5;
const adj = 30;

const parseDate = d3.timeParse("%Y-%m-%d")


d3.csv("formattedTweets.csv", d => {
    if (d.favorites !== "0" && d.retweets !== "0") {
        return {
            date: parseDate(d.date),
            controversiality: d.controversiality,
            // tweet: d.text
        };
    }
}).then(data => {
    //console.log(data);
    const tweets = data
    console.log(tweets)


    // SVG PART



    // Scales
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().rangeRound([height, 0]);
    const line = d3.line()
        .x(function (d) { return xScale(d.date); })
        .y(function (d) { return yScale(d.controversiality); });

    xScale.domain(d3.extent(tweets, function (d) {
        return d.date
    }));

    yScale.domain([(0), d3.max(tweets, function (d) {
        return d.controversiality + 4;

    })
    ]);

    const yaxis = d3.axisLeft()
        .ticks(tweets.length)
        .scale(yScale);

    const xaxis = d3.axisBottom()
        .ticks(d3.timeDay.every(1))
        .tickFormat(d3.timeFormat('%b %d'))
        .scale(xScale);

    // we are appending SVG first
    const svg = d3.select("div#container").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "-"
            + adj + " -"
            + adj + " "
            + (width + adj * 3) + " "
            + (height + adj * 3))
        .style("padding", padding)
        .style("margin", margin)
        .classed("svg-content", true);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis);

    svg.append("g")
        .attr("class", "axis")
        .call(yaxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", ".75em")
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Frequency");

    const lines = svg.selectAll("lines")
        .data(tweets)
        .enter()
        .append("g");

    lines.append("path")
        .attr("d", function (d) { return line(d.controversiality); });


});
