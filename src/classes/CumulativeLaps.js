class CumulativeRecordedLaps{
    constructor(divId, lapData, driverData, defaultRaceId='845', dependencies){
        this.divId = divId;
        this.dependencies = dependencies;

        //set SVG attributes/groups
        d3.select('#' + this.divId).attr("style", "padding: 0");
        this.SVGWidth = parseInt(d3.select('#' + this.divId).style("width"));
        this.SVGHeight = this.SVGWidth/2;
        this.scaleFactor = (this.SVGWidth/759);
        d3.select('#' + this.divId)
            .attr("width", this.SVGWidth)
            .attr("height", this.SVGHeight);
        d3.select('#' + this.divId).append("g").attr("id", "cumulativeLapGroup");
        d3.select('#' + this.divId).append("g").attr("id", "cumulativeLapXAxis");
        d3.select('#' + this.divId).append("g").attr("id", "cumulativeLapYAxis");
        d3.select('#' + this.divId).append("g").attr("id", "cumulativeLapLine");
        d3.select('#' + this.divId).on("mousemove", function(pos){
            this.dependencies.recordedLaps.updateSlider(this.dependencies.recordedLaps.SVGWidth / this.SVGWidth * pos.offsetX);
            this.updateLine(pos.offsetX)
        }.bind(this));

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
        this.currentData = d3.flatGroup(this.currentData, d => d.driverId);

        //make cumulative
        for (let driver of this.currentData){
            driver[1].forEach(function (e) {
                this.count = (this.count || 0) + parseInt(e.milliseconds);
                e.milliseconds = parseFloat(this.count);
            }, Object.create(null));
        }
    }

    updateScatterPlot(){
        let maxLap = d3.max(this.currentData, driverData => d3.max(driverData[1], d => parseFloat(d.lap)));
        let minLap = d3.min(this.currentData, driverData => d3.min(driverData[1], d => parseFloat(d.lap)));
        let maxLapTime = d3.max(this.currentData, driverData => d3.max(driverData[1], d => parseFloat(d.milliseconds)));
        let minLapTime = d3.min(this.currentData, driverData => d3.min(driverData[1], d => parseFloat(d.milliseconds)));

        //set scales
        this.xScale = d3.scaleLinear()
            .domain([minLap, maxLap])
            .range([0, this.SVGWidth]);
        this.yScale = d3.scaleLinear()
            .domain([minLapTime, maxLapTime])
            .range([this.SVGHeight, 0]);

        //set color mapping
        let colorScale = d3.scaleOrdinal()
            .domain(Array.from(this.groupedDriverData.keys()))
            .range(d3.schemeCategory10);

        //plot data
        let line = d3.line()
            .x(d => this.xScale(parseInt(d.lap)))
            .y(d => this.yScale(parseInt(d.milliseconds)));
        d3.select("#cumulativeLapGroup").selectAll("path").data(this.currentData).join(
            enter => enter
                .append("path")
                .attr("fill", "none")
                .attr("d", d => line(d[1]))
                .attr("stroke", d => colorScale(d[0]))
                .on("mousemove", function(pos, data){
                    console.log(pos, data);
                }.bind(this)),
            update => update
                .attr("d", d => line(d[1]))
                .attr("stroke", d => colorScale(d[0])),
            exit => exit
                .remove()
        );
    }

    updateLine(xValue){
        let currentLap = xValue;
        d3.select('#' + this.divId).select("#cumulativeLapLine").selectAll("line").data([currentLap]).join(
            enter => enter
                .append("line")
                .attr("y1", 0)
                .attr("y2", this.SVGHeight)
                .attr("stroke", "black"),
            update => update
                .attr("x1", d => d)
                .attr("x2", d => d),
            exit => exit
                .remove()
        );
    }
}
