class WorldGrid{
    constructor(divId, worldId, worldData, raceData, circuitData, defaultYear='2000'){
        //grouped data
        this.raceData = d3.group(raceData, d => d.year);
        this.circuitData = d3.group(circuitData, d => d.circuitId);  
        this.currentData = null;
        this.divId = divId;
        this.worldId = worldId;
        this.ANIMATION_DURATION = 300;
        
        //set SVG attributes/groups
        d3.select('#' + this.divId).attr("style", "padding: 0");
        this.SVGWidth = parseInt(d3.select('#' + this.divId).style("width"));
        this.SVGHeight = this.SVGWidth/2;
        this.scaleFactor = (this.SVGWidth/759);
        d3.select('#' + this.divId)
            .attr("width", this.SVGWidth)
            .attr("height", this.SVGHeight)
            .append("g").attr("id", "tileGroup");

        //create gradient
        let gradient = d3.select("#tileGroup").append("defs")
            .append("linearGradient")
            .attr("id", "gridGradient")
            .attr("gradientTransform", "rotate(90)");
        gradient.append("stop")
            .attr("offset", "5%")
            .attr("stop-color", "#808080")
        gradient.append("stop")
            .attr("offset", "95%")
            .attr("stop-color", "#434343")

        //initialize data
        this.updateData(defaultYear);
    }

    updateData(currentYear){
        this.updateDataPoints(currentYear);
        this.updateChart();
    }

    updateDataPoints(currentYear){
        //modify currentData
        let newCurrentData = new Array();
        for (let race of this.raceData.get(currentYear)){
            let appendedData = structuredClone(this.circuitData.get(race.circuitId)[0]);
            appendedData.raceId = race.raceId;
            newCurrentData.push(appendedData);
        }
        this.currentData = newCurrentData;
    }

    updateChart(){
        let newLineVal = Math.ceil(Math.sqrt(this.currentData.length));
        let widthScale = d3.scaleLinear()
            .domain([0, newLineVal])
            .range([0, this.SVGWidth]);
        let heightScale = d3.scaleLinear()
            .domain([0, newLineVal])
            .range([0, this.SVGHeight]);

        d3.select("#tileGroup").selectAll("svg").data(this.currentData).join(
            function(enter){
                let SVG = enter.append("svg")
                    .attr("x", (d,i) => widthScale((i % newLineVal)))
                    .attr("y", (d,i) => heightScale((Math.floor(i / newLineVal))))
                    .attr("width", this.SVGWidth/newLineVal)
                    .attr("height", this.SVGHeight/newLineVal);
                SVG.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("rx", 10 * this.scaleFactor)
                    .attr("ry", 10 * this.scaleFactor)
                    .attr("fill", "url('#gridGradient')")
                    .attr("stroke", "black")
                    .on("mouseover", function(event, data){
                        d3.select('#' + this.worldId).select("#locationGroup").selectAll("circle")
                            .transition().duration(this.ANIMATION_DURATION)
                            .attr("r", function(d){
                                if (d.circuitId === data.circuitId)
                                    return 10 * this.scaleFactor;
                                else
                                    return 5 * this.scaleFactor;
                            }.bind(this));
                        d3.select(event.path[0])
                            .attr("fill", "white");
                    }.bind(this))
                    .on("mouseout", function(event){
                        d3.select('#' + this.worldId).select("#locationGroup").selectAll("circle")
                            .transition().duration(this.ANIMATION_DURATION)
                            .attr("r", 5 * this.scaleFactor);
                        d3.select(event.path[0])
                            .attr("fill", "url('#gridGradient')");
                    }.bind(this));
                SVG.append("text")
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .attr("pointer-events", "none")
                    .attr("font-weight", "bold")
                    .style("font-size", 15 * this.scaleFactor)
                    .attr("x", "50%")
                    .attr("y", "50%")
                    .text(d => d.location);
                }.bind(this),
            update => update
                .select("text")
                .text(d => d.location),
            exit => exit
                .remove()
        );
    }
}