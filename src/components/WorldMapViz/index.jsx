import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import circuitIdMapper from '../../utils/circuitIdMapper'
var onLoadWorldMap = false;
class WorldMap{
  constructor(divId, worldData, raceData, circuitData, defaultYear='2000'){
      this.divId = divId;
      this.worldData = worldData;
      this.defaultYear = defaultYear;
      this.currentData = null;

      //set SVG attributes/groups
      d3.select('#' + this.divId).attr("style", "padding: 0");
      this.SVGWidth = parseInt(d3.select('#' + this.divId).style("width"));
      this.SVGHeight = this.SVGWidth/2;
      this.scaleFactor = (this.SVGWidth/759);
      d3.select('#' + this.divId)
          .attr("width", this.SVGWidth)
          .attr("height", this.SVGHeight);
      d3.select('#' + this.divId).append("g").attr("id", "mapGroup");
      d3.select('#' + this.divId).append("g").attr("id", "locationGroup");

      //grouped data
      this.raceData = d3.group(raceData, d => d.year);
      this.circuitData = d3.group(circuitData, d => d.circuitId);

      //define the world map
      this.defineWorldMap();
      this.updateDataPoints(this.defaultYear);
  }

  defineWorldMap(){
      this.projection = d3.geoWinkel3()
          .scale(this.scaleFactor * 125) // Scale the map based on div size
          .translate([this.SVGWidth/2, this.SVGHeight/2]); // This moves the map to the center of the SVG

      // This converts the projected lat/lon coordinates into an SVG path string
      this.path = d3.geoPath().projection(this.projection);

      //topology setup
      let topology = this.worldData;
      let geoJSON = topojson.feature(topology, topology.objects.countries);

      d3.select("#mapGroup").append("rect")
          .attr("height", "100%")
          .attr("width", "100%")
          .attr("fill", "#FFFFFF");
      let gradient = d3.select("#mapGroup").append("defs")
          .append("linearGradient")
          .attr("id", "gradient")
          .attr("gradientTransform", "rotate(90)");
      gradient.append("stop")
          .attr("offset", "5%")
          .attr("stop-color", "rgb(225,6,0)")
      gradient.append("stop")
          .attr("offset", "95%")
          .attr("stop-color", "#480000")
      
          
      d3.select("#mapGroup").selectAll("path")
      .data(geoJSON.features)
      .join(
        enter => enter
          .append("path")
          .attr("stroke", "rgb(225,6,0)")
          .attr("stroke-width", this.scaleFactor * 0.8)
          .attr("fill", "url('#gradient')")
          .attr("d", d => this.path(d.geometry))
      );
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

      //update data points
      d3.select("#locationGroup").selectAll("circle")
      .data(this.currentData)
      .join(
          enter => enter
              .append("circle")
              .attr("cx", d => this.projection([d.lng, d.lat])[0])
              .attr("cy", d => this.projection([d.lng, d.lat])[1])
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("r", this.scaleFactor * 5)
              .on("mouseover", function(event, data){
                  let width = 250;
                  let height = 25;

                  let currentCircle = d3.select('#' + this.divId)
                      .append("svg")
                      .attr("x", event.layerX + width > this.SVGWidth ? 
                          event.layerX - width * this.scaleFactor - 10 * this.scaleFactor : 
                          event.layerX + 10 * this.scaleFactor)
                      .attr("y", event.layerY)
                      .attr("width", this.scaleFactor * width)
                      .attr("height", this.scaleFactor * height);

                  currentCircle.append("rect")
                      .attr("width", "100%")
                      .attr("height", "100%")
                      .attr("rx", "10")
                      .attr("ry", "10")
                      .attr("fill", "gray");

                  currentCircle.append("text")
                      .attr("text-anchor", "middle")
                      .attr("dominant-baseline", "middle")
                      .style("font-size", 15 * this.scaleFactor)
                      .attr("x", "50%")
                      .attr("y", "50%")
                      .text(data.name);
              }.bind(this))
              .on("mouseout", function(event, data){
                  d3.select('#' + this.divId).select("svg").remove();
              }.bind(this)),
          update => update
              .attr("r", 0)
              .transition().duration(300)
              .attr("r", this.scaleFactor * 5)
              .attr("cx", d => this.projection([d.lng, d.lat])[0])
              .attr("cy", d => this.projection([d.lng, d.lat])[1]),
          function(exit){
              exit.select("circle")
                  .transition().duration(300) 
                  .attr("r", 0);
              exit.remove();
          }
      );       
  }
}

const WorldMapViz = ({ season, raceList, worldMap }) => {
  const svgWidth = 1000
  const svgHeight = 500
  let worldMapObj = null;
  let geoProjection = d3.geoNaturalEarth1();

  const ref = useD3(svg => {
    //define world map
    if (onLoadWorldMap === false){
      let projection = geoProjection
        .scale(175) 
        .translate([svgWidth/2, svgHeight/2]); 

      // This converts the projected lat/lon coordinates into an SVG path string
      let path = d3.geoPath().projection(projection);

      //topology setup
      let topology = worldMap;
      let geoJSON = topojson.feature(topology, topology.objects.countries);   
      
      //append gradient
      let gradient = d3.select("#mapGroup").append("defs")
          .append("linearGradient")
          .attr("id", "gradient")
          .attr("gradientTransform", "rotate(90)");
      gradient.append("stop")
          .attr("offset", "5%")
          .attr("stop-color", "rgb(225,6,0)")
      gradient.append("stop")
          .attr("offset", "95%")
          .attr("stop-color", "#480000")

      //append map
      d3.select("#mapGroup").selectAll("path")
      .data(geoJSON.features)
      .join(
        enter => enter
          .append("path")
          .attr("stroke", "rgb(225,6,0)")
          .attr("stroke-width", 0.8)
          .attr("fill", "url('#gradient')")
          .attr("d", d => path(d.geometry))
      );
    }
  }, [season])

  return (
    <svg height={svgHeight} width={svgWidth}>
      <g id='mapGroup' />
      <g id='mapLocations' />
    </svg>
  )
}

export default WorldMapViz