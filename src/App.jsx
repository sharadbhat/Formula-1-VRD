import { useState } from 'react'
import { MantineProvider, AppShell } from '@mantine/core'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

// Pages
import Home from './pages/Home'
import ProcessBook from './pages/ProcessBook'

// Components
import NavHeader from './components/NavHeader'

// Utils
import GlobalContext from './utils/globalContext'

export default function App() {
  const [selectedYear, setSelectedYear] = useState(null)
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      <GlobalContext.Provider value={{ selectedYear, setSelectedYear }}>
        <Router basename='/Formula-1-VRD/'>
          <AppShell header={<NavHeader />}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/processBook' element={<ProcessBook />} />
            </Routes>
          </AppShell>
        </Router>
      </GlobalContext.Provider>
    </MantineProvider>
  )
}
