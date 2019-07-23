var toolTip = d3.select("#tiles").append("div")
    .attr("class", "d3-tip")
    .style("opacity", 0);
var tileMargin = {top: 10, right: 10, bottom: 10, left: 10};

var tileWidth = 960 - tileMargin.left - tileMargin.right,
    tileHeight = 600 - tileMargin.top - tileMargin.bottom;

var tileSvg = d3.select("#tiles").append("svg")
    .attr("width", tileWidth + tileMargin.left + tileMargin.right)
    .attr("height", tileHeight + tileMargin.top + tileMargin.bottom);

var tileChart = tileSvg.append("g").attr("id", "tileChart");
var tileTooltip = tileSvg.append("g");
var legendSvg = d3.select("#legend").append("svg")
    .attr("width", tileWidth + tileMargin.left + tileMargin.right)
    .attr("height", 100);

var xLegand = d3.scaleBand()
.domain(d3.range(12))
.range([0,tileWidth - 200]);

var xTile = d3.scaleBand()
            .domain(d3.range(12))
            .range([0,tileWidth]);

var yTile = d3.scaleBand()
            .domain(d3.range(8))
            .range([0,tileHeight]);


// console.log(xTile.bandwidth());
// console.log(yTile.bandwidth());
function TileChart() {
    this.type = "tileChart";

    posMap = new Map();
    posMap.set("AK", [0,0]);
    posMap.set("ME", [0,11]);
    posMap.set("VT", [1,10]);
    posMap.set("NH", [1,11]);
    posMap.set("WA", [2,1]);
    posMap.set("ID", [2,2]);
    posMap.set("MT", [2,3]);
    posMap.set("ND", [2,4]);
    posMap.set("MN", [2,5]);
    posMap.set("IL", [2,6]);
    posMap.set("WI", [2,7]);
    posMap.set("MI", [2,8]);
    posMap.set("NY", [2,9]);
    posMap.set("RI", [2,10]);
    posMap.set("MA", [2,11]);
    posMap.set("OR", [3,1]);
    posMap.set("NV", [3,2]);
    posMap.set("WY", [3,3]);
    posMap.set("SD", [3,4]);
    posMap.set("IA", [3,5]);
    posMap.set("IN", [3,6]);
    posMap.set("OH", [3,7]);
    posMap.set("PA", [3,8]);
    posMap.set("NJ", [3,9]);
    posMap.set("CT", [3,10]);
    posMap.set("CA", [4,1]);
    posMap.set("UT", [4,2]);
    posMap.set("CO", [4,3]);
    posMap.set("NE", [4,4]);
    posMap.set("MO", [4,5]);
    posMap.set("KY", [4,6]);
    posMap.set("WV", [4,7]);
    posMap.set("VA", [4,8]);
    posMap.set("MD", [4,9]);
    posMap.set("DC", [4,10]);
    posMap.set("AZ", [5,2]);
    posMap.set("NM", [5,3]);
    posMap.set("KS", [5,4]);
    posMap.set("AR", [5,5]);
    posMap.set("TN", [5,6]);
    posMap.set("NC", [5,7]);
    posMap.set("SC", [5,8]);
    posMap.set("DE", [5,9]);
    posMap.set("OK", [6,4]);
    posMap.set("LA", [6,5]);
    posMap.set("MS", [6,6]);
    posMap.set("AL", [6,7]);
    posMap.set("GA", [6,8]);
    posMap.set("HI", [7,1]);
    posMap.set("TX", [7,4]);
    posMap.set("FL", [7,9]);
    




    this.update = function() {

        //initial tool tip
        

        
        //get legand

        legendSvg.selectAll(".bar").data(d3.range(12))
            .enter().append("rect")
            .attr("fill", function(d, index) {return colorScale(index - 6);})
            .attr("stroke", "white")
            .attr("class", "bar")
            .attr("x", function(d, index) { return index * xLegand.bandwidth() + 100})
            .attr("y", 10)
            .attr("width", xLegand.bandwidth())
            .attr("height", 10);
        legendSvg.selectAll("text").data(d3.range(12))
            .enter().append("text")
            .attr("class", "legandNote")
            .attr("x", function(d, index) { return (index + 0.5) * xLegand.bandwidth() + 100})
            .attr("y", 30)
            .text(function (d, index) {
                str = (index - 6) * 10.0 + " to " + (index - 5) * 10.0;
                return str;
            })
        

        
        //get tiles
        var tileBar = tileChart.selectAll(".bar").data(oneYearData);
        tileBar.enter().append("rect")
            .attr("class", "bar")
            .attr("fill", function(d) {
                if(d.Win == "I") {
                    return "#45AD6A";
                }
                if(Math.floor((d.R_Percentage - d.D_Percentage) / 10) > 5) {
                    return colorScale(5);
                } 
                if(Math.floor((d.R_Percentage - d.D_Percentage) / 10) < -6){
                    return colorScale(-6);
                } 
                return colorScale(Math.floor((d.R_Percentage - d.D_Percentage) / 10));           
            })
            .attr("stroke", function(d) {
                if(highlight.includes(d.State)){
                    return "black";
                } else {
                    return "white";
                }
            })
            .attr("stroke-width", "4px")
            .attr("x", function(d) {
                return posMap.get(d.Abbreviation)[1] * xTile.bandwidth();
            })
            .attr("y", function(d){
                return posMap.get(d.Abbreviation)[0] * yTile.bandwidth();
            })
            .attr("width", xTile.bandwidth() - 3)
            .attr("height", yTile.bandwidth() - 3)
            .on("mouseover",handleMouseOver)
            .on("mouseout", handleMouseOut);
        
        tileBar
            .attr("fill", function(d) {
                if(d.Win == "I") {
                    return "#45AD6A";
                }
                if(Math.floor((d.R_Percentage - d.D_Percentage) / 10) > 5) {
                    return colorScale(5);
                } 
                if(Math.floor((d.R_Percentage - d.D_Percentage) / 10) < -6){
                    return colorScale(-6);
                } 
                return colorScale(Math.floor((d.R_Percentage - d.D_Percentage) / 10));       
            })
            .attr("stroke", function(d) {
                if(highlight.includes(d.State)){
                    return "black";
                } else {
                    return "white";
                }
            })
            .attr("stroke-width", "4px")
            .attr("x", function(d) {
                return posMap.get(d.Abbreviation)[1] * xTile.bandwidth();
            })
            .attr("y", function(d){
                return posMap.get(d.Abbreviation)[0] * yTile.bandwidth();
            })
            .attr("width", xTile.bandwidth() - 3)
            .attr("height", yTile.bandwidth() - 3);
        
        tileBar.exit().remove();



        var tileAbText = tileChart.selectAll(".tilestext").data(oneYearData);
        tileAbText.enter()
            .append("text")
            .attr("x", function(d) {
                return posMap.get(d.Abbreviation)[1] * xTile.bandwidth() + .5 * xTile.bandwidth();
            })
            .attr("y", function(d){
                return posMap.get(d.Abbreviation)[0] * yTile.bandwidth() + .4 * yTile.bandwidth();
            })
            .attr("class", "tilestext")
            .text(function(d) {
                return d.Abbreviation;
            })
            .on("mouseover",handleMouseOver)
            .on("mouseout", handleMouseOut);
        
        tileAbText.attr("x", function(d) {
                return posMap.get(d.Abbreviation)[1] * xTile.bandwidth() + .5 * xTile.bandwidth();
            })
            .attr("y", function(d){
                return posMap.get(d.Abbreviation)[0] * yTile.bandwidth() + .4 * yTile.bandwidth();
            })
            .attr("class", "tilestext")
            .text(function(d) {
                return d.Abbreviation;
            });
        tileAbText.exit().remove();

        var tileVoteText = tileChart.selectAll(".brushtext").data(oneYearData);
        tileVoteText.enter()
            .append("text")
            .attr("x", function(d) {
                return posMap.get(d.Abbreviation)[1] * xTile.bandwidth() + .5 * xTile.bandwidth();
            })
            .attr("y", function(d){
                return posMap.get(d.Abbreviation)[0] * yTile.bandwidth() + .7 * yTile.bandwidth();
            })
            .attr("class", "brushtext")
            .text(function(d) {
                return d.Total_EV;
            })
            .on("mouseover",handleMouseOver)
            .on("mouseout", handleMouseOut);
        
        tileVoteText.attr("x", function(d) {
                return posMap.get(d.Abbreviation)[1] * xTile.bandwidth() + .5 * xTile.bandwidth();
            })
            .attr("y", function(d){
                return posMap.get(d.Abbreviation)[0] * yTile.bandwidth() + .7 * yTile.bandwidth();
            })
            .attr("class", "brushtext")
            .text(function(d) {
                return d.Total_EV;
            });
        tileVoteText.exit().remove();

    }

    function handleMouseOver(d) {
        // console.log(d);
        var left = posMap.get(d.Abbreviation)[1] * xTile.bandwidth() + xTile.bandwidth() + "px";
        var top = (500 + posMap.get(d.Abbreviation)[0] * yTile.bandwidth() + yTile.bandwidth()) + "px";
        // var state = toolTip.append("p")
        //         //.attr("fill", colorScale(Math.floor((d.R_Percentage - d.D_Percentage) / 10)))
        //         .html();
        // var eleVote = toolTip.append("p")
        //         .attr("class", "tooltip-title")
        //         .html("Electoral Votes: " + d.Total_EV);
        //var ul = toolTip.append("ul");
        var dinfo = d.D_Nominee + ": " + d.D_Votes + "(" + d.D_Percentage + "%)";
        // var dLi = ul.append("li").attr("font-color", "3182bd").html(dinfo);
        var rinfo = d.R_Nominee + ": " + d.R_Votes + "(" + d.R_Percentage + "%)";
        // var rLi = ul.append("li").attr("font-color", "#de2d26").html(rinfo);
        var iinfo = d.I_Nominee + ": " + d.I_Votes + "(" + d.I_Percentage + "%)";
        // var iLi = ul.append("li").attr("font-color", "#45AD6A").html(iinfo);
        var totalInfo;
        if(d.I_Nominee != "") {
            totalInfo = [d.State, "Electoral Votes: " + d.Total_EV, dinfo, rinfo,iinfo ];
        } else {
            totalInfo = [d.State, "Electoral Votes: " + d.Total_EV, dinfo, rinfo ];
        }
        // console.log(left);
        //console.log(totalInfo);
        toolTip.transition()
            .duration(200)
            .style("opacity", .9)
            .style("left",left)
            .style("top", top); 
            
            
        toolTip.selectAll("span")
        .data(totalInfo)
        .enter()
        .append("span")
        .text(function(da) {
            return da;
        })
        .style("color", function(da,i) {
            switch(i) {
                case 0:
                    return colorScale(Math.floor((d.R_Percentage - d.D_Percentage) / 10));    
                case 1: 
                    return "black";
                case 2:
                    return "#3182bd";
                case 3: 
                    return "#de2d26";
                case 4:
                    return "#45AD6A";
            }
        })
        .style("size", function(da, i) {
            switch(i) {
                case 0:
                    return "20px"
                case 1: 
                    return "10px";
                case 2:
                    return "10px";
                case 3: 
                    return "10px";
                case 4:
                    return "10px";
            }
        })
        .append("br");

        toolTip.selectAll("span").data(totalInfo)
        .text(function(da) {
            return da;
        })
        .style("color", function(da,i) {
            switch(i) {
                case 0:
                    return colorScale(Math.floor((d.R_Percentage - d.D_Percentage) / 10));    
                case 1: 
                    return "black";
                case 2:
                    return "#3182bd";
                case 3: 
                    return "#de2d26";
                case 4:
                    return "#45AD6A";
            }
        })
        .append("br");

        toolTip.selectAll("span").data(totalInfo).exit().remove();
    }

    function handleMouseOut(d) {
        toolTip.transition()
        .duration(500)
        .style("opacity", 0);
    }




}