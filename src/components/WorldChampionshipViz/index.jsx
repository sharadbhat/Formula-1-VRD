import { useState } from 'react'
import { usePrevious } from '@mantine/hooks'
import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import driverIdMap from '../../utils/driverIdMapper'
import constructorIdMap from '../../utils/constructorIdMapper'
import constants from '../../utils/constants'
import useGlobalStore from '../../utils/store'

const WorldChampionshipViz = ({ raceList, data, season, isWCC }) => {
    const selectedParticipants = useGlobalStore(state => state.selectedParticipants)
    const setSelectedParticipants = useGlobalStore(state => state.setSelectedParticipants)
    const hoveredRound = useGlobalStore(state => state.hoveredRound)
    const setHoveredRound = useGlobalStore(state => state.setHoveredRound)
    const hoveredParticipant = useGlobalStore(state => state.hoveredParticipant)
    const setHoveredParticipant = useGlobalStore(state => state.setHoveredParticipant)

    let mapper = driverIdMap
    let key = 'driverId'
    let id = 'WDCVizDriverId'

    if (isWCC) {
        mapper = constructorIdMap
        key = 'constructorId'
        id = 'WCCVizConstructorId'
    }

    const selectedParticipantsSet = new Set(selectedParticipants)

    const prevSeason = usePrevious(season)
    const prevIsWCC = usePrevious(isWCC)
    const prevSelectedParticipants = usePrevious(selectedParticipants)
    const prevHoveredParticipant = usePrevious(hoveredParticipant)
    const prevHoveredRound = usePrevious(hoveredRound)

    const [name, setName] = useState(null)
    const [currentPoints, setCurrentPoints] = useState(null)
    const [roundToNameMap, setRoundToNameMap] = useState({})

    const svgWidth = 700
    const svgHeight = isWCC ? 500 : 700

    const cardHeight = 120
    const cardWidth = 250
    const cardCornerRadius = constants.cardCornerRadius
    const cardColor = constants.cardColor

    const margin = 30
    const padding = 10

    const ref = useD3(svg => {
        if (season !== prevSeason || isWCC !== prevIsWCC || hoveredRound !== prevHoveredRound) {
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
                .range([padding, svgWidth - margin])

            const xScaleLinear = d3.scaleLinear()
                .domain([0, d3.max(data, d => +d.round)])
                .range([padding, svgWidth - margin])

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data.map(d => +d.cumulativePoints))])
                .range([svgHeight - margin, padding])

            svg.select('#xAxis')
                .attr('transform', `translate(${margin - padding}, ${svgHeight - margin})`)
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

            svg.select('#content')
                .selectAll('path')
                .data(groupedData)
                .join('path')
                .attr('id', d => `${id}-${d[0]}`)
                .attr(key, d => +d[0])
                .attr('fill', 'none')
                .attr('stroke', d => colorScale(+d[0]))
                .attr('stroke-width', d => hoveredParticipant === +d[0] ? 10 : 5)
                .attr('opacity', d => selectedParticipantsSet.size ? (selectedParticipantsSet.has(+d[0]) ? 1 : 0.2) : 1)
                .attr('d', d => {
                    return d3.line()
                        .x(d => margin + xScale(+d.round) - padding)
                        .y(d => yScale(+d.cumulativePoints))
                        .curve(d3.curveMonotoneX)
                        (d[1])
                })
                .on('mouseenter', (e, data) => {
                    setHoveredParticipant(data[0])
                    let [xPosition, yPosition] = d3.pointer(e)

                    const currentId = +e.target.getAttribute(key)
                    const closestRound = Math.round(xScaleLinear.invert(xPosition - margin))
                    const datapoint = groupedData.get(currentId)[closestRound + 1]

                    setName(mapper[e.target.getAttribute(key)].name)
                    setCurrentPoints(datapoint['cumulativePoints'])
                    setHoveredRound(closestRound)

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
                    const closestRound = Math.round(xScaleLinear.invert(xPosition - margin))
                    const datapoint = groupedData.get(currentId)[closestRound + 1]

                    setCurrentPoints(datapoint['cumulativePoints'])
                    setHoveredRound(closestRound)

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
                .on('mouseleave', () => {
                    setHoveredParticipant(null)
                    // Hide card group
                    svg.select('#hover-card-group')
                        .attr('visibility', 'hidden')
                })
                .on('click', (_, data) => {
                    if (selectedParticipantsSet.has(data[0])) {
                        selectedParticipantsSet.delete(data[0])
                    } else {
                        selectedParticipantsSet.add(data[0])
                    }
                    setSelectedParticipants(selectedParticipantsSet)
                })

            svg.on('mouseenter', e => {
                let [xPosition] = d3.pointer(e)

                let [xScaleStart, xScaleEnd] = xScaleLinear.domain()

                let closestRound = Math.round(xScaleLinear.invert(xPosition - margin + padding))

                if (closestRound > xScaleEnd) {
                    closestRound = xScaleEnd
                } else if (closestRound < xScaleStart) {
                    closestRound = xScaleStart
                }
                setHoveredRound(closestRound)
            }).on('mousemove', e => {
                let [xPosition] = d3.pointer(e)

                let [xScaleStart, xScaleEnd] = xScaleLinear.domain()

                let closestRound = Math.round(xScaleLinear.invert(xPosition - margin + padding))

                if (closestRound > xScaleEnd) {
                    closestRound = xScaleEnd
                } else if (closestRound < xScaleStart) {
                    closestRound = xScaleStart
                }
                setHoveredRound(closestRound)
            }).on('mouseleave', () => {
                setHoveredRound(null)
            })

            let hoverLinePosition = xScale(hoveredRound) + margin - padding

            svg.select('#hoverLine')
                .attr('visibility', hoveredRound ? 'visible' : 'hidden')
                .attr('x1', hoverLinePosition)
                .attr('x2', hoverLinePosition)
        }

        if (selectedParticipants !== prevSelectedParticipants) {
            svg.select('#content')
                .selectAll('path')
                .on('click', (_, data) => {
                    if (selectedParticipantsSet.has(data[0])) {
                        selectedParticipantsSet.delete(data[0])
                    } else {
                        selectedParticipantsSet.add(data[0])
                    }
                    setSelectedParticipants(selectedParticipantsSet)
                })

            if (selectedParticipants.length) {
                svg.select('#content')
                    .selectAll('path')
                    .attr('opacity', 0.2)

                for (const participant of selectedParticipants) {
                    svg.select('#content')
                        .select(`#${id}-${participant}`)
                        .attr('opacity', 1)
                }
            } else {
                svg.select('#content')
                    .selectAll('path')
                    .attr('opacity', 1)
            }
        }

        if (hoveredParticipant !== prevHoveredParticipant) {
            if (prevHoveredParticipant) {
                svg.select(`#${id}-${prevHoveredParticipant}`)
                    .attr('stroke-width', 5)
            }

            if (hoveredParticipant) {
                svg.select(`#${id}-${hoveredParticipant}`)
                    .attr('stroke-width', 10)
            }
        }
    }, [season, isWCC, selectedParticipants, hoveredParticipant, hoveredRound])

    return (
        <svg ref={ref} style={{ width: svgWidth, height: svgHeight, marginTop: 25 }}>
            <g id='xAxis' />
            <g id='yAxis' />
            <line
                id='hoverLine'
                x1={0}
                x2={0}
                y1={padding}
                y2={svgHeight - margin}
                stroke={'gray'}
                strokeWidth={5}
                opacity={0.75}
                visibility={'hidden'}
            />
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
                        Round: {hoveredRound}
                    </text>
                    <text
                        id='hover-card-current-lap'
                        textAnchor='middle'
                        fill='white'
                        x={cardWidth / 2}
                        y={cardHeight / 2 + 20}
                    >
                        {roundToNameMap[hoveredRound]}
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