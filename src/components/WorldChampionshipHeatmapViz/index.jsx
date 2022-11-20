import { useState } from 'react'
import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import driverIdMap from '../../utils/driverIdMapper'
import constructorIdMap from '../../utils/constructorIdMapper'
import constants from '../../utils/constants'

// Assets
import gradientImage from '../../assets/inferno.png'

const WorldChampionshipHeatmapViz = ({ raceList, data, season, isWCC }) => {
    let key = 'driverId'
    let id = 'WDCHeatmapViz'
    let mapper = driverIdMap

    if (isWCC) {
        key = 'constructorId'
        id = 'WCCHeatmapViz'
        mapper = constructorIdMap
    }

    const [name, setName] = useState(null)
    const [currentRound, setCurrentRound] = useState(null)
    const [currentPoints, setCurrentPoints] = useState(null)
    const [roundToNameMap, setRoundToNameMap] = useState({})

    const [legendMax, setLegendMax] = useState(null)

    const svgWidth = 1000
    const svgHeight = isWCC ? 500 : 750

    const legendHeight = 30
    const legendWidth = 125

    const offsetX = 175
    const offsetY = 100

    const cardHeight = 120
    const cardWidth = 250
    const cardCornerRadius = constants.cardCornerRadius
    const cardColor = constants.cardColor

    const ref = useD3(svg => {
        setRoundToNameMap({})
        const roundMap = {}
        for (const race of raceList) {
            roundMap[+race.round] = race.name
        }
        setRoundToNameMap(roundMap)

        const roundsList = []
        for (let i = 1; i <= d3.max(raceList.map(d => +d.round)); i++) {
            roundsList.push(i)
        }

        const xScale = d3.scaleBand()
                    .domain(roundsList)
                    .range([offsetX, svgWidth])
                    .padding(0.05)
        
        const groupedData = d3.group(data, d => +d[key])
        for (const group of groupedData) {
            for (let i = group[1].length - 1; i > 0; i--) {
                group[1][i]['points'] = group[1][i]['cumulativePoints'] - group[1][i - 1]['cumulativePoints']
            }
        }

        const sortedIds = d3.groupSort(data, (a, b) => d3.descending(d3.max(a, d => d.cumulativePoints), d3.max(b, d => d.cumulativePoints)), d => +d[key])

        const yScale = d3.scaleBand()
                    .domain(sortedIds)
                    .range([offsetY, svgHeight])
                    .padding(0.05)
        
        const colorScale = d3.scaleSequential()
                        .domain([0, d3.max(data.map(d => +d.points))])
                        .interpolator(d3.interpolateInferno)

        setLegendMax(colorScale.domain()[1])

        svg.select('#content')
            .selectAll('rect')
            .data(data)
            .join('rect')
            .attr('driverId', d => +d[key])
            .attr('id', d => `${id}-${d[key]}-${d.round}`)
            .style('fill', colorScale(0))
            .attr('x', d => xScale(d.round))
            .attr('y', d => yScale(d[key]))
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('stroke-width', 4)
            .style('stroke', 'none')
            .style('opacity', 1)
            .on('mouseenter', (e, d) => {
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

                setName(mapper[d[key]].name)
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
            .on('mouseleave', e => {
                svg.select(`#${e.target.id}`)
                    .style('stroke', '')

                // Hide card group
                svg.select('#hover-card-group')
                    .attr('visibility', 'hidden')
            })
            .transition()
            .duration(500)
            .delay((_, i) => i)
            .style('fill', d => colorScale(+d.points))

        svg.select('#participants')
            .selectAll('text')
            .data(groupedData)
            .join('text')
            .attr('fill', 'white')
            .attr('text-anchor', 'end')
            .attr('x', offsetX - 10)
            .attr('y', d => yScale(d[0]) + yScale.bandwidth() / 2 + 4)
            .attr('opacity', 0)
            .text(d => mapper[d[0]].name)
            .transition()
            .delay(d => yScale(d[0]))
            .attr('opacity', 1)
        
        svg.select('#rounds')
            .selectAll('text')
            .data(roundsList)
            .join('text')
            .attr('fill', 'white')
            .attr('text-anchor', 'start')
            .attr('x', -offsetY + 10)
            .attr('y', d => xScale(d))
            .attr('transform', () => `translate(${xScale.bandwidth() / 2 + 5}, 0), rotate(-90)`)
            .attr('opacity', 0)
            .text(d => `Round ${d}`)
            .transition()
            .delay((_, i) => i * 20)
            .attr('opacity', 1)
        
        svg.select('#legend')
            .attr('transform', `translate(${offsetX / 2 - legendWidth / 2}, ${(offsetY / 2 - legendHeight / 2) + 30})`)
    }, [season])

    return (
        <svg ref={ref} style={{ width: svgWidth, height: svgHeight }}>
            <g id='content' />
            <g id='rounds' />
            <g id='participants' />
            <g id='legend'>
                <image width={125} href={gradientImage} />
                <text id='legend-min' fill='white' y={-10}>0</text>
                <text id='legend-max' fill='white' x={125 - 10} y={-10}>{legendMax}</text>
            </g>
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
                        id='hover-card-name'
                        textAnchor='middle'
                        fill='white'
                        x={cardWidth / 2}
                        y={cardHeight / 4}
                        fontWeight={700}
                    >
                        {name}
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

export default WorldChampionshipHeatmapViz