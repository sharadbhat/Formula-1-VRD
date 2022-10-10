import React from 'react'
import { Button } from '@mantine/core'
import { Link } from 'react-router-dom'

// CSS
import './styles.css'

const Error = () => {
  return (
    <div className='container-404'>
        <div className='label'>
            404
        </div>
        <div className='title'>
            Nothing to see here
        </div>
        <Button
            className='home-button'
            component={Link}
            to='/'
        >
            Take me back to the home page
        </Button>
    </div>
  )
}

export default Error