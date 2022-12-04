import { Link } from 'react-router-dom'
import { Button, Center, Stack, Text, Title } from '@mantine/core'

// Components
import SeasonSelector from '../SeasonSelector'

// Logo
import Logo from '../../assets/flag.png'

const LandingView = () => {
    return (
        <Center style={{ marginTop: '2%', display: 'flex', flexDirection: 'column' }}>
            <Link to={'/'} className='logo-link'>
                <div className='logo-container' style={{ marginBottom: 25 }}>
                    <img src={Logo} height={45} className='logo' />
                    <Title
                        order={1}
                        title='Formula 1 Visualized Racing Data'
                    >
                        Formula 1 VRD
                    </Title>
                </div>
            </Link>
            <div style={{ maxWidth: 500, textAlign: 'center' }}>
                <Text>A visualization project by Alex Liebig and Sharad Bhat</Text>
                <Text style={{ marginTop: 10 }}>CS 6630 Fall 2022</Text>
            </div>
            <Stack style={{ width: 500, marginTop: 50 }}>
                <Text>
                    Select a season to get started
                </Text>
                <SeasonSelector />
                <Text style={{ marginTop: 40 }}>
                    Other options
                </Text>
                <Button
                    variant='filled'
                    color='gray'
                    component={Link}
                    to='/processBook'
                    style={{ height: 60, fontSize: 18, color: '#ededf0' }}
                >
                    View Process Book
                </Button>
                <Button
                    variant='filled'
                    color='gray'
                    component='a'
                    target='_blank'
                    rel='noopener noreferrer'
                    href='https://google.com'
                    style={{ height: 60, fontSize: 18, color: '#ededf0' }}
                >
                    Watch Video
                </Button>
                <Button
                    variant='filled'
                    color='gray'
                    component='a'
                    target='_blank'
                    rel='noopener noreferrer'
                    href='https://github.com/sharadbhat/Formula-1-VRD'
                    style={{ height: 60, fontSize: 18, color: '#ededf0' }}
                >
                    View Github Repository
                </Button>
            </Stack>
        </Center>
    )
}

export default LandingView