import React from 'react'
import { AppShell, Title, Header } from '@mantine/core'

// Components
import HeaderLinks from '../../components/HeaderLinks'

// CSS
import './styles.css'

const ProcessBook = () => {
  return (
    <AppShell
          header={
            <Header height={70} p='md'>
              <div className='container'>
                <Title order={2}>Formula 1 VRD</Title>
                <HeaderLinks />
              </div>
            </Header>
          }
        >
            {/* TODO: MORE SOON */}
    </AppShell>
  )
}

export default ProcessBook