var voteMargin = {top: 10, right: 10, bottom: 10, left: 10};

var voteWidth = 960 - voteMargin.left - voteMargin.right,
    voteHeight = 60 - voteMargin.top - voteMargin.bottom;

var voteSvg = d3.select("#electoral-vote").append("svg")
    .attr("width", voteWidth + voteMargin.left + voteMargin.right)
    .attr("height", voteHeight + voteMargin.top + voteMargin.bottom)

var voteGroup = voteSvg.append("g").attr("transform", "translate(0," + 30 + ")");
var highlight = []
var highlightD = []
function ElectoralVoteChart(shiftChart) {
    this.type = "electoralVoteChart";
    this.shiftChart = shiftChart;
    

    this.update = function (){
        // console.log(oneYearData);
        highlight = [];
        highLightD = [];
        shiftChart.update();
        var indeArray = [];
        var otherArray = [];
        var voteNums = [0,0,0];
        var sum = d3.sum(oneYearData, function(d) {return d.Total_EV;});
        var xVote = d3.scaleLinear().domain([0, sum])
                     .range([0, voteWidth + voteMargin.left + voteMargin.right])
        
        oneYearData.forEach(function(d){
            switch(d.Win) {
                case "I":
                    indeArray.push(d);
                    voteNums[0] = voteNums[0] + d.Total_EV;
                    break;
                case "D":
                    otherArray.push(d);
                    voteNums[1] = voteNums[1] + d.Total_EV;
                    break;
                case "R":
                    otherArray.push(d);
                    voteNums[2] = voteNums[2] + d.Total_EV;
                    break;
            }
        });
        
        otherArray.sort(function(a,b) {return d3.ascending(a.R_Percentage - a.D_Percentage, b.R_Percentage - b.D_Percentage)});
        // console.log(otherArray.length)
        // console.log(indeArray.length);
        var voteTemp = [];
        indeArray.forEach(function(d) {
            // voteNums[0] = voteNums[0] + d.Total_EV; 
            voteTemp.push(d);
        });
        otherArray.forEach(function(d) {
            // voteNums[1] = voteNums[1] + d.Total_EV;
            voteTemp.push(d);
        });
        //console.log(voteArray);
        // console.log(voteNums);
        var voteArray = voteTemp.map(function (d) {
            return {
                Win: d.Win,
                Total_EV: d.Total_EV,
                pos: 0,
                R_Percentage: +d.R_Percentage,
                D_Percentage: +d.D_Percentage,
                I_Percentage: +d.I_Percentage,
                State:d.State,
                D_Votes: +d.D_Votes,
                R_Votes: +d.R_Votes,
            }
        });
        
        shiftChart.update();

        //get position of each point
        for(var i = 1; i < voteArray.length; i++) {
            voteArray[i].pos = voteArray[i - 1].pos + voteArray[i - 1].Total_EV;
        }
        var voteDomain = []
        var voteRange = []
        voteArray.forEach(function(d){
                voteDomain.push(d.pos);
                voteRange.push(xVote(d.pos));
        });
        // console.log(voteDomain);
        // console.log(voteRange);

        var voteScale = d3.scaleQuantile().domain(voteDomain).range(voteRange);
        // console.log(voteArray);
        
        // the previous color stratage
        // var dLinearColor = d3.scaleLinear()
        //     .domain([voteNums[0], voteNums[1] + voteNums[0] - 1])
        //     .range(["#3182bd", "lightblue"]);
        // var rLinearColor = d3.scaleLinear()
        //     .domain([voteNums[1] + voteNums[0],voteNums[1] + voteNums[0] + voteNums[2] - 1])
        //     .range(["pink", "#de2d26"]);  
        var voteBar = voteGroup.selectAll(".bar").data(voteArray);  

        voteBar.enter().append("rect")
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
            .attr("stroke", "white")
            .attr("x", function(d){return xVote(d.pos);})
            .attr("y", 5)
            .attr("width", function(d){return xVote(d.Total_EV);})
            .attr("height", 20);
        
        voteBar.attr("fill", function(d) {
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
            .attr("stroke", "white")
            .attr("x", function(d){return xVote(d.pos);})
            .attr("y", 5)
            .attr("width", function(d){return xVote(d.Total_EV);})
            .attr("height", 20);

        voteBar.exit().remove();


        var points = [[voteWidth / 2, 30],
                      [voteWidth / 2, 60]];
        var midLine = lineGenerator
                        .x(function(d) {return d[0];})
                        .y(function(d) {return d[1];});
        voteSvg.append("path")
            .attr("d", midLine(points))
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    
        var textPos = [voteWidth / 2, 0, xVote(voteNums[0]),voteWidth];
        // console.log(textPos);
        // console.log(voteNums);
        var text = voteSvg.selectAll("text").data(textPos);
            text.enter()
                .append("text")
                .attr("x", function(d) {return d;})
                .attr("y", 25)
                .attr("class", function(d, index) {
                    switch (index) {
                        case 0:
                            return "electoralVotesNote";
                        case 1:
                            return "independent";
                        case 2:
                            return "democrat";
                        case 3:
                            return "republican";
                    }
                })
                .text(function(d, index) {
                    switch(index) {
                        case 0:
                            return "Elctoral Vote (" + sum / 2 + " needed to win)";
                        case 1:
                            if(voteNums[0] != 0) {
                                return voteNums[0];
                            } else {
                                return "";
                            }
                        case 2:
                            return voteNums[1];
                        case 3:
                            return voteNums[2];
                    }
                });
            
        text
            .attr("x", function(d, index) {return d;})
            .attr("y", yearHeight / 2 - 20)
            .attr("class", function(d, index) {
                switch (index) {
                    case 0:
                        return "electoralVotesNote";
                    case 1:
                        return "independent";
                    case 2:
                        return "democrat";
                    case 3:
                        return "republican";
                }
            })
            .text(function(d, index) {
                switch(index) {
                    case 0:
                        return "Elctoral Vote (" + sum / 2 + " needed to win)";
                    case 1:
                        if(voteNums[0] != 0) {
                            return voteNums[0];
                        } else {
                            return "";
                        }
                    case 2:
                        return voteNums[1];
                    case 3:
                        return voteNums[2];
                }
            });
        text.exit().remove();

        var brush = d3.brushX()
        // .extent([0,0],[voteWidth,voteHeight])
        .on("start brush", brushed)
        .on("end", brushended);

        d3.select(".brush").remove();
        voteGroup.append("g").attr("class","brush").call(brush);
        function brushed() {
            // console.log( d3.event.selection );
                var s = d3.event.selection,
                    x0 = s[0],
                    x1 = s[1];
                    // dx = s[1][0] - x0,
                    // dy = s[1][1] - y0;
                //console.log("("+x0+","+x1+")");
                // console.log(s);
                // var d0 = d3.event.selection.map(xVote.invert);
                // var d1 = d0.map(voteScale.round);
                // console.log("1: " + d0);
                
                // console.log("2: " + d0);
                // d3.select(this).call(d3.event.target.move,d0.map(xVote));
            }
    
        function brushended() {
            if (!d3.event.selection) return ;
            if (!d3.event.sourceEvent) return;
            var target = d3.event.selection.map(xVote.invert);
            highlight = [];
            highlightD = []
            for(var i = 0; i < voteArray.length; i++) {
                if(voteArray[i].pos  >= target[1]) {
                    highlight.push(voteArray[i - 1].State);
                    highlightD.push(voteArray[i - 1]);
                    break;
                }
                else if(voteArray[i].pos > target[0]){
                    highlight.push(voteArray[i - 1].State);
                    highlightD.push(voteArray[i - 1]);
                }
            }
            if(voteArray[voteArray.length - 1].pos  <target[1]){
                highlight.push(voteArray[voteArray.length - 1].State);
                highlightD.push(voteArray[voteArray.length - 1]);
            }
            d3.select("#tileChart").selectAll(".bar")
            .attr("stroke", function(d) {
                if(highlight.includes(d.State)){
                    return "black";
                } else {
                    return "white";
                }
            })
            d3.select("#tileChart").selectAll(".bar").exit().remove();
            // console.log(highlightD);
            shiftChart.update();
        }  
    }
}


