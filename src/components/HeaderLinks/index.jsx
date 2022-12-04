import { Button, Tooltip } from '@mantine/core'
import { useFullscreen } from '@mantine/hooks';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Icons
import { faExpand, faDownLeftAndUpRightToCenter } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'

// CSS
import './styles.css'

const HeaderLinks = () => {
    const { toggle: toggleFullscreen, fullscreen } = useFullscreen()
    return (
        <div className='linksContainer'>
            <Button
                variant='outline'
                color='gray'
                component={Link}
                to='/processBook'
                className='item'
            >
                Process Book
            </Button>
            <Tooltip label='YouTube Video'>
                <Button
                    variant='outline'
                    color='gray'
                    compact
                    className='actionButton item'
                    component='a'
                    target='_blank'
                    rel='noopener noreferrer'
                    href='http://google.com'
                >
                    <FontAwesomeIcon color='white' icon={faYoutube} size='xl' />
                </Button>
            </Tooltip>
            <Tooltip label='Github Repository'>
                <Button
                    variant='outline'
                    color='gray'
                    compact
                    className='actionButton item'
                    component='a'
                    target='_blank'
                    rel='noopener noreferrer'
                    href='https://github.com/sharadbhat/Formula-1-VRD'
                >
                    <FontAwesomeIcon color='white' icon={faGithub} size='xl' />
                </Button>
            </Tooltip>
            <Tooltip label={fullscreen ? 'Minimize' : 'Fullscreen'}>
                <Button
                    variant='outline'
                    color='gray'
                    compact
                    className='actionButton item'
                    onClick={toggleFullscreen}
                >
                    <FontAwesomeIcon color='white' icon={fullscreen ? faDownLeftAndUpRightToCenter : faExpand} size='lg' />
                </Button>
            </Tooltip>
        </div>
    )
}

export default HeaderLinks