import { useState } from 'react'
import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import driverIdMapper from '../../utils/driverIdMapper'
import constants from '../../utils/constants'

const WDCHeatmapViz = ({ raceList, data }) => {
    const [driverName, setDriverName] = useState(null)
    const [currentRound, setCurrentRound] = useState(null)
    const [currentPoints, setCurrentPoints] = useState(null)
    const [roundToNameMap, setRoundToNameMap] = useState({})

    const svgWidth = 1000
    const svgHeight = 500

    const cardHeight = 120
    const cardWidth = 250
    const cardCornerRadius = constants.cardCornerRadius
    const cardColor = constants.cardColor

    const ref = useD3(svg => {
        setRoundToNameMap({})
        let roundMap = {}
        for (const race of raceList) {
            roundMap[+race.round] = race.name
        }
        setRoundToNameMap(roundMap)

        let roundsList = []
        for (let i = 1; i <= d3.max(raceList.map(d => +d.round)); i++) {
            roundsList.push(i)
        }

        let xScale = d3.scaleBand()
                    .domain(roundsList)
                    .range([0, svgWidth])
                    .padding(0.05)
        
        const groupedData = d3.group(data, d => +d.driverId)
        for (const group of groupedData) {
            for (let i = group[1].length - 1; i > 0; i--) {
                group[1][i]['points'] = group[1][i]['cumulativePoints'] - group[1][i - 1]['cumulativePoints']
            }
        }

        const sortedDriverIds = d3.groupSort(data, (a, b) => d3.descending(d3.max(a, d => d.cumulativePoints), d3.max(b, d => d.cumulativePoints)), d => +d.driverId)

        let yScale = d3.scaleBand()
                    .domain(sortedDriverIds)
                    .range([0, svgHeight])
                    .padding(0.05)
        
        let colorScale = d3.scaleSequential()
                        .domain([0, d3.max(data.map(d => +d.points))])
                        .interpolator(d3.interpolateInferno)

        svg.select('#content')
            .selectAll('rect')
            .data(data)
            .join('rect')
            .attr('driverId', d => +d.driverId)
            .attr('id', d => `WDCHeatmapViz-${d.driverId}-${d.round}`)
            .attr('x', d => xScale(d.round))
            .attr('y', d => yScale(d.driverId))
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('width', xScale.bandwidth() )
            .attr('height', yScale.bandwidth() )
            .style('fill', d => colorScale(d.points) )
            .style('stroke-width', 4)
            .style('stroke', 'none')
            .style('opacity', 1)
            .on('mouseover', (e, d) => {
                svg.select(`#${e.target.id}`)
                    .style('stroke', 'black')

                // Show card
                svg.select('#hover-card-group')
                    .attr('visibility', 'visible')
                
                let [xPosition, yPosition] = d3.pointer(e)

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

                setDriverName(driverIdMapper[d['driverId']].name)
                setCurrentPoints(d['points'])
                setCurrentRound(d['round'])
            })
            .on('mousemove', e => {
                let [xPosition, yPosition] = d3.pointer(e)

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
            .on('mouseout', e => {
                svg.select(`#${e.target.id}`)
                    .style('stroke', '')

                // Hide card group
                svg.select('#hover-card-group')
                    .attr('visibility', 'hidden')
            })

    }, [data.length])

    return (
        <svg ref={ref} style={{ width: svgWidth, height: svgHeight }}>
            <g id='content' />
            <g id='hover-card-group' visibility={'hidden'}>
                <rect
                    id='hover-card'
                    fill={cardColor}
                    height={cardHeight}
                    width={cardWidth}
                    rx={cardCornerRadius}
                    ry={cardCornerRadius}
                />
                <g id='hover-card-content-group'>
                    <text
                        id='hover-card-driver-name'
                        textAnchor='middle'
                        fill='white'
                        x={cardWidth / 2}
                        y={cardHeight / 4}
                        fontWeight={700}
                    >
                        {driverName}
                    </text>
                    <text
                        id='hover-card-current-points'
                        textAnchor='middle'
                        fill='white'
                        x={cardWidth / 2}
                        y={cardHeight / 2 - 5}
                    >
                        Points: {currentPoints}
                    </text>
                    <text
                        id='hover-card-current-lap'
                        textAnchor='middle'
                        fill='white'
                        x={cardWidth / 2}
                        y={cardHeight / 2 + 20}
                    >
                        Round: {currentRound}
                    </text>
                    <text
                        id='hover-card-current-lap'
                        textAnchor='middle'
                        fill='white'
                        x={cardWidth / 2}
                        y={3 * cardHeight / 4 + 15}
                    >
                        {roundToNameMap[currentRound]}
                    </text>
                </g>
            </g>
        </svg>
    )
}

export default WDCHeatmapViz