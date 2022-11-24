import { useState } from 'react'
import { usePrevious } from '@mantine/hooks'
import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import driverIdMap from '../../utils/driverIdMapper'
import constructorIdMap from '../../utils/constructorIdMapper'
import constants from '../../utils/constants'
import useGlobalStore from '../../utils/store'

// Assets
import gradientImage from '../../assets/inferno.png'

const WorldChampionshipHeatmapViz = ({ raceList, data, season, isWCC }) => {
    const selectedParticipants = useGlobalStore(state => state.selectedParticipants)
    const setSelectedParticipants = useGlobalStore(state => state.setSelectedParticipants)
    const selectedRound = useGlobalStore(state => state.selectedRound)
    const setHoveredRound = useGlobalStore(state => state.setHoveredRound)
    const setSelectedRound = useGlobalStore(state => state.setSelectedRound)
    const setSelectedRaceId = useGlobalStore(state => state.setSelectedRaceId)
    const setHoveredParticipant = useGlobalStore(state => state.setHoveredParticipant)

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

    const svgWidth = 750
    const svgHeight = isWCC ? 500 : 700

    const legendHeight = 30
    const legendWidth = 125

    const offsetX = 175
    const offsetY = 100

    const cardHeight = 120
    const cardWidth = 250
    const cardCornerRadius = constants.cardCornerRadius
    const cardColor = constants.cardColor

    const prevSeason = usePrevious(season)
    const prevIsWCC = usePrevious(isWCC)
    const prevSelectedRound = usePrevious(selectedRound)
    const prevSelectedParticipants = usePrevious(selectedParticipants)

    const selectedParticipantsSet = new Set(selectedParticipants)

    const ref = useD3(svg => {
        if (season !== prevSeason || isWCC !== prevIsWCC) {
            setRoundToNameMap({})
            const roundMap = {}
            for (const race of raceList) {
                roundMap[+race.round] = race.name
            }
            setRoundToNameMap(roundMap)
    
            const roundsList = []
            for (const race of raceList) {
                roundsList.push({
                    round: +race.round,
                    raceId: +race.raceId
                })
            }
    
            const xScale = d3.scaleBand()
                        .domain(roundsList.map(d => d.round))
                        .range([offsetX, svgWidth])
                        .padding(0.05)
            
            const groupedData = d3.group(data, d => +d[key])
            for (const group of groupedData) {
                for (let i = group[1].length - 1; i > 0; i--) {
                    group[1][i]['points'] = group[1][i]['cumulativePoints'] - group[1][i - 1]['cumulativePoints']
                }
            }
    
            const participantColorScale = d3.scaleOrdinal()
                .domain(Array.from(groupedData.keys()))
                .range(constants.categoricalColors)

            const sortedIds = d3.groupSort(data, (a, b) => d3.descending(d3.max(a, d => d.cumulativePoints), d3.max(b, d => d.cumulativePoints)), d => +d[key])
    
            const yScale = d3.scaleBand()
                        .domain(sortedIds)
                        .range([offsetY, svgHeight])
                        .padding(0.05)
            
            const colorScale = d3.scaleSequential()
                            .domain([0, d3.max(data.map(d => +d.points))])
                            .interpolator(d3.interpolateInferno)
    
            setLegendMax(colorScale.domain()[1] || null)
    
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
                .attr('class', d => `round-${d.round}`)
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
                .attr('id', d => `${id}-participant-header-${d[0]}`)
                .attr('fill', d => participantColorScale(d[0]))
                .attr('text-anchor', 'end')
                .attr('x', offsetX - 10)
                .attr('y', d => yScale(d[0]) + yScale.bandwidth() / 2 + 4)
                .attr('opacity', 0)
                .text(d => mapper[d[0]].name)
                .style('cursor', 'pointer')
                .on('mouseenter', (_, data) => {
                    setHoveredParticipant(data[0])
                })
                .on('mouseleave', () => {
                    setHoveredParticipant(null)
                })
                .on('click', (_, data) => {
                    if (selectedParticipantsSet.has(data[0])) {
                        selectedParticipantsSet.delete(data[0])
                    } else {
                        selectedParticipantsSet.add(data[0])
                    }
                    setSelectedParticipants(selectedParticipantsSet)
                })
                .transition()
                .delay(d => yScale(d[0]))
                .attr('opacity', 1)
            
            svg.select('#rounds')
                .selectAll('text')
                .data(roundsList)
                .join('text')
                .attr('id', d => `${id}-round-header-${d.round}`)
                .attr('fill', 'white')
                .attr('text-anchor', 'start')
                .attr('x', -offsetY + 10)
                .attr('y', d => xScale(d.round))
                .attr('transform', () => `translate(${xScale.bandwidth() / 2 + 5}, 0), rotate(-90)`)
                .attr('opacity', 0)
                .text(d => `Round ${d.round}`)
                .style('cursor', 'pointer')
                .on('mouseenter', (_, data) => {
                    setHoveredRound(data.round)
                }).on('mouseleave', () => {
                    setHoveredRound(null)
                }).on('click', (_, data) => {
                    setSelectedRound(data.round)
                    setSelectedRaceId(data.raceId)
                })
                .transition()
                .delay((_, i) => i * 20)
                .attr('opacity', 1)
            
            svg.select('#legend')
                .attr('transform', `translate(${offsetX / 2 - legendWidth / 2}, ${(offsetY / 2 - legendHeight / 2) + 30})`)
        }

        if (selectedRound !== prevSelectedRound) {
            if (prevSelectedRound) {
                svg.select(`#${id}-round-header-${prevSelectedRound}`)
                    .attr('font-weight', 500)
            }

            if (selectedRound) {
                svg.select(`#${id}-round-header-${selectedRound}`)
                    .attr('font-weight', 700)
            }
        }

        if (selectedParticipants !== prevSelectedParticipants) {
            svg.select('#participants')
                .selectAll('text')
                .on('click', (_, data) => {
                    if (selectedParticipantsSet.has(data[0])) {
                        selectedParticipantsSet.delete(data[0])
                    } else {
                        selectedParticipantsSet.add(data[0])
                    }
                    setSelectedParticipants(selectedParticipantsSet)
                })

            if (selectedParticipants.length) {
                svg.select('#participants')
                    .selectAll('text')
                    .attr('opacity', 0.2)

                for (const participant of selectedParticipants) {
                    svg.select('#participants')
                        .select(`#${id}-participant-header-${participant}`)
                        .attr('opacity', 1)
                }
            } else {
                svg.select('#participants')
                    .selectAll('text')
                    .attr('opacity', 1)
            }
        }
    }, [season, isWCC, selectedRound, selectedParticipants])

    return (
        <svg ref={ref} style={{ width: svgWidth, height: svgHeight }}>
            <g id='content' />
            <g id='rounds' />
            <g id='participants' />
            <g id='legend' visibility={season ? 'visible' : 'hidden'}>
                <image width={125} href={gradientImage} />
                <text id='legend-min' fill='white' textAnchor='middle' y={-10}>0</text>
                <text id='legend-points' fill='white' textAnchor='middle' x={125/2} y = {-10}>Points</text>
                <text id='legend-max' fill='white' textAnchor='middle' x={125} y={-10}>{legendMax}</text>
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