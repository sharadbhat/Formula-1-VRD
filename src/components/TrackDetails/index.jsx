import { useState, useEffect } from 'react'
import { Text, Card, Image, Loader, Table, Collapse, ScrollArea, Box } from '@mantine/core'

// Utils
import useGlobalStore from '../../utils/store'
import getScrapedTrackData from '../../utils/getScrapedTrackData'
import circuitIdMapper from '../../utils/circuitIdMapper'


const TrackDetails = () => {
    const width = window.innerWidth
    const selectedCircuitId = useGlobalStore((state) => state.selectedCircuitId)

    const [loading, setLoading] = useState(true)
    const [scrapedTrackData, setScrapedTrackData] = useState(null)
    const [opened, setOpened] = useState(false)

    useEffect(() => {
        async function loadCSV() {
            setLoading(true)
            setScrapedTrackData(await getScrapedTrackData())
            setLoading(false)
        }
        loadCSV()
    }, [])

    useEffect(() => {
        if (scrapedTrackData?.[selectedCircuitId]?.description === '') {
            setOpened(false)
        }
    }, [selectedCircuitId])

    if (selectedCircuitId) {
        return (
            loading
                ? <Loader />
                : <div>
                    <Card
                        shadow='sm'
                        radius='md'
                        style={{ width: 0.16 * width, maxHeight: 525 }}
                        withBorder
                    >
                        <Card.Section style={{
                            display: 'flex',
                            justifyContent: 'center',
                            paddingTop: 10,
                            paddingBottom: 10,
                            backgroundColor: 'white'
                        }}>
                            <Image
                                src={scrapedTrackData[selectedCircuitId]?.img_url}
                                alt={circuitIdMapper[selectedCircuitId]?.name}
                                width={0.13 * width}
                                fit={'contain'}
                            />
                        </Card.Section>
                        <Card.Section>
                            <div style={{ textAlign: 'center', paddingTop: 5, paddingBottom: 10 }}>
                                <Text
                                    weight={700}
                                    component='a'
                                    href={circuitIdMapper[selectedCircuitId]?.url}
                                    target='_blank'
                                    style={{ color: '#1c7ed6' }}
                                >
                                    {circuitIdMapper[selectedCircuitId]?.name}
                                </Text>
                            </div>
                        </Card.Section>
                        <Card.Section>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 20 }}>
                                <Table style={{ width: '100%' }} striped withBorder withColumnBorders>
                                    <tbody>
                                        <tr>
                                            <td style={{ fontWeight: 650, textAlign: 'end', width: 120 }}>Location</td>
                                            <td style={{ width: 150 }}>{circuitIdMapper[selectedCircuitId]?.location}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 650, textAlign: 'end', width: 120 }}>Country</td>
                                            <td style={{ width: 150 }}>{circuitIdMapper[selectedCircuitId]?.country}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Text style={{ marginTop: 5, cursor: 'pointer', color: '#1c7ed6' }} onClick={() => setOpened((e) => !e)}>{opened ? 'Hide Description' : 'View Description'}</Text>
                                <Collapse in={opened}>
                                    <Box sx={(theme) => ({
                                        backgroundColor: theme.colors.dark[4],
                                        padding: 10,
                                        margin: 5,
                                        borderRadius: 5
                                    })}>
                                        <ScrollArea style={{ height: 150 }}>
                                            <Text style={{ textAlign: 'center' }}>
                                                {scrapedTrackData[selectedCircuitId]?.description}
                                            </Text>
                                        </ScrollArea>
                                    </Box>
                                </Collapse>
                            </div>
                        </Card.Section>
                    </Card>
                </div>
        )
    }
}

export default TrackDetails