import { useState } from 'react'
import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import driverIdMap from '../../utils/driverIdMapper'
import constructorIdMap from '../../utils/constructorIdMapper'
import constants from '../../utils/constants'

const WorldChampionshipViz = ({ raceList, data, season, isWCC }) => {
    let mapper = driverIdMap
    let key = 'driverId'
    let id = 'WDCVizDriverId'

    if (isWCC) {
        mapper = constructorIdMap
        key = 'constructorId'
        id = 'WCCVizConstructorId'
    }

    const selectedPaths = new Set()

    const [name, setName] = useState(null)
    const [currentRound, setCurrentRound] = useState(null)
    const [currentPoints, setCurrentPoints] = useState(null)
    const [roundToNameMap, setRoundToNameMap] = useState({})

    const svgWidth = 1000
    const svgHeight = 500

    const cardHeight = 120
    const cardWidth = 250
    const cardCornerRadius = constants.cardCornerRadius
    const cardColor = constants.cardColor

    const margin = 30

    const ref = useD3(svg => {
        setRoundToNameMap({})
        const roundMap = {}
        for (const race of raceList) {
            roundMap[+race.round] = race.name
        }
        setRoundToNameMap(roundMap)

        const roundsList = []
        for (let i = 0; i <= d3.max(raceList.map(d => +d.round)); i++) {
            roundsList.push(i)
        }

        const xScale = d3.scalePoint()
            .domain(roundsList)
            .range([0, svgWidth - margin])

        const xScaleLinear = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.round)])
            .range([0, svgWidth - margin])

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => +d.cumulativePoints))])
            .range([svgHeight - margin, 0])

        svg.select('#xAxis')
            .attr('transform', `translate(${margin}, ${svgHeight - margin})`)
            .attr('stroke-width', 2)
            .transition()
            .duration(500)
            .call(d3.axisBottom(xScale))

        svg.select('#yAxis')
            .attr('transform', `translate(${margin}, 0)`)
            .attr('stroke-width', 2)
            .transition()
            .duration(500)
            .call(d3.axisLeft(yScale))
        
        const groupedData = d3.group(data, d => +d[key])

        for (const group of groupedData) {
            group[1].unshift({
                [key]: +group[0],
                raceId: 0,
                cumulativePoints: 0,
                round: 0
            })
        }

        const colorScale = d3.scaleOrdinal()
            .domain(Array.from(groupedData.keys()))
            .range(constants.categoricalColors)

        const bisect = d3.bisector(d => +d.round).left

        svg.select('#content')
            .selectAll('path')
            .data(groupedData)
            .join('path')
            .attr('id', d => `${id}-${d[0]}`)
            .attr(key, d => +d[0])
            .attr('fill', 'none')
            .attr('stroke', d => colorScale(+d[0]))
            .attr('stroke-width', 5)
            .attr('d', d => {
                return d3.line()
                    .x(d => margin + xScale(+d.round))
                    .y(d => yScale(+d.cumulativePoints))
                    (d[1])
            })
            .on('mouseover', e => {
                // Thicker line
                svg.select(`#${e.target.id}`)
                    .transition()
                    .duration(500)
                    .attr('stroke-width', 10)

                let [xPosition, yPosition] = d3.pointer(e)

                const currentId = +e.target.getAttribute(key)
                const closestLap = xScaleLinear.invert(xPosition - margin)
                const index = bisect(groupedData.get(currentId), closestLap)
                const datapoint = groupedData.get(currentId)[index]

                setName(mapper[e.target.getAttribute(key)].name)
                setCurrentPoints(datapoint['cumulativePoints'])
                setCurrentRound(datapoint['round'])

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

                // Show card
                svg.select('#hover-card-group')
                    .attr('visibility', 'visible')
                    .attr('transform', `translate(${xPosition}, ${yPosition})`)
            })
            .on('mousemove', e => {
                let [xPosition, yPosition] = d3.pointer(e)

                const currentId = +e.target.getAttribute(key)
                const closestLap = xScaleLinear.invert(xPosition - margin)
                const index = bisect(groupedData.get(currentId), closestLap)
                const datapoint = groupedData.get(currentId)[index]

                setCurrentPoints(datapoint['cumulativePoints'])
                setCurrentRound(datapoint['round'])

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
                // Reset line thickness
                svg.select(`#${e.target.id}`)
                    .transition()
                    .duration(500)
                    .attr('stroke-width', 5)

                // Hide card group
                svg.select('#hover-card-group')
                    .attr('visibility', 'hidden')
            })
            .on('click', e => {
                if (selectedPaths.has(e.target.id)) {
                    selectedPaths.delete(e.target.id)
                    svg.select(`#${e.target.id}`)
                        .attr('opacity', 0.2)

                    // If no line selected, reset opacity of all lines
                    if (selectedPaths.size === 0) {
                        svg.select('#content')
                            .selectAll('path')
                            .attr('opacity', 1)
                    }
                } else {
                    selectedPaths.add(e.target.id)
                    if (selectedPaths.size === 1) {
                        // Reduce opacity of all lines
                        svg.select('#content')
                            .selectAll('path')
                            .attr('opacity', 0.2)
                    }

                    // Reset opacity of selected line
                    svg.select(`#${e.target.id}`)
                        .attr('opacity', 1)
                }
            })
    }, [season])

    return (
        <svg ref={ref} style={{ width: svgWidth, height: svgHeight }}>
            <g id='xAxis' />
            <g id='yAxis' />
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
                        id='hover-card-current-lap'
                        textAnchor='middle'
                        fill='white'
                        x={cardWidth / 2}
                        y={cardHeight / 2 - 5}
                    >
                        Round: {currentRound}
                    </text>
                    <text
                        id='hover-card-current-lap'
                        textAnchor='middle'
                        fill='white'
                        x={cardWidth / 2}
                        y={cardHeight / 2 + 20}
                    >
                        {roundToNameMap[currentRound]}
                    </text>
                    <text
                        id='hover-card-current-position'
                        textAnchor='middle'
                        fill='white'
                        x={cardWidth / 2}
                        y={3 * cardHeight / 4 + 15}
                    >
                        Points: {currentPoints}
                    </text>
                </g>
            </g>
        </svg>
    )
}

export default WorldChampionshipViz