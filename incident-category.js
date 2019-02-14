var mymap = d3.map();

d3.csv("./data/Police_Department_Incident_Reports__2018_to_Present.csv", myFunction).then(function (d) {
    drawIncidentChart();
});


var drawIncidentChart = function() {
    console.log("Hello");
    let svg = d3.select("body").select("svg#vis1");
    let mapArray = mymap.entries().sort((a,b) =>  a.value - b.value);
    let mapArraySize = mapArray.length;

    mapArray = mapArray.slice(mapArraySize-10,mapArraySize);
    let updatedMap = d3.map();


    mapArray.forEach(function (key,value) {
        updatedMap.set(key.key,key.value);

    });

    // get the data to visualize
    let count = updatedMap;

    // get the svg to draw on




    let countMin = 0; // always include 0 in a bar chart!
    let countMax = d3.max(count.values());
    let mean = d3.mean(count.values());


   //
    if (isNaN(countMax)) {
        countMax = 0;
    }

    let margin = {
        top:    60,
        right:  170, // leave space for y-axis
        bottom: 120, // leave space for x-axis
        left:   150
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

    countScale.color = d3.scaleSequential(d3.interpolateReds    );
    countScale.color.domain([countMin, mean, countMax]);


    let categoryScale = d3.scaleBand()
        .domain(updatedMap.keys()) // all letters (not using the count here)
        .rangeRound([0, plotHeight])
        .paddingInner(0.2); // space between bars


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
    var colorMap = createColorMap();

    svg.append("text")
        .style("font-size", "12")
        .style("font-weight", "bold")
        .attr("y", 100)
        .attr("x", plotWidth)
        .style("text-anchor", "start")
        .text("Color pallet");

    var y = 100;
    for (key in colorMap.keys() ){
        svg.append("text")
            .style("font-size", "12")
            .attr("y", y += 20)
            .attr("x", plotWidth)
            .style("text-anchor", "start")
            .text(colorMap.keys()[key]);
    }

    y = 90;
    for (key in colorMap.values() ){
        svg.append("rect")
            .attr("y", y += 20)
            .attr("x", plotWidth)
            .attr("width", 15)
            .attr("height", 15)
            .style("fill",colorMap.values()[key])

    }

    svg.append("text")
        .style("font-size", "14")
        .attr("y", 550)
        .attr("x", 10)
        .style("text-anchor", "start")
        .style("fill", "#888888")
        .text("Created by: Gudbrand Schistad");

    svg.append("text")
        .style("font-size", "14")
        .attr("y", 570)
        .attr("x", 10)
        .style("text-anchor", "start")
        .style("fill", "#888888")
        .text("Description: Count of each Incident Category, where x-axis displays Incident Category  and y axis displays the number of incident recorded for each category. The view is filtered on Incident Category");

    svg.append("text")
        .style("font-size", "14")
        .attr("y", 585)
        .attr("x", 10)
        .style("text-anchor", "start")
        .style("fill", "#888888")
        .text("count, which keeps 10 of 47 members.");



    plot.append("g")
        .call(gridlines)
        .attr("color", "#dadada")
        .attr("transform", "translate(0,420)");

    svg.append("text")
    // .attr("id", "graph-title")
        .style("font-size", "25")
        .attr("y", margin.top/2)
        .attr("x", 10)
        .style("text-anchor", "start")
        .text("Number of Incidents reports per top 10 incident categories");

    plot.append("text")
    // .attr("id", "x-axis-title")
        .style("font-size", "14")
        .style("font-weight","bold")
        .attr("transform",
            "translate(" + (plotWidth/2) + " ,"
            + (plotHeight + 40) + ")")
        .style("text-anchor", "middle")
        .text("Count of Incident Category");

    plot.append("text")
    // .attr("id", "y-axis-title")
        .style("font-size", "14")
        .style("font-weight","bold")
        .attr("transform", "rotate(0)")
        .attr("y", "-10")
        .attr("x", "-75")
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Incident Category");

    let bars = plot.selectAll("rect")
        .data(count.entries(), function(d) { return d.key; });

    bars.enter().append("rect")
    // we will style using css
        .attr("class", "bar")
        // the width of our bar is determined by our band scale
        .attr("width", function (d) {return countScale(d.value)})
        // we must now map our letter to an x pixel position
        .attr("x", 0)
        // and do something similar for our y pixel position
        .attr("y", function(d) {
            return categoryScale(d.key) +6 ;
        })
        // here it gets weird again, how do we set the bar height?
        .attr("height", function(d) {
            return 30;
        }).style("fill", function(d) { return countScale.color(d.value);
        }).style("stroke", function(d) { return countScale.color(d.value); });


};



function myFunction(row) {

        let category = row["Incident Category"];
        if(mymap.has(category)){
            mymap.set(category, mymap.get(category) + 1)
        } else {
            mymap.set(category, 1)
        }

    return mymap;
}

function createColorMap() {
    var colorMap =  d3.map();
    colorMap.set("count < 400","#FA795B");
    colorMap.set("400 < count < 650","#F6503A");
    colorMap.set("650 < count < 800","#C7061A");
    colorMap.set("800 < count < 4000","#53000C");
    colorMap.set("count > 4000","#53000C");

    return colorMap;
}



