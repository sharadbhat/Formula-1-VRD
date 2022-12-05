import { Button, Center, List, SegmentedControl, Table } from '@mantine/core'
import { useState } from 'react'

// Utils
import { getSketchFilePath } from '../../utils/getFilePath'

// CSS
import './styles.css'

const ProcessBook = () => {
    const [selectedBox, setselectedBox] = useState('processBook')

    const renderText = () => {
        switch (selectedBox) {
            case 'proposal':
                return renderProposalText()
            case 'processBook':
                return renderProcessBookText()
            case 'feedback':
                return renderFeedbackText()
            default:
                return renderProcessBookText()
        }
    }

    return (
        <Center>
            <div className='process-book-container'>
                <Center>
                    <img width={75} src={getSketchFilePath('checkered-flag.png')} />
                    <h1 style={{ marginLeft: 20 }} title='Formula 1 Visualized Racing Data'>Formula 1 VRD</h1>
                </Center>
                <Center style={{ marginBottom: 10 }}>
                    <h3>Alex Liebig and Sharad Bhat</h3>
                </Center>
                <Center>
                    <SegmentedControl value={selectedBox} onChange={setselectedBox} data={[
                        {
                            value: 'proposal',
                            label: 'Project Proposal'
                        },
                        {
                            value: 'processBook',
                            label: 'Process Book'
                        },
                        {
                            value: 'feedback',
                            label: 'Design Feedback'
                        }
                    ]} />
                </Center>
                {renderText()}
            </div>
        </Center>
    )
}

const renderFeedbackText = () => {
    return (
        <>
            <div className='process-book-proposal-header'>
                <div style={{ width: 110 }} />
                <div>
                    <h1>Design Feedback</h1>
                </div>
                <Button
                    style={{ width: 110 }}
                    variant={'filled'}
                    color='gray'
                    component='a'
                    target={'_blank'}
                    href='https://raw.githubusercontent.com/sharadbhat/Formula-1-VRD/main/docs/Design Feedback.pdf'
                >
                    Download
                </Button>
            </div>
            <h3>Feedback</h3>
            <div className='process-book-pl-50'>
                <List>
                    <List.Item>Change location grid to a list of scrollable locations next to the map.</List.Item>
                    <List.Item>Highlight the ending result of a driver in a race.</List.Item>
                    <List.Item>Indicate pitstop laps to better understand overtakes.</List.Item>
                    <List.Item>Show driver names next to starting or finishing positions on the line chart.</List.Item>
                    <List.Item>On the map, show track layout and details on hover.</List.Item>
                    <List.Item>Synchronize interactions between track list and map.</List.Item>
                    <List.Item>Include icons on the map instead of circles (country flag, track logo, etc.)</List.Item>
                </List>
            </div>
        </>
    )
}

const renderProcessBookText = () => {
    return (
        <>
            <div className='process-book-proposal-header'>
                <div style={{ width: 110 }} />
                <div>
                    <h1>Process Book</h1>
                </div>
                <Button
                    style={{ width: 110 }}
                    variant={'filled'}
                    color='gray'
                    component='a'
                    target={'_blank'}
                    href='https://raw.githubusercontent.com/sharadbhat/Formula-1-VRD/main/docs/Formula 1 VRD Process Book.pdf'
                >
                    Download
                </Button>
            </div>
            <h3>Demonstration Video</h3>
            <Center>
                <iframe width='560' height='315' src='https://www.youtube.com/embed/HZR8Wibx924' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>
            </Center>
            <h3>Overview and Motivation</h3>
            <div className='process-book-pl-50'>
                <p>A big part of the reason why we chose to visualize Formula 1 was due to our love for cars and passion for racing. Formula 1 has always been a sport of numbers, where milliseconds determine who's the champion. Visualizing these numbers in a graphical user interface will truly help with understanding the different trends in Formula 1. With this project we hope to spark interest in more Americans, and encourage them to start watching Formula 1.</p>
            </div>
            <h3>Related Work</h3>
            <div className='process-book-pl-50'>
                <List>
                    <List.Item>
                        <p>This one was by far the best visualization we found on the topic of Formula 1. The visualization shows the performance of drivers across multiple eras of Formula 1 and helps find which driver is the Greatest of All Time. The authors chose to stylize the visualization as gauges.</p>
                        <p><a href='https://jasonjpaul.squarespace.com/formula-1-data-vis' target={'_blank'}>https://jasonjpaul.squarespace.com/formula-1-data-vis</a></p>
                        <img width={700} src={getSketchFilePath('work1.png')} />
                    </List.Item>
                    <List.Item>
                        <p>This blog contains multiple visualizations on the topic of Formula 1. In this particular visualization, the author chose to display each driver's lap time using a boxplot and a scatterplot. However, we thought that this can quickly get hard to read with 20+ drivers.</p>
                        <p><a href='https://www.f1trends.com/blog' target={'_blank'}>https://www.f1trends.com/blog</a></p>
                        <img width={700} src={getSketchFilePath('work2.png')} />
                    </List.Item>
                    <List.Item>
                        <p>Similar to a trend line, this visualization highlights where the drivers lap times are clustering in this scatter plot. It does so by increasing the opacity towards the median lap time, and decreasing the opacity the further away it gets.</p>
                        <p><a href='https://kwjames.com/f1times.html' target={'_blank'}>https://kwjames.com/f1times.html</a></p>
                        <img width={700} src={getSketchFilePath('work3.png')} />
                    </List.Item>
                    <List.Item>
                        <p>This plot below highlights how each racer is doing in a single race in terms of lap times, shown as a ridge line graph. Essentially the curves represent the density of lap times. The more dense a curve is the more times a driver finishes a lap around that specific time.</p>
                        <p><a href='https://f1pace.com/p/2022-monaco-gp-lap-time-distribution/' target={'_blank'}>https://f1pace.com/p/2022-monaco-gp-lap-time-distribution/</a></p>
                        <img width={700} src={getSketchFilePath('work4.png')} />
                    </List.Item>
                </List>
            </div>
            <h3>Questions</h3>
            <div className='process-book-pl-50'>
                <List>
                    <List.Item>Which drivers and teams are scoring the majority of points in a season?</List.Item>
                    <List.Item>How do drivers and teams perform as the season progresses?</List.Item>
                    <List.Item>How do drivers perform in a given race?</List.Item>
                    <List.Item>How do lap times compare in a given race between drivers?</List.Item>
                    <List.Item>How do position changes take place in a race?</List.Item>
                    <List.Item>Where do the overtakes happen in a race?</List.Item>
                </List>
            </div>
            <h3>Data</h3>
            <div className='process-book-pl-50'>
                <p>The data is from an API, called the Ergast Developer API. However, since this API is community funded and can get rate limited, we opted to use a Kaggle Dataset of the same data, stored in CSV format.</p>
                <p>API Link - <a href='http://ergast.com/mrd/' target={'_blank'}>Ergast Developer API</a></p>
                <p>Kaggle Dataset Link - <a href='https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020' target={'_blank'}>Formula 1 World Championship (1950 - 2022) | Kaggle</a></p>
                <b>Additional Data</b>
                <p>We wrote Python scripts to scrape descriptions and image links of track and drivers from their Wikipedia pages. The script used BeautifulSoup to extract data from the webpage. This data was stored in a CSV file which is then read and displayed using D3.</p>
            </div>
            <h3>Exploratory Data Analysis</h3>
            <div className='process-book-pl-50'>
                <p>The dataset was available as CSV files. We combed through the files and looked for connecting primary and foreign keys across different CSV files. Once we had a good idea of the file structure and data distribution, we used our prior knowledge of Formula 1 to look for data that would be interesting to visualize and explore.</p>
            </div>
            <h3>Design Evolution</h3>
            <div>
                <div className='process-book-mt-30'>
                    <b>Sketch 1</b>
                    <img style={{ marginTop: 10 }} width={700} src={getSketchFilePath('draft1.jpg')} />
                    <p>In this initial brainstorming session, we sketched out how the user can interact with the website. What should the user see when they initially land on the website and how they can advance through the website.</p>
                </div>
                <div className='process-book-mt-30'>
                    <b>Sketch 2</b>
                    <img style={{ marginTop: 10 }} width={700} src={getSketchFilePath('draft2.jpg')} />
                    <p>In this sketch, we planned out how to place the different elements of our visualization. We agreed on showing season-level visualizations at the top. And as the user scrolls down, we show the race-level visualizations.</p>
                </div>
                <div className='process-book-mt-30'>
                    <b>Sketch 3</b>
                    <img style={{ marginTop: 10 }} width={700} src={getSketchFilePath('draft3.jpg')} />
                    <p>In this sketch, we looked at how we can arrange the different charts on the page. Our initial plan was to have the world map at the top, with line segments connecting the different locations on map. However, with so many races taking place in Europe, we decided against it.</p>
                </div>
                <p>Once we had a general idea of our layout, we began sketching out our visualizations using <a href='https://draw.io' target={'_blank'}>draw.io</a>.</p>
                <div className='process-book-mt-30'>
                    <b>Visualization Sketch 1</b>
                    <br />
                    <div className='process-book-center'>
                        <img style={{ marginTop: 10 }} width={400} src={getSketchFilePath('PointsProgression.jpg')} />
                    </div>
                    <div className='process-book-center'>
                        <p>World Championship Points Line Chart</p>
                    </div>
                    <p>This chart shows the points race between teams and drivers as the season progresses. At each point, we show the cumulative points tally until that race.</p>
                </div>
                <div className='process-book-mt-30'>
                    <b>Visualization Sketch 2</b>
                    <br />
                    <div className='process-book-center'>
                        <img style={{ marginTop: 10 }} width={400} src={getSketchFilePath('heatmap.jpg')} />
                    </div>
                    <div className='process-book-center'>
                        <p>Points Heatmap</p>
                    </div>
                    <p>In this chart, we show the points scored by teams and drivers at each round in the season. Each row is a driver or team and each column is a particular round in the season.</p>
                </div>
                <div className='process-book-mt-30'>
                    <b>Visualization Sketch 3</b>
                    <br />
                    <img style={{ marginTop: 10 }} width={700} src={getSketchFilePath('HomePage - Season Selected.jpg')} />
                    <div className='process-book-center'>
                        <p>Layout 1</p>
                    </div>
                    <p>The world championship line chart and the points heatmap are placed next to each other since they display related data. While the line chart shows the cumulative points at each round, the heatmap displays the exact points each team or driver scored at each round.</p>
                </div>
                <div className='process-book-mt-30'>
                    <b>Visualization Sketch 4</b>
                    <br />
                    <img style={{ marginTop: 10 }} width={700} src={getSketchFilePath('Homepage - Race List with Map.jpg')} />
                    <div className='process-book-center'>
                        <p>World Map with Track Selector</p>
                    </div>
                    <p>The world map is placed next to the track selector to help the user to understand where each race takes place.</p>
                </div>
                <div className='process-book-mt-30'>
                    <b>Visualization Sketch 5</b>
                    <br />
                    <img style={{ marginTop: 10 }} width={700} src={getSketchFilePath('race_position_graph.jpg')} />
                    <div className='process-book-center'>
                        <p>Race Position Line Chart</p>
                    </div>
                    <p>This line chart shows the change in positions between drivers in a given race. Each line corresponds to a particular driver.</p>
                </div>
                <div className='process-book-mt-30'>
                    <b>Visualization Sketch 6</b>
                    <br />
                    <div className='process-book-center'>
                        <img style={{ marginTop: 10 }} width={400} src={getSketchFilePath('laptimes.jpg')} />
                    </div>
                    <div className='process-book-center'>
                        <p>Cumulative Lap Time Line Chart and Lap Time Scatterplot</p>
                    </div>
                    <p>This contains two charts. The top line chart shows the cumulative time taken by a driver to finish a race. The bottom scatterplot shows the individual lap times of every driver in every lap.</p>
                </div>
                <div className='process-book-mt-30'>
                    <b>Visualization Sketch 7</b>
                    <br />
                    <img style={{ marginTop: 10 }} width={700} src={getSketchFilePath('homepage_race_data.jpg')} />
                    <div className='process-book-center'>
                        <p>Layout 2</p>
                    </div>
                    <p>In this layout, we decided to place the Race Position Line Chart next to the Cumulative Lap Time Chart and the Lap Time Scatter Plot since all of these display related data.</p>
                </div>
                <b>Experiments</b>
                <p>One thing we thought might have been a good idea at the time was to use a graph that displays the lap times cumulatively. However, after implementing it this is what it looked like.</p>
                <div className='process-book-center'>
                    <img style={{ marginTop: 10 }} width={500} src={getSketchFilePath('exp1.png')} />
                </div>
                <p>As seen, the data is very difficult to read compared to the individual lap data (Shown below)</p>
                <div className='process-book-center'>
                    <img style={{ marginTop: 10 }} width={500} src={getSketchFilePath('exp2.png')} />
                </div>
                <p>Overall, we believe this is the case since it not only highlights how competitive Formula 1 races are, but it also highlights how the spread between racers is fairly close. Also, the cumulative graph gives the false impression that the top line is the best time, which it clearly isn't since the lowest time is always the best. Since it is misleading to display the data this way, we decided to do away with using a cumulative graph and use only the lap-time graph above.</p>
                <p>We also experimented with using a grid layout to display the country/name of each race. Although this was what we originally wanted to use, during the peer feedback, we were informed that this can be improved by using a list.</p>
                <div className='process-book-center'>
                    <img style={{ marginTop: 10 }} width={500} src={getSketchFilePath('exp3.png')} />
                </div>
                <p>Our initial implementation of the world map looked like the image below. However, we decided to improve the colors and add more information in the tooltip.</p>
                <div className='process-book-center'>
                    <img style={{ marginTop: 10 }} width={500} src={getSketchFilePath('exp4.png')} />
                </div>
                <p>The image below is what the lap times scatterplot looked like initially. However, the colors can be hard to read. We decided to remove the colors and only show it when the user selects a driver.</p>
                <div className='process-book-center'>
                    <img style={{ marginTop: 10 }} width={500} src={getSketchFilePath('exp5.png')} />
                </div>
            </div>
            <h3>Implementation</h3>
            <b>World Championship Points Line Chart</b>
            <div className='process-book-mt-30 process-book-center'>
                <img width={500} src={getSketchFilePath('wdc.jpg')} />
            </div>
            <p>We show a line chart to show how teams and drivers progress as the season goes on. Each line corresponds to an individual driver or a team. The purpose of this was to show the points race that takes place throughout the season between drivers and teams to be crowned the world champions.</p>
            <div className='process-book-mt-30 process-book-center'>
                <img width={500} src={getSketchFilePath('wdc_sel.jpg')} />
            </div>
            <p>When the user selects drivers or teams, we bring attention to these lines by lowering the opacity of all other lines. The user can also hover over a line to see details in a tooltip such as the driver name, the current round and the points accumulated up until the round.</p>
            <b>Points Heatmap</b>
            <div className='process-book-mt-30'>
                <p>A heatmap to show which drivers and teams are scoring the majority of the points at each race in a season. The user can hover over a rectangle to see details on a tooltip such as points scored at that race, the round number and the name of the race.</p>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={500} src={getSketchFilePath('heatmap_unsel.jpg')} />
                </div>
                <p>When the user selects different teams or drivers, we bring attention to those rows by lowering the opacity of the other rows.</p>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={500} src={getSketchFilePath('heatmap_sel.jpg')} />
                </div>
            </div>
            <b>Track Locations World Map</b>
            <div className='process-book-mt-30'>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={500} src={getSketchFilePath('map.jpg')} />
                </div>
                <p>In the world map view, we display the different races in a season and where it takes place. The user can hover over a particular circle to view the race track's name and which round it was. The purpose of this was to make it easier for users to find the name and location of particular races. To reduce the amount of data being loaded in the world map, we used <a href='https://mapshaper.org' target={'_blank'}>mapshaper</a> to lower the space used from 3,543 KB to 152 KB.</p>
            </div>
            <b>Race Position Changes Line Chart</b>
            <div className='process-book-mt-30'>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={500} src={getSketchFilePath('race.jpg')} />
                </div>
                <p>The multi-line chart to visualize position changes between drivers in a race. Each line corresponds to a single driver. The line shows the position changes of a particular driver and which lap each change took place in.</p>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={500} src={getSketchFilePath('race_sel.jpg')} />
                </div>
                <p>When the user selects a driver, we lower the opacity of the other lines to draw attention to the selected drivers.</p>
            </div>
            <b>Lap Times Scatter Plot</b>
            <div className='process-book-mt-30'>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={500} src={getSketchFilePath('laptime.jpg')} />
                </div>
                <p>A scatter plot of the lap times of all drivers throughout the course of a given race. Each circle corresponds to the time taken by a driver to complete a lap. The purpose of this is to show how close the drivers are, with respect to the lap times.</p>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={500} src={getSketchFilePath('laptime_sel.jpg')} />
                </div>
                <p>Similar to the previous visualization, when the user selects a driver, we lower the opacity of the other circles to draw attention to the lap times of the selected drivers.</p>
                <p>The user can select multiple drivers to compare their lap times.</p>
            </div>
            <b>Race Position List</b>
            <div className='process-book-mt-30'>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={200} src={getSketchFilePath('list.jpg')} />
                    <img width={200} src={getSketchFilePath('list_sel.jpg')} />
                </div>
                <p>This is a list of the positions of each driver at the end of the race. It shows what position a driver finished at, and whether a driver did not complete a race due to some factor.</p>
                <p>When the user hovers over a lap on the race position line chart or the  scatterplot, this list updates in real time to show the position changes. The user can also select drivers to highlight their positions.</p>
            </div>
            <b>Positions Changed Kernel Density Map</b>
            <div className='process-book-mt-30'>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={700} src={getSketchFilePath('density.jpg')} />
                </div>
                <p>A kernel density chart to show where the majority of the position changes happened during a race.</p>
                <p>We also use a line chart on top of it to emphasize the fact. The user can hover on the chart to view the exact number of position changes that happened in a particular lap.</p>
            </div>
            <b>Additional Components</b>
            <List type='ordered' style={{ marginTop: 10 }}>
                <List.Item><b>Track Selector</b></List.Item>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={300} src={getSketchFilePath('track.jpg')} />
                </div>
                <p>This list allows the user to look through all races and select whichever they want to explore further.</p>
                <List.Item><b>Track Details Card</b></List.Item>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={200} src={getSketchFilePath('track_desc.jpg')} />
                </div>
                <p>This card shows some details about the selected race track. It shows an image of the track outline and some details like the location, country and track name. It also contains a link to the track's Wikipedia article. The scraped data for tracks is used here.</p>
                <List.Item><b>Driver Details Card</b></List.Item>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={400} src={getSketchFilePath('drivers.jpg')} />
                </div>
                <p>This component shows a card for each selected driver. Each card shows an image of the driver, the nationality, driver number, driver code and the date of birth. Each card also contains a link to the driver's Wikipedia article. The scraped data for drivers is used here.</p>
                <List.Item><b>Visualization Description Hover Cards</b></List.Item>
                <div className='process-book-mt-30 process-book-center'>
                    <img width={250} src={getSketchFilePath('hovercard.jpg')} />
                </div>
                <p>Every chart is accompanied by a “question” icon which, when hovered over, provides the user with relevant information to better understand the chart.</p>
            </List>
            <h3>Evaluation</h3>
            <div className='process-book-pl-50 process-book-justify'>
                <p>We believe what's true for the race visualizations is how close each driver's times are to one another and how competitive each race is. Unlike sports such as College Football where it's usually two teams competing at a time in a game, the outcome of Formula 1 races are much more variable as more than ten teams and twenty drivers are competing in the same race at the same time. With the exception of top drivers such as Lewis Hamilton and Michael Schumacher, Formula 1 races are hard to predict.</p>
                <p>We focused primarily on having great interactions. Every chart is connected to another chart in some way. The user is provided with multiple options for selecting drivers and teams. Some examples of these are, hovering over a round in the World Championship line chart updates the heatmap, the world map and the track list. And, selecting a driver in the line chart updates the Lap Times scatterplot and the list. We thought these improvements greatly affect how a user interacts with a visualization.</p>
                <p>We ran into many hurdles while developing this project. One of the recurring problems was getting ReactJS and D3JS to work together. Scouring through many forums and blog posts, we think we arrived at a stable solution. On the design front, one aspect we constantly went back and forth on was the use of colors to represent drivers. With there being more than 20 drivers in some races, we decided on using a categorical colormap with as many colors as drivers. Since each driver's points were connected in line charts, we thought that this could be easy to follow and understand. For this reason, we allow the user to select drivers and highlight only their points and lower the opacity of other points to reduce distractions.</p>
            </div>
            <h3>Links</h3>
            <div className='process-book-pl-50 process-book-mb-150'>
                <List>
                    <List.Item style={{ marginTop: 20 }}>
                        <div>
                            <b>Project Website</b>: <a href='https://sharadbhat.github.io/Formula-1-VRD/' target={'_blank'}>https://sharadbhat.github.io/Formula-1-VRD/</a>
                        </div>
                    </List.Item>
                    <List.Item style={{ marginTop: 20 }}>
                        <div>
                            <b>Github Repository</b>: <a href='https://github.com/sharadbhat/Formula-1-VRD' target={'_blank'}>https://github.com/sharadbhat/Formula-1-VRD</a>
                        </div>
                    </List.Item>
                    <List.Item style={{ marginTop: 20 }}>
                        <div>
                            <b>Demonstration Video</b>: <a href='https://youtu.be/HZR8Wibx924' target={'_blank'}>https://youtu.be/HZR8Wibx924</a>
                        </div>
                    </List.Item>
                </List>
            </div>
        </>
    )
}

const renderProposalText = () => {
    return (
        <>
            <div className='process-book-proposal-header'>
                <div style={{ width: 110 }} />
                <div>
                    <h1>Project Proposal</h1>
                </div>
                <Button
                    style={{ width: 110 }}
                    variant={'filled'}
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
                    <List.Item>Which drivers and teams are scoring the majority of points in a season?</List.Item>
                    <List.Item>How do drivers and teams perform as the season progresses?</List.Item>
                    <List.Item>How do drivers perform in a given race?</List.Item>
                    <List.Item>How do lap times compare in a given race between drivers?</List.Item>
                    <List.Item>How do position changes take place in a race?</List.Item>
                    <List.Item>Where do the overtakes happen in a race?</List.Item>
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
        </>
    )
}

export default ProcessBook