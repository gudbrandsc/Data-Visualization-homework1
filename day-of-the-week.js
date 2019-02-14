var dayMap = d3.map();
d3.csv("./data/Police_Department_Incident_Reports__2018_to_Present.csv", myFunction).then(function (d) {
    drawCategoryChart();
});


var drawCategoryChart = function() {
    let svg = d3.select("body").select("svg#vis3");

    let mapArray = dayMap.entries().sort((a,b) =>  a.value - b.value);
    let mapArraySize = mapArray.length;
    let updatedMap = d3.map();


    mapArray.forEach(function (key,value) {
        updatedMap.set(key.key,key.value);

    });

    // get the data to visualize





    // get the data to visualize
    let countMin = 0; // always include 0 in a bar chart!
    let countMax = d3.max(updatedMap.values());
    let mean = d3.mean(updatedMap.values());


    //
    if (isNaN(countMax)) {
        countMax = 0;
    }

    let margin = {
        top:    50,
        right:  30, // leave space for y-axis
        bottom: 100, // leave space for x-axis
        left:   160
    };


    // now we can calculate how much space we have to plot
    let bounds = svg.node().getBoundingClientRect();
    let plotWidth = bounds.width - margin.right - margin.left;
    let plotHeight = bounds.height - margin.top - margin.bottom;

    let countScale = d3.scaleLinear()
        .domain([countMin, countMax])
        .range([0, plotWidth])
        .nice();
    // rounds the domain a bit for nicer output



    let categoryScale = d3.scaleBand()
        .domain(updatedMap.keys()) // all letters (not using the count here)
        .rangeRound([0, plotHeight])
        .paddingInner(0.1); // space between bars


    let plot = svg.select("g#plot");

    if (plot.size() < 1) {
        plot = svg.append("g").attr("id", "plot");

        plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }

    let yAxis = d3.axisLeft(categoryScale);

    let xAxis = d3.axisBottom(countScale);

    if (plot.select("g#y-axis").size() < 1) {
        let xGroup = plot.append("g").attr("id", "x-axis");

        // the drawing is triggered by call()
        xGroup.call(xAxis);

        xGroup.attr("transform", "translate(0," + plotHeight + ")");

        let yGroup = plot.append("g").attr("id", "y-axis");
        yGroup.call(yAxis);
        yGroup.attr("transform", "translate(" + "0" + ",0)");
    }

    else {

        plot.select("g#y-axis").call(yAxis);
    }
    var gridlines = d3.axisBottom(countScale)
        .tickFormat("")
        .tickSize(-plotHeight);

    plot.append("g")
        .call(gridlines)
        .attr("color", "#dadada")
        .attr("transform", "translate(0,430)");

    svg.append("text")
        .style("font-size", "14")
        .attr("y", 570)
        .attr("x", 10)
        .style("text-anchor", "start")
        .style("fill", "#888888")
        .text("Created by: Gudbrand Schistad");

    svg.append("text")
        .style("font-size", "14")
        .attr("y", 590)
        .attr("x", 10)
        .style("text-anchor", "start")
        .style("fill", "#888888")
        .text("Description: Graph that displays the total number of Larceny Theft that was recorded for each day of the week in 2018. ");

    svg.append("text")
    // .attr("id", "graph-title")
        .style("font-size", "25")
        .attr("y", margin.top/2)
        .attr("x", 10)
        .style("text-anchor", "start")
        .text("Total number of \"Larceny Theft\" reports for each day of the week in 2018");

    plot.append("text")
    // .attr("id", "x-axis-title")
        .style("font-size", "14")
        .style("font-weight","bold")
        .attr("transform",
            "translate(" + (plotWidth/2) + " ,"
            + (plotHeight + 40) + ")")
        .style("text-anchor", "middle")
        .text("Number of Reports");

    plot.append("text")
    // .attr("id", "y-axis-title")
        .style("font-size", "14")
        .style("font-weight","bold")
        .attr("transform", "rotate(0)")
        .attr("y", "-10")
        .attr("x", "-75")
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Incident Day of Week");

    let bars = plot.selectAll("rect")
        .data(updatedMap.entries(), function(d) { return d.key; });

    bars.enter().append("rect")
    // we will style using css
        .attr("class", "bar")
        // the width of our bar is determined by our band scale
        .attr("width", function (d) {return countScale(d.value)})
        // we must now map our letter to an x pixel position
        .attr("x", 0)
        // and do something similar for our y pixel position
        .attr("y", function(d) {
            return categoryScale(d.key) + 6 ;
        })
        // here it gets weird again, how do we set the bar height?
        .attr("height", function(d) {
            return 50   ;
        });


};



function myFunction(row) {

    let category = row["Incident Category"];
    var day = row["Incident Day of Week"];
    if (category == "Larceny Theft") {
        if (dayMap.has(day)) {
            dayMap.set(day, dayMap.get(day) + 1);
        }
        else {
            dayMap.set(day, 1);
        }
    }
    return dayMap;
}
