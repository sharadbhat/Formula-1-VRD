import { useState } from 'react'
import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import circuitIdMapper from '../../utils/circuitIdMapper'
import constants from '../../utils/constants'
import useGlobalStore from '../../utils/store'

// Assets
import worldMapJson from '../../assets/world-simplified.json'

const WorldMapViz = ({ season, raceList }) => {
    const hoveredRound = useGlobalStore(state => state.hoveredRound)
    const setHoveredRound = useGlobalStore(state => state.setHoveredRound)

    const [hoveredRaceName, setHoveredRaceName] = useState(null)

    const svgWidth = 1000
    const svgHeight = 500
    const scale = 175

    const firstOffset = 5
    const firstStopColor = 'gray'
    const secondOffset = 95
    const secondStopColor = 'rgb(60,112,126)'

    const strokeColor = '#A1B2C3'
    const strokeWidth = 0.8

    const circleFill = '#d1d1d1'
    const circleStroke = 'black'

    const cardWidth = 250
    const cardHeight = 100
    const cardCornerRadius = constants.cardCornerRadius
    const cardColor = constants.cardColor

    const ref = useD3(svg => {
        let geoProjection = d3.geoNaturalEarth1()
        let projection = geoProjection
            .scale(scale) 
            .translate([svgWidth / 2, svgHeight / 2])

        // This converts the projected lat/lon coordinates into an SVG path string
        let path = d3.geoPath().projection(projection)

        //topology setup
        let topology = worldMapJson
        let geoJSON = topojson.feature(topology, topology.objects.countries)   

        svg.select('#linearGradientMap').append('stop')
            .attr('offset', `${firstOffset}%`)
            .attr('stop-color', firstStopColor)

        svg.select('#linearGradientMap').append('stop')
            .attr('offset', `${secondOffset}%`)
            .attr('stop-color', secondStopColor)

        //append map
        svg.select('#mapGroup').selectAll('path')
        .data(geoJSON.features)
        .join(
            enter => enter
                .append('path')
                .attr('stroke', strokeColor)
                .attr('stroke-width', strokeWidth)
                .attr('fill', `url('#linearGradientMap')`)
                .attr('d', d => path(d.geometry))
        )

        //update circles
        svg.select('#mapLocations').selectAll('circle')
            .data(raceList)
            .join('circle')
            .attr('id', d => `roundNumber-${d.round}`)
            .attr('cx', d => projection([circuitIdMapper[d.circuitId].lng, circuitIdMapper[d.circuitId].lat])[0])
            .attr('cy', d => projection([circuitIdMapper[d.circuitId].lng, circuitIdMapper[d.circuitId].lat])[1])
            .attr('r', 0)
            .on('mouseenter', (event, data) => {
                svg.select(`#${event.target.id}`)
                    .attr('fill', 'red')

                let [xPosition, yPosition] = d3.pointer(event)

                if (xPosition > svgWidth / 2) {
                    xPosition -= (cardWidth + 10)
                } else {
                    xPosition += 10
                }
                if (yPosition > svgHeight / 2) {
                    yPosition -= (cardHeight + 10)
                } else {
                    yPosition += 10
                }

                svg.select('#hover-card-group')
                    .attr('visibility', 'visible')
                    .attr('transform', `translate(${xPosition}, ${yPosition})`)

                setHoveredRound(data.round)
                setHoveredRaceName(data.name)
            })
            .on('mousemove', (event) => {
                let [xPosition, yPosition] = d3.pointer(event)

                if (xPosition > svgWidth / 2) {
                    xPosition -= (cardWidth + 10)
                } else {
                    xPosition += 10
                }
                if (yPosition > svgHeight / 2) {
                    yPosition -= (cardHeight + 10)
                } else {
                    yPosition += 10
                }

                svg.select('#hover-card-group')
                    .attr('transform', `translate(${xPosition}, ${yPosition})`)
            })
            .on('mouseleave', (event) => {
                svg.select(`#${event.target.id}`)
                    .attr('fill', circleFill)

                setHoveredRound(null)

                svg.select('#hover-card-group')
                    .attr('visibility', 'hidden')
            })
            .transition()
            .delay((_, i) => i * 20) 
            .duration(300)
            .attr('r', 5)
            .attr('fill', circleFill)
            .attr('stroke', circleStroke)
            .attr('r', 6)
    }, [season])

  return (
    <svg ref={ref} height={svgHeight} width={svgWidth}>
        <linearGradient id='linearGradientMap' gradientTransform='rotate(90)' />
        <g id='mapGroup' />
        <g id='mapLocations' />
        <g id='hover-card-group' visibility={'hidden'}>
            <rect height={cardHeight} width={cardWidth} rx={cardCornerRadius} fill={cardColor} />
            <text
                id='hover-card-current-lap'
                textAnchor='middle'
                fill='white'
                x={cardWidth / 2}
                y={cardHeight / 3 + 5}
            >
                Round: {hoveredRound}
            </text>
            <text
                id='hover-card-current-lap'
                textAnchor='middle'
                fill='white'
                x={cardWidth / 2}
                y={2 * cardHeight / 3 + 5}
            >
                {hoveredRaceName}
            </text>
        </g>
    </svg>
  )
}

export default WorldMapViz