import { useState, useEffect } from 'react'
import { Text, Card, Image, Loader, Table } from '@mantine/core'

// Utils
import useGlobalStore from '../../utils/store'
import getScrapedTrackData from '../../utils/getScrapedTrackData'
import circuitIdMapper from '../../utils/circuitIdMapper'


const TrackDetails = () => {
    const selectedCircuitId = useGlobalStore((state) => state.selectedCircuitId)

    const [loading, setLoading] = useState(true)
    const [scrapedTrackData, setScrapedTrackData] = useState(null)

    useEffect(() => {
        async function loadCSV() {
            setLoading(true)
            setScrapedTrackData(await getScrapedTrackData())
            setLoading(false)
        }
        loadCSV()
    }, [])


    if (selectedCircuitId) {
        return (
            loading
                ? <Loader />
                : <div>
                    <Card
                        shadow='sm'
                        radius='md'
                        style={{ width: 250 }}
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
                                width={200}
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
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                paddingBottom: 20
                            }}>
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
                            </div>
                        </Card.Section>
                    </Card>
                </div>
        )
    }
}

export default TrackDetails