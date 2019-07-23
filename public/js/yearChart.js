var colorScale = d3.scaleLinear()
    .domain([-6,-5,-4,-3,-2,-1,0,1,2,3,4,5])
    .range(["#063e78", "#09519c", "#3182bd", "#6baed6","#9ecae1", "#c6dbef",
            "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860309"]);
var yearMargin = {top: 10, right: 10, bottom: 10, left: 10};

var yearWidth = 1500 - yearMargin.left - yearMargin.right,
    yearHeight = 100 - yearMargin.top - yearMargin.bottom;

var yearSvg = d3.select("#year-chart").append("svg")
    .attr("width", yearWidth + yearMargin.left + yearMargin.right)
    .attr("height", yearHeight + yearMargin.top + yearMargin.bottom);

var oneYearData;
var lineGenerator = d3.line();
var chosedYear = 0
function YearChart(electoralVoteChart,tileChart, votePercentageChart,electionWinners ) {
    
    
    var x = d3.scaleBand()
            .domain(electionWinners.map(function(d) {return d.YEAR;}))
            .range([0, yearWidth])
            .padding(.1);
    
        this.update = function () {
            var circle = yearSvg.selectAll("circle").data(electionWinners);
            circle.enter()
                .append("circle")
                .attr("id", function(d){return d.YEAR;})
                .attr("r", 10)
                .attr("stroke", "#eee")
                .attr("stroke-width","2px")
                .attr("cx", function(d, index) {return index * x.bandwidth() + 20})
                .attr("cy", yearHeight / 2)
                .attr("class", function(d) {
                    switch(d.PARTY) {
                        case "D":
                            return  "democrat";
                        case "R":
                            return "republican";
                        default:
                            return "independent";
                    }
                })
                .on("click", function(d){
                    highlight = []
                    highlightD = []
                    yearSvg.selectAll("circle").attr("stroke","white");
                    d3.select(this).attr("stroke","black");
                    chosedYear = +d.YEAR;
                    fileName = "data/election-results-" + chosedYear + ".csv";
                    d3.csv(fileName, function(fileData) {
                        oneYearData = fileData.map(function(d){
                            D_Percentage = +d.D_Percentage;
                            R_Percentage = +d.R_Percentage;
                            I_Percentage = +d.I_Percentage;
                            if(D_Percentage > R_Percentage) {
                                win = "D";
                                winValue = D_Percentage
                            } else {
                                win = "R";
                                winValue = R_Percentage
                            }
                            if( winValue < I_Percentage){
                                win = "I";
                                winValue = I_Percentage;
                            }
                            return {
                                State: d.State,
                                Abbreviation: d.Abbreviation,
                                Total_EV: +d.Total_EV,
                                D_Nominee: d.D_Nominee,
                                D_Percentage: +d.D_Percentage,
                                D_Votes: +d.D_Votes,
                                R_Nominee: d.R_Nominee,
                                R_Percentage: +d.R_Percentage,
                                R_Votes: +d.R_Votes,
                                I_Nominee: d.I_Nominee,
                                I_Percentage: +d.I_Percentage,
                                I_Votes: +d.I_Votes,
                                I_Votes_Total: +d.I_Votes_Total,
                                Year:+d.Year,
                                Win:win
                            }
                        });
                        //console.log(oneYearData);
                        electoralVoteChart.update();
                        votePercentageChart.update();
                        tileChart.update();
                     });
                });

            var points = [];
            points.push(0);
            for(var i = 0; i < electionWinners.length; i++){
                points.push(i * x.bandwidth() + 20 - 10);
                points.push(i * x.bandwidth() + 20 + 10);
            }
            points.push(1320)
            for(var i = 0; i < points.length; i+=2){
                yearSvg.append("line")
                .attr("stroke-dasharray", "3 3")
                .attr("stroke", "black")
                .attr("x1", points[i])
                .attr("y1", yearHeight / 2)
                .attr("x2", points[i + 1])
                .attr("y2", yearHeight / 2)
            }
            

            var text = yearSvg.selectAll("text").data(electionWinners);
            text.enter()
                .append("text")
                .attr("x", function(d, index) {return index * x.bandwidth() + 5})
                .attr("y", yearHeight / 2 + 30)
                .attr("font-size", "12px")
                .text(function(d) {return d.YEAR;});

        }
}