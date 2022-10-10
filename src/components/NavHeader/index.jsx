import React from 'react'
import { Title, Header } from '@mantine/core'
import { Link, useLocation } from 'react-router-dom'

// Components
import SeasonSelector from '../SeasonSelector'
import HeaderLinks from '../HeaderLinks'

// CSS
import './styles.css'

const NavHeader = () => {
  return (
    <Header height={70} p='md'>
        <div className='nav-container'>
            <div className='nav-width-250'>
              <Title
                component={Link}
                to='/'
                order={2}
              >
                Formula 1 VRD
              </Title>
            </div>
            {renderDropdown()}
            <div className='nav-width-250'>
                <HeaderLinks />
            </div>
        </div>
    </Header>
  )
}

const renderDropdown = () => {
  let pathname = useLocation().pathname
  if (pathname === '/') {
    return <SeasonSelector />
  }
  return null
}

export default NavHeader