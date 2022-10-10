import { Button } from '@mantine/core'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

import './styles.css'

const HeaderLinks = () => {
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
        <Button
            variant='outline'
            color='gray'
            compact
            className='githubButton item'
            component='a'
            target='_blank'
            rel='noopener noreferrer'
            href='https://github.com/sharadbhat/Formula-1-VRD'
        >
            <FontAwesomeIcon color='white' icon={faGithub} size="xl" />
        </Button>

    </div>
  )
}

export default HeaderLinks