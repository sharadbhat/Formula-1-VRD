import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import circuitIdMapper from '../../utils/circuitIdMapper'
var onLoadWorldMap = false;

const WorldMapViz = ({ season, raceList, worldMap, circuitData}) => {
  const svgWidth = 1000
  const svgHeight = 500

  const ref = useD3(svg => {
    let geoProjection = d3.geoNaturalEarth1();
    let projection = geoProjection
      .scale(175) 
      .translate([svgWidth/2, svgHeight/2]);

    //define world map
    if (onLoadWorldMap === false){

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

    //update circles
    d3.select("#mapLocations").selectAll("circle")
      .data(raceList)
      .join(
        enter => enter
          .append("circle")
            .on("mouseover", function(event, data){
              let width = 250;
              let height = 25;

              let currentCircle = d3.select('#mapLocations')
                  .append("svg")
                  .attr("x", event.offsetX + width > svgWidth ? 
                    event.offsetX - width :
                    event.offsetX)
                  .attr("y", event.offsetY)
                  .attr("width", width)
                  .attr("height", height);

              currentCircle.append("rect")
                  .attr("width", "100%")
                  .attr("height", "100%")
                  .attr("rx", "10")
                  .attr("ry", "10")
                  .attr("fill", "#25262b");

              currentCircle.append("text")
                  .attr("text-anchor", "middle")
                  .attr("dominant-baseline", "middle")
                  .style("font-size", 15)
                  .style("font-weight", 700)
                  .style("fill", "white")
                  .attr("x", "50%")
                  .attr("y", "50%")
                  .text(data.name);
          })
          .on("mouseout", function(event, data){
              d3.select('#mapLocations').select("svg").remove();
          })
          .attr("cx", d => projection([circuitData[d.circuitId].lng, circuitData[d.circuitId].lat])[0])
          .attr("cy", d => projection([circuitData[d.circuitId].lng, circuitData[d.circuitId].lat])[1])
          .attr("r", 0)
          .transition()
          .delay((d,i) => i*20) 
          .duration(300)
          .attr("r", 5)
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("r", 6),
        update => update
          .attr("cx", d => projection([circuitData[d.circuitId].lng, circuitData[d.circuitId].lat])[0])
          .attr("cy", d => projection([circuitData[d.circuitId].lng, circuitData[d.circuitId].lat])[1])
          .attr("r", 0)
          .transition()
          .delay((d,i) => i*20) 
          .duration(300)
          .attr("r", 5)
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("r", 6),
        exit => exit
          .remove()
      );
  }, [season])

  return (
    <svg height={svgHeight} width={svgWidth}>
      <g id='mapGroup' />
      <g id='mapLocations' />
    </svg>
  )
}

export default WorldMapViz