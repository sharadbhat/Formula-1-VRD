import { useState, useEffect } from 'react'
import { Text, Card, Image, Grid, Loader, Table, ScrollArea } from '@mantine/core'

// Utils
import useGlobalStore from '../../utils/store'
import driverIdMapper from '../../utils/driverIdMapper'
import getScrapedDriverData from '../../utils/getScrapedDriverData'

const DriverDetails = () => {
    const selectedDrivers = useGlobalStore(state => state.selectedDrivers)

    const [loading, setLoading] = useState(true)
    const [scrapedDriverData, setScrapedDriverData] = useState(null)

    useEffect(() => {
        async function loadCSV() {
            setLoading(true)
            setScrapedDriverData(await getScrapedDriverData())
            setLoading(false)
        }
        loadCSV()
    }, [])

    return (
        loading
            ? <Loader />
            : (
                <ScrollArea style={{ maxWidth: '95%' }} scrollbarSize={16}>
                    <div style={{ display: 'flex' }}>
                        {selectedDrivers?.map((driver, i) => {
                            return (
                                <Card
                                    id={i}
                                    shadow='sm'
                                    radius='md'
                                    style={{ width: 250, marginRight: 15 }}
                                    withBorder
                                >
                                    <Card.Section>
                                        <Image
                                            src={scrapedDriverData[driver]?.img_url}
                                            alt={driverIdMapper[driver]?.name}
                                            height={200}
                                            fit={'contain'}
                                            withPlaceholder
                                        />
                                    </Card.Section>
                                    <Card.Section>
                                        <div style={{ textAlign: 'center', paddingTop: 5, paddingBottom: 10 }}>
                                            <Text
                                                weight={700}
                                                component='a'
                                                href={driverIdMapper[driver].url}
                                                target='_blank'
                                                style={{ color: '#1c7ed6' }}
                                            >
                                                {driverIdMapper[driver]?.name}
                                            </Text>
                                        </div>
                                    </Card.Section>
                                    <Card.Section>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            paddingBottom: 20
                                        }}
                                        >
                                            <Table style={{ width: '100%' }} striped withBorder withColumnBorders>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ fontWeight: 650, textAlign: 'end', width: 120 }}>Nationality</td>
                                                        <td style={{ width: 150 }}>{driverIdMapper[driver]?.nationality}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ fontWeight: 650, textAlign: 'end', width: 120 }}>Driver Number</td>
                                                        <td style={{ width: 150 }}>{driverIdMapper[driver]?.number}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ fontWeight: 650, textAlign: 'end', width: 120 }}>Driver Code</td>
                                                        <td style={{ width: 150 }}>{driverIdMapper[driver]?.code}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ fontWeight: 650, textAlign: 'end', width: 120 }}>DOB</td>
                                                        <td style={{ width: 150 }}>{driverIdMapper[driver]?.dob}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Card.Section>
                                    {/* <Text size='sm' color='dimmed'>
                                        {scrapedDriverData[driver]?.description}
                                    </Text> */}
                                </Card>
                            )
                        })}
                    </div>
                </ScrollArea>
            )
    )
}

export default DriverDetails