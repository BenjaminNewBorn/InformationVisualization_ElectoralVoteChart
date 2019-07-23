
var previousYear;
var previousData;
var shiftMargin = {top: 10, right: 10, bottom: 10, left: 10};
var stateul = d3.select("#stateList").append("ul");

var shiftHeight = 120;
var shiftWidth = 350;
var shiftPadding = 0;

function ShiftChart() {
    this.type = "shiftChart";
    this.update = function(){

        var s = d3.scaleLinear().domain([0, 100]).range([0,shiftHeight]);
        
        if(chosedYear > 1940) {
            previousYear = chosedYear - 4;
            preFileName = "data/election-results-" + previousYear + ".csv";
            d3.csv(preFileName, function(fileData) {
                var shiftData = highlightD.map(function(d){
                    return {
                        State:d.State,
                        R_Percentage1: +d.R_Percentage,
                        D_Percentage1: +d.D_Percentage,
                        I_Percentage1: +d.I_Percentage,
                        R_Percentage0: 0,
                        D_Percentage0: 0,
                        I_Percentage0: 0
                    }
                })
                shiftData.forEach(function(d){
                    fileData.forEach(function (da){
                        if(d.State == da.State){
                            d.R_Percentage0 = +da.R_Percentage;
                            d.I_Percentage0 = +da.I_Percentage;
                            d.D_Percentage0 = +da.D_Percentage;
                        }
                    })
                })
                // console.log(shiftData);
                d3.select("#stateList").select("svg").remove();
                stateul.selectAll("li").remove();
                var shiftSvg = d3.select("#stateList").append("svg");
                shiftSvg
                    .attr("width", shiftWidth)
                    .attr("height", shiftData.length * 200 + shiftPadding)
                
                shiftData.forEach(function(d, i){
                    var IPoints =[
                        [20,shiftPadding + 200 * i],
                        [100,shiftPadding + 200 * i],
                        [100,shiftPadding + s(d.I_Percentage1) + 200 * i],
                        [20,shiftPadding + s(d.I_Percentage0) + 200 * i],
                        [20,shiftPadding + 200 * i]  
                    ]
                    var iPath = lineGenerator
                            .x(function(d) {return d[0];})
                            .y(function(d) {return d[1];}); 
                    shiftSvg.append("path")
                            .attr("d", iPath(IPoints))
                            .attr("stroke", "white")
                            .attr("stroke-width", 1)
                            .attr("fill", "#45AD6A");


                    var dPoints =[
                        [20,shiftPadding + s(d.I_Percentage0) + 200 * i],
                        [100,shiftPadding + s(d.I_Percentage1) + 200 * i],
                        [100,shiftPadding + s(d.I_Percentage1 + d.D_Percentage1) + 200 * i],
                        [20,shiftPadding + s(d.I_Percentage0 + d.D_Percentage0) + 200 * i],
                        [20,shiftPadding + s(d.I_Percentage0) + 200 * i],
                    ]
                    var dPath = lineGenerator
                            .x(function(d) {return d[0];})
                            .y(function(d) {return d[1];}); 
                    shiftSvg.append("path")
                            .attr("d", dPath(dPoints))
                            .attr("stroke", "white")
                            .attr("stroke-width", 1)
                            .attr("fill", "#3182bd");

                    var rPoints =[
                        [20,shiftPadding + s(d.I_Percentage0 + d.D_Percentage0) + 200 * i],
                        [100,shiftPadding + s(d.I_Percentage1 + d.D_Percentage1) + 200 * i],
                        [100,shiftPadding + shiftHeight+ 200 * i],
                        [20,shiftPadding + shiftHeight + 200 * i],
                        [20,shiftPadding + s(d.I_Percentage0 + d.D_Percentage0) + 200 * i]
                    ]
                    var rPath = lineGenerator
                            .x(function(d) {return d[0];})
                            .y(function(d) {return d[1];}); 
                    shiftSvg.append("path")
                            .attr("d", rPath(rPoints))
                            .attr("stroke", "white")
                            .attr("stroke-width", 1)
                            .attr("fill", "#de2d26");
                    
                    shiftSvg.append("text")
                    .attr("x", shiftWidth / 2)
                    .attr("y", 20 + 200 * i)
                    .attr("class","shftNote")
                    .text(d.State);

                    shiftSvg.append("text")
                    .attr("x", 20)
                    .attr("y", 140 + 200 * i)
                    .attr("class","electoralVotesNote")
                    .text(previousYear);

                    shiftSvg.append("text")
                    .attr("x", 100)
                    .attr("y", 140 + 200 * i)
                    .attr("class","electoralVotesNote")
                    .text(chosedYear);

                    shiftSvg.append("text")
                    .attr("x", 130)
                    .attr("y", 60 + 200 * i)
                    .attr("class","independent")
                    .text("I: " + d.I_Percentage0 + "% to " + d.I_Percentage1 + "%");

                    shiftSvg.append("text")
                    .attr("x", 130)
                    .attr("y", 90 + 200 * i)
                    .attr("class","democrat")
                    .text("D: " + d.D_Percentage0 + "% to " + d.D_Percentage1 + "%");

                    shiftSvg.append("text")
                    .attr("x", 130)
                    .attr("y", 120 + 200 * i)
                    .attr("class","republican1")
                    .text("R: " + d.R_Percentage0 + "% to " + d.R_Percentage1 + "%");
                });

                


            });
        } else {
            d3.select("#stateList").select("svg").remove();
            var lists = stateul.selectAll("li").data(highlightD);
            lists.enter()
            .append("li")
            .html(function(d){
                if(d.Win == "I") {
                    return d.State + ": Independent Candidator Win!"
                } else {
                    if(d.D_Votes > d.R_Votes) {
                        return (d.State + ": " + (d.D_Percentage - d.R_Percentage).toFixed(1)  + "%");
                    } else if (d.D_Votes < d.R_Votes) {
                        return (d.State + ": " + (d.R_Percentage - d.D_Percentage).toFixed(1)  + "%");
                    } 
                }
            })
            .style("color", function(d){
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
            });
    
            lists
                .html(function(d){
                    if(d.Win == "I") {
                        return d.State + ": Independent Candidator Win!"
                    } else {
                        if(d.D_Votes > d.R_Votes) {
                            return (d.State + ": " + (d.D_Percentage - d.R_Percentage).toFixed(1)  + "%");
                        } else if (d.D_Votes < d.R_Votes) {
                            return (d.State + ": " + (d.R_Percentage - d.D_Percentage).toFixed(1)  + "%");
                        } 
                    }
                })
                .style("color", function(d){
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
                });
        
            lists.exit().remove();
        }
        


    
        
    }
}
