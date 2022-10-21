import { Button, Center, List, Table } from '@mantine/core'

// Utils
import { getSketchFilePath } from '../../utils/getFilePath'

// CSS
import './styles.css'

const ProcessBook = () => {
  return (
    <Center>
        <div className='process-book-container'>
            <Center>
                <h1>Process Book</h1>
            </Center>
            <div className='process-book-proposal-header'>
                <div style={{ width: 110 }} />
                <div>
                    <h2>Proposal</h2>
                </div>
                <Button
                    style={{ width: 110 }}
                    variant={'light'}
                    color='gray'
                    component='a'
                    target={'_blank'}
                    href='https://raw.githubusercontent.com/sharadbhat/Formula-1-VRD/main/docs/Proposal.pdf'
                >
                    Download
                </Button>
            </div>
            <h3>Basic Information</h3>
            <div className='process-book-pl-50'>
                <div>
                    <b>Title:</b> Formula 1 VRD (Visualized Racing Data)
                </div>
                <div className='process-book-mt-20'>
                    <b>UIDs</b>
                    <div className='process-book-table-container'>
                        <Table withBorder highlightOnHover withColumnBorders>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>UID</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Alex Liebig</td>
                                    <td>u1072962</td>
                                </tr>
                                <tr>
                                    <td>Sharad Bhat</td>
                                    <td>u1418984</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className='process-book-mt-20'>
                    <b>Email Addresses</b>
                    <div className='process-book-table-container'>
                        <Table withBorder highlightOnHover withColumnBorders>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Alex Liebig</td>
                                    <td><a href='mailto:u1072962@utah.edu' target={'_blank'}>u1072962@utah.edu</a></td>
                                </tr>
                                <tr>
                                    <td>Sharad Bhat</td>
                                    <td><a href='mailto:u1418984@utah.edu' target={'_blank'}>u1418984@utah.edu</a></td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className='process-book-mt-20'>
                    <b>GitHub Reposity:</b> <a href='https://github.com/sharadbhat/Formula-1-VRD' target={'_blank'}>https://github.com/sharadbhat/Formula-1-VRD</a>
                </div>
            </div>
            <h3>Background and Motivation</h3>
            <div className='process-book-pl-50 process-book-justify'>
                <p>A big part of the reason why we chose to visualize Formula 1 was due to our love for cars and passion for racing. Formula 1 has always been a sport of numbers, where milliseconds determine who's the champion. Visualizing these numbers in a graphical user interface will truly help with understanding the different trends in Formula 1. With this project we hope to spark interest in more Americans, and encourage them to start watching Formula 1.</p>
            </div>
            <h3>Project Objectives</h3>
            <div className='process-book-pl-50'>
                <List>
                    <List.Item>What are some trends seen throughout the history of Formula 1?</List.Item>
                    <List.Item>How do drivers across multiple eras of Formula 1 compare?</List.Item>
                    <List.Item>How do drivers and teams perform as the season progresses?</List.Item>
                    <List.Item>How do drivers perform in a given race?</List.Item>
                    <List.Item>How do drivers compare in a given race?</List.Item>
                </List>
            </div>
            <h3>Data</h3>
            <div className='process-book-pl-50'>
                <p>The original API is the Ergast Developer API</p>
                <p>API Link - <a href='http://ergast.com/mrd/' target={'_blank'}>Ergast Developer API</a></p>
                <p>We will be using the dataset available on Kaggle.</p>
                <p>Kaggle Dataset Link - <a href='https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020' target={'_blank'}>Formula 1 World Championship (1950 - 2022) | Kaggle</a></p>
            </div>
            <h3>Data Processing</h3>
            <div className='process-book-pl-50 process-book-justify'>
                <p>We expect minimal data cleanup. To try and reduce data file size, we intend to remove unused columns from multiple files. Since processing is a one-time activity, we plan to use plain JavaScript or Python.</p>
                <p>We will also need to scrape and generate some additional data. We will use Python and Beautiful Soup 4 to do this.</p>
            </div>
            <h3>Visualization Design</h3>
            <div>
                <img width={700} src={getSketchFilePath('draft1.jpg')} />
                <img className='process-book-mt-30' width={700} src={getSketchFilePath('draft2.jpg')} />
                <img className='process-book-mt-30' width={700} src={getSketchFilePath('draft3.jpg')} />
                <img className='process-book-mt-30' width={700} src={getSketchFilePath('PointsProgression.jpg')} />
                <img className='process-book-mt-30' width={700} src={getSketchFilePath('race_position_graph.jpg')} />
                <img className='process-book-mt-30' width={700} src={getSketchFilePath('laptimes.jpg')} />
                <img className='process-book-mt-30' width={700} src={getSketchFilePath('heatmap.jpg')} />
                <img className='process-book-mt-30' width={700} src={getSketchFilePath('Homepage - Race List with Map.jpg')} />
                <img className='process-book-mt-30' width={700} src={getSketchFilePath('HomePage - Season Selected.jpg')} />
                <img className='process-book-mt-30' width={700} src={getSketchFilePath('homepage_race_data.jpg')} />
            </div>
            <h3>Visualization Design Description</h3>
            <div className='process-book-pl-50 process-book-justify'>
                <List>
                    <List.Item>In general, we want to layer our project in a manner that starts with describing world data, data by season, and then individual race data. In addition, we also want to add scroll effects that allow the user to view Formula 1 data in a smooth and efficient manner. This will include animations and other visual aspects as we progress through this project. In the beginning, we want to mainly focus on displaying the data accurately before adding more visual elements.</List.Item>
                    <List.Item>Although most of the graphs are very straight forward, the heat map and the scatter plot paired with the cumulative graph are unique.</List.Item>
                    <List.Item>The heat map makes sense in this case because it uses brightness and hue as a different channel that, quite literally, makes the tiles look “hot.” The intensity of the “heat” emphasizes which driver is scoring the majority of the points in each race.</List.Item>
                    <List.Item>The scatter plot, on the other hand, showcases each individual lap as a point on the time scale helping the viewer compare multiple drivers on a per-lap basis. In addition to the scatter plot, the cumulative graph shows the total race time of each driver at any given lap. Using the two graphs simultaneously, the user can correlate how a given lap contributed to a driver's overall race performance.</List.Item>
                </List>
            </div>
            <h3>Must Have Features</h3>
            <div className='process-book-pl-50 process-book-justify'>
                <List>
                    <List.Item>View F1 history trends on homepage when no season is selected. Eg: Championships won by different drivers throughout the years.</List.Item>
                    <List.Item>Ability to select a season from a dropdown.</List.Item>
                    <List.Item>Visualizing season-level data. Eg: Graphs for race-by-race points for WDC and WCC.</List.Item>
                    <List.Item>Visualizing race-level data. Eg: Graphs for lap-by-lap position in a race.</List.Item>
                    <List.Item>Visualizing driver comparison in a race. Eg: Scatter plot of lap times.</List.Item>
                    <List.Item>World map that shows the different races in a season. With connecting lines between them. Locations are clickable, visualizing the selected race when clicked.</List.Item>
                </List>
            </div>
            <h3>Optional Features</h3>
            <div className='process-book-pl-50 process-book-justify'>
                <List>
                    <List.Item>Graph animations.</List.Item>
                    <List.Item>Pop up biographies for drivers, teams and racetracks with scraped images.</List.Item>
                    <List.Item>Scroll animation like The Pudding.<a href='https://pudding.cool' target={'_blank'}>https://pudding.cool</a></List.Item>
                </List>
            </div>
            <h3>Project Schedule</h3>
            <div className='process-book-pl-50'>
                <Table withBorder withColumnBorders highlightOnHover>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Duration</th>
                            <th>Assignee</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>React Boilerplate Setup</td>
                            <td>0.5 weeks</td>
                            <td>Sharad Bhat</td>
                        </tr>
                        <tr>
                            <td>Data Cleanup</td>
                            <td>1 week</td>
                            <td>Alex Liebig</td>
                        </tr>
                        <tr>
                            <td>F1 History Chart</td>
                            <td>1 week</td>
                            <td>Sharad Bhat</td>
                        </tr>
                        <tr>
                            <td>Season World Map</td>
                            <td>0.5 weeks</td>
                            <td>Alex Liebig</td>
                        </tr>
                        <tr>
                            <td>Race Selector</td>
                            <td>0.5 weeks</td>
                            <td>Sharad Bhat</td>
                        </tr>
                        <tr>
                            <td>Race-based Driver Comparison</td>
                            <td>1 week</td>
                            <td>Alex Liebig</td>
                        </tr>
                        <tr>
                            <td>Graph synchronization</td>
                            <td>0.5 weeks</td>
                            <td>Alex Liebig</td>
                        </tr>
                        <tr>
                            <td>Season Heatmap</td>
                            <td>1.5 weeks</td>
                            <td>Sharad Bhat</td>
                        </tr>
                        <tr>
                            <td>Learn Scrollama</td>
                            <td>1 week each</td>
                            <td>Alex and Sharad</td>
                        </tr>
                        <tr>
                            <td>Image and Bio Scraping</td>
                            <td>1 week each</td>
                            <td>Alex and Sharad</td>
                        </tr>
                        <tr>
                            <td>Driver / Team / Track Bio</td>
                            <td>1 week</td>
                            <td>Alex Liebig</td>
                        </tr>
                        <tr>
                            <td>Implement Scrollama</td>
                            <td>1 week</td>
                            <td>Sharad Bhat</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            <h3>Citations</h3>
            <div className='process-book-pl-50'>
                <p>World map image - <a href='https://www.kindpng.com/imgv/iRxhTJo_globe-hi-fabs-llp-json-d3-js-world/' target={'_blank'}>https://www.kindpng.com/imgv/iRxhTJo_globe-hi-fabs-llp-json-d3-js-world/</a></p>
            </div>
        </div>
    </Center>
  )
}

export default ProcessBook