import { Button, Tooltip } from '@mantine/core'
import { useFullscreen } from '@mantine/hooks';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Icons
import { faExpand, faDownLeftAndUpRightToCenter } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

// CSS
import './styles.css'

const HeaderLinks = () => {
    const { toggle, fullscreen } = useFullscreen();
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
                    onClick={toggle}
                >
                    <FontAwesomeIcon color='white' icon={fullscreen ? faDownLeftAndUpRightToCenter : faExpand} size='lg' />
                </Button>
            </Tooltip>
        </div>
    )
}

export default HeaderLinks