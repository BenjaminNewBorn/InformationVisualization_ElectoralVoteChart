var perMargin = {top: 10, right: 10, bottom: 10, left: 10};

var perWidth = 960 - perMargin.left - perMargin.right,
    perHeight = 200 - perMargin.top - perMargin.bottom;

var perSvg = d3.select("#votes-percentage").append("svg")
    .attr("width", perWidth + perMargin.left + perMargin.right)
    .attr("height", perHeight + perMargin.top + perMargin.bottom);

var perToolTip = d3.select("#votes-percentage").append("div")
    .attr("class", "d3-tip2")
    .style("opacity", 0);

var perTextGroup = perSvg.append("g");
var perChartGroup = perSvg.append("g");

function VotePercentageChart() {
    this.type = "votePercentageChart";
    this.update = function(){
        var voteSum = []
        var indeVote = d3.sum(oneYearData, function(d) {
            return d.I_Votes;
        });
        var dVote = d3.sum(oneYearData, function(d) {
            return d.D_Votes;
        });
        var rVote = d3.sum(oneYearData, function(d) {
            return d.R_Votes;
        });
        totalVote = indeVote + dVote + rVote;
        var indePercentage = "";
        if(indeVote != 0) {
            indePercentage = ((indeVote / totalVote) * 100).toFixed(1) + '%';
        }
        var dPercentage = ((dVote / totalVote) * 100).toFixed(1) + '%';
        var rPercentage = ((rVote / totalVote) * 100).toFixed(1) + '%';
        voteSum[0] = {
            Vote: indeVote,
            pos: 0,
            Nominee: oneYearData[0].I_Nominee,
            
        };
        voteSum[1] = {
            Vote: dVote,
            pos: indeVote,
            Nominee: oneYearData[0].D_Nominee,
            
        };
        voteSum[2] = {
            Vote: rVote,
            pos: indeVote + dVote,
            Nominee: oneYearData[0].R_Nominee,
            
        };
        
        //  console.log(voteSum);
        var xVote = d3.scaleLinear().domain([0,totalVote])
            .range([0,perWidth]);
    
        //get  Nominee bar chart
        var perBar = perChartGroup.selectAll(".bar").data(voteSum);
        perBar.enter().append("rect")
            .attr("class", "bar")
            .attr("fill", function(d, index) {
                switch(index){
                    case 0:
                        return "#45AD6A";
                    case 1:
                        return "#3182bd";
                    case 2:
                        return "#de2d26";
                }
            })
            .attr("x", function(d) {return xVote(d.pos);})
            .attr("y", perHeight / 2 - 10)
            .attr("width", function(d){return xVote(d.Vote);})
            .attr("height", 20)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);;

        perBar
            .attr("fill", function(d, index) {
                switch(index){
                    case 0:
                        return "#45AD6A";
                    case 1:
                        return "#3182bd";
                    case 2:
                        return "#de2d26";
             }
            })
            .attr("x", function(d) {return xVote(d.pos);})
            .attr("y", perHeight / 2 - 10)
            .attr("width", function(d){return xVote(d.Vote);})
            .attr("height", 20)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);;
            
        perBar.exit().remove();

        //get Nominee text
        var nomineeText = perTextGroup.selectAll("text").data(voteSum);
        nomineeText.enter()
            .append("text")
            .attr("x", function(d,index) {
                switch (index) {
                    case 0:
                        return 0;
                    case 1:
                        return xVote(d.pos + 0.5 * d.Vote);
                    case 2:
                        return perWidth;
                }
            })
            .attr("y", perHeight / 2 - 40)
            .attr("class", function(d, index) {
                switch (index) {
                    case 0:
                        return "independent";
                    case 1:
                        return "democrat";
                    case 2:
                        return "republican";
                }
            })
            .text(function(d) {return d.Nominee;});
        
        nomineeText
            .attr("x", function(d,index) {
                switch (index) {
                    case 0:
                        return 0;
                    case 1:
                        return xVote(d.pos + 0.5 * d.Vote);
                    case 2:
                        return perWidth;
                }
            })
            .attr("y", perHeight / 2 - 40)
            .attr("class", function(d, index) {
                switch (index) {
                    case 0:
                        return "independent";
                    case 1:
                        return "democrat";
                    case 2:
                        return "republican";
                }
            })
            .text(function(d) {return d.Nominee;});
        nomineeText.exit().remove();
        
        // get percentage text
        var perPos = [perWidth /2, 0, xVote(voteSum[1].pos + 0.5 * voteSum[1].Vote), perWidth]
        var perText = perChartGroup.selectAll("text").data(perPos);
        perText.enter()
            .append("text")
            .attr("x", function(d){return d} )
            .attr("y", perHeight / 2 - 20)
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
                switch (index) {
                    case 0:
                        return "Popular Vote(50%)";
                    case 1: 
                        return indePercentage;
                    case 2:
                        return dPercentage;
                    case 3: 
                        return rPercentage;
                }
            });
        
        perText.attr("x", function(d){return d} )
            .attr("y", perHeight / 2 - 20)
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
                switch (index) {
                    case 0:
                        return "Popular Vote(50%)";
                    case 1: 
                        return indePercentage;
                    case 2:
                        return dPercentage;
                    case 3: 
                        return rPercentage;
                }
            });
            perText.exit().remove();

        var points = [[perWidth / 2, perHeight / 2 - 12],
                      [perWidth / 2, perHeight / 2 + 12]];
        var midLine = lineGenerator
                        .x(function(d) {return d[0];})
                        .y(function(d) {return d[1];});
        perChartGroup.append("path")
            .attr("d", midLine(points))
            .attr("stroke", "black")
            .attr("stroke-width", 2);



        function handleMouseOver(d){
            perToolTip.transition()
                .duration(200)
                .style("opacity", .9)
                .style("left",d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px"); 
            
            var dInfo = voteSum[1].Nominee + ": " + voteSum[1].Vote + "(" + ((dVote / totalVote) * 100).toFixed(1) + '%)';
            

            var rInfo = voteSum[2].Nominee + ": " + voteSum[2].Vote + "(" + ((rVote / totalVote) * 100).toFixed(1) + '%)';
            var iInfo = voteSum[0].Nominee + ": " + voteSum[0].Vote + "(" + ((indeVote / totalVote) * 100).toFixed(1) + '%)';
            // the data 1952.csv will go wrong when use voteSum[0].Nominee to determine
            var totalInfo;
            if(voteSum[0].Vote != 0) {
                totalInfo = [dInfo, rInfo, iInfo];
            } else {
                totalInfo = [dInfo, rInfo];
            }
            // console.log(totalInfo)
            perToolTip.selectAll("span")
                .data(totalInfo)
                .enter()
                .append("span")
                .text(function(da) {
                    return da;
                })
                .style("color", function(da,i) {
                    switch(i) {
                        case 0:
                            return "#3182bd";
                        case 1: 
                            return "#de2d26";
                        case 2:
                            return "#45AD6A";
                    }
                })
                .style("size", "10px")
                .append("br");

            perToolTip.selectAll("span").data(totalInfo)
                .text(function(da) {
                    return da;
                })
                .style("color", function(da,i) {
                    switch(i) {
                        case 0:
                            return "#3182bd";
                        case 1: 
                            return "#de2d26";
                        case 2:
                            return "#45AD6A";
                    }
                })
                .style("size", "10px")
                .append("br");

            perToolTip.selectAll("span").data(totalInfo).exit().remove();
        }

        function handleMouseOut(d) {
            perToolTip.transition()
            .duration(500)
            .style("opacity", 0);
        }
    }

    
}