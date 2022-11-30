import { useState } from 'react'
import { usePrevious } from '@mantine/hooks'
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
    const selectedRound = useGlobalStore(state => state.selectedRound)
    const setSelectedRound = useGlobalStore(state => state.setSelectedRound)
    const setSelectedRaceId = useGlobalStore(state => state.setSelectedRaceId)
    const setSelectedCircuitId = useGlobalStore((state) => state.setSelectedCircuitId)
    const setSelectedDrivers = useGlobalStore((state) => state.setSelectedDrivers)
    const setHoveredDriverId = useGlobalStore((state) => state.setHoveredDriverId)
    const setHoveredLap = useGlobalStore((state) => state.setHoveredLap)

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
    const circleRadiusStart = 5
    const circleRadius = 6
    const circleRadiusLarge = 10

    const cardWidth = 250
    const cardHeight = 100
    const cardCornerRadius = constants.cardCornerRadius
    const cardColor = constants.cardColor

    const prevSeason = usePrevious(season)
    const prevHoveredRound = usePrevious(hoveredRound)
    const prevSelectedRound = usePrevious(selectedRound)
    
    const ref = useD3(svg => {
        if (season !== prevSeason) {
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
                .style('cursor', 'pointer')
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
                .on('click', (_, data) => {
                    if (selectedRound !== data.round) {
                        setSelectedRound(data.round)
                        setSelectedRaceId(data.raceId)
                        setSelectedCircuitId(data.circuitId)
                        setSelectedDrivers([])
                        setHoveredDriverId(null)
                        setHoveredLap(null)
                    }
                })
                .transition()
                .delay((_, i) => i * 20)
                .duration(300)
                .attr('r', circleRadiusStart)
                .attr('fill', circleFill)
                .attr('stroke', circleStroke)
                .attr('r', circleRadius)
        }

        if (hoveredRound !== prevHoveredRound || selectedRound !== prevSelectedRound) {
            if (prevHoveredRound) {
                svg.select(`#roundNumber-${prevHoveredRound}`)
                    .attr('fill', circleFill)
                    .attr('r', circleRadius)
            }
            
            if (prevSelectedRound) {
                svg.select(`#roundNumber-${prevSelectedRound}`)
                    .attr('fill', circleFill)
                    .attr('r', circleRadius)
            }

            if (hoveredRound) {
                svg.select(`#roundNumber-${hoveredRound}`)
                    .attr('fill', '#ff6666')
                    .attr('r', circleRadiusLarge)
            }
            
            if (selectedRound) {
                svg.select(`#roundNumber-${selectedRound}`)
                    .attr('fill', 'red')
                    .attr('r', circleRadiusLarge)
            }

            svg.selectAll('circle')
                .on('click', (_, data) => {
                    if (selectedRound !== data.round) {
                        setSelectedRound(data.round)
                        setSelectedRaceId(data.raceId)
                        setSelectedCircuitId(data.circuitId)
                        setSelectedDrivers([])
                        setHoveredDriverId(null)
                        setHoveredLap(null)
                    }
                })
        }
    }, [season, hoveredRound, selectedRound])

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