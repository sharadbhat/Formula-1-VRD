import { Title, Header } from '@mantine/core'
import { Link, useLocation } from 'react-router-dom'

// Components
import SeasonSelector from '../SeasonSelector'
import HeaderLinks from '../HeaderLinks'

// CSS
import './styles.css'

// Logo
import Logo from '../../assets/flag.png'

const NavHeader = () => {
  return (
    <Header height={70} p='md'>
        <div className='nav-container'>
            <div className='nav-width-300'>
              <Link to={'/'} className='logo-link'>
                <div className='logo-container'>
                  <img src={Logo} height={35} className='logo' />
                  <Title
                    order={2}
                    title='Formula 1 Visualized Race Data'
                  >
                    Formula 1 VRD
                  </Title>
                </div>
              </Link>
            </div>
            {renderDropdown()}
            <div className='nav-width-300'>
                <HeaderLinks />
            </div>
        </div>
    </Header>
  )
}

const renderDropdown = () => {
  const pathname = useLocation().pathname
  if (pathname === '/') {
    return <SeasonSelector />
  }
  return null
}

export default NavHeader