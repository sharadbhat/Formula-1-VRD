import React from 'react'
import { AppShell, Title, Header } from '@mantine/core'

// Components
import SeasonSelector from '../../components/SeasonSelector'
import HeaderLinks from '../../components/HeaderLinks'

// CSS
import './styles.css'

const Home = () => {
  return (
    <AppShell
          header={
            <Header height={70} p='md'>
              <div className='container'>
                <div style={{ width: 250 }}>
                    <Title order={2}>Formula 1 VRD</Title>
                </div>
                <SeasonSelector />
                <div style={{ width: 250 }}>
                    <HeaderLinks />
                </div>
              </div>
            </Header>
          }
        >
            {/* TODO: MORE SOON */}
    </AppShell>
  )
}

export default Home