d3.csv("tweets.csv", d => {
    if (d.favorites !== "0" && d.retweets !== "0") {
        return {
            date: d.date,
            controversiality: getCon(d.favorites, d.retweets),
            model: d.Model,
            tweet: d.text
        };
    }
}).then(data => {
    //console.log(data);
    const tweets = data
    console.log(tweets)
});



const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);

svg.append("g")
    .call(xAxis);

svg.append("g")
    .call(yAxis);

svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);