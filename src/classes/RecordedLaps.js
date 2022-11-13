class RecordedLaps{
    constructor(divId, listId, lapData, driverData, defaultRaceId='845', dependencies){
        this.divId = divId;
        this.listId = listId;
        this.ANIMATION_DURATION = 300;

        //set SVG attributes/groups
        d3.select('#' + this.divId).attr("style", "padding: 0");
        this.SVGWidth = parseInt(d3.select('#' + this.divId).style("width"));
        this.SVGHeight = this.SVGWidth;
        this.scaleFactor = (this.SVGWidth/759);
        d3.select('#' + this.divId)
            .attr("width", this.SVGWidth)
            .attr("height", this.SVGHeight);
        d3.select('#' + this.divId).append("rect").attr("width", "100%").attr("height", "100%").attr("fill","#f5f5f5");
        d3.select('#' + this.divId).append("g").attr("id", "scatterGroup");
        d3.select('#' + this.divId).append("g").attr("id", "scatterXAxis");
        d3.select('#' + this.divId).append("g").attr("id", "scatterYAxis");
        d3.select('#' + this.divId).append("g").attr("id", "scatterSlider");
        d3.select('#' + this.listId).append("g").attr("id", "currentRaceListText");

        //set scales
        this.xScale = null;
        this.yScale = null;

        //grouped data items
        this.groupedLapData = d3.group(lapData, d => d.raceId);
        this.groupedDriverData = d3.group(driverData, d => d.driverId);
        this.currentData = null;

        //update chart data
        this.updateDataPoints(defaultRaceId);
        this.updateScatterPlot();
    }

    updateDataPoints(raceId){
        //modify currentData
        this.currentData = structuredClone(this.groupedLapData.get(raceId));
    }

    updateSlider(xValue){
        let currentLap = Math.ceil(this.xScale.invert(xValue));
        
        //update slider
        d3.select('#' + this.divId).select("#scatterSlider").selectAll("rect").data([currentLap]).join(
            enter => enter
                .append("rect")
                .attr("id", "slideRect")
                .attr("fill", "black")
                .attr("opacity", "0.5")
                .attr("x", this.xScale(currentLap) - this.scaleFactor * 5)
                .attr("y", 0)
                .attr("height", this.SVGHeight)
                .attr("width", this.xScale(2) * this.scaleFactor),
            update => update
                .attr("x", this.xScale(currentLap) - this.scaleFactor * 5),
            exit => exit
                .remove()
        );

        //update list values
        let racersByLap = d3.filter(this.currentData, function(d){
            return parseInt(d.lap) === currentLap;
        }.bind(this));
        racersByLap = racersByLap.sort((a, b) => parseInt(a.position) - parseInt(b.position));
        console.log(racersByLap);
        d3.select("#currentRaceListText").selectAll("g").data(racersByLap).join(
            function(enter){
                let group = enter.append("g");
                group.append("rect")
                    .attr("x", 0)
                    .attr("y", (d,i) => i * 17)
                    .attr("height", "17")
                    .attr("width", "100%")
                    .attr("fill", "gray"),//colorScale(d.driverId))
                group.append("text")
                    .attr("x", 0)
                    .attr("y", (d,i) => i * 17 + 16)
                    .text(d => this.groupedDriverData.get(d.driverId)[0].driverRef + " " + d.position);
            }.bind(this),
            update => update
                .select("text")
                .text(d => this.groupedDriverData.get(d.driverId)[0].driverRef + " " + d.position),
            exit => exit
                .remove()
        );

    }

    updateScatterPlot(){
        let maxLap = d3.max(this.currentData, d => parseInt(d.lap));
        let minLap = d3.min(this.currentData, d => parseInt(d.lap));
        let maxLapTime = d3.max(this.currentData, d => parseInt(d.milliseconds));
        let minLapTime = d3.min(this.currentData, d => parseInt(d.milliseconds));

        //set color mapping
        let colorScale = d3.scaleOrdinal()
            .domain(Array.from(this.groupedDriverData.keys()))
            .range(d3.schemeCategory10);

        //update scales
        this.xScale = d3.scaleLinear()
            .domain([minLap, maxLap])
            .range([5 * this.scaleFactor, this.SVGWidth - 5 * this.scaleFactor]);
        this.yScale = d3.scaleLinear()
            .domain([minLapTime, maxLapTime])
            .range([this.SVGHeight, 0]);

        //update slider
        d3.select('#' + this.divId).on("mousemove", function(pos){
            this.updateSlider(pos.offsetX);
        }.bind(this))
        
        //plot data
        d3.select("#scatterGroup").selectAll("circle").data(this.currentData).join(
            enter => enter
                .append("circle")
                .attr("cx", d => this.xScale(parseInt(d.lap)))
                .attr("cy", d => this.yScale(parseInt(d.milliseconds)))
                .attr("opacity", function(d){
                    let filteredData = d3.filter(this.currentData, score => score.lap === d.lap); 
                    let lapMedian = d3.median(filteredData, d1 => d1.milliseconds);
                    let difference = Math.abs(lapMedian - Math.abs(d.milliseconds - parseInt(lapMedian)));

                    let returnVal = Math.pow(1.0 * (difference / lapMedian), 64);
                    return returnVal < 0.2 ? 0.2 : returnVal;
                }.bind(this))
                .attr("fill", d => colorScale(d.driverId))
                .attr("r", this.scaleFactor * 5),
            update => update
                .attr("cx", d => this.xScale(parseInt(d.lap)))
                .attr("cy", d => this.yScale(parseInt(d.milliseconds)))
                .attr("r", 0)
                .transition().duration(this.ANIMATION_DURATION)
                .attr("r", this.scaleFactor * 5),
            exit => exit
                .transition().duration(this.ANIMATION_DURATION)
                .attr("r", 0)
                .remove()
        );
    }
}