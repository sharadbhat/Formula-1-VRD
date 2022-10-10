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
import Error from './pages/Error'

// Components
import NavHeader from './components/NavHeader'

// Utils
import GlobalContext from './utils/globalContext'
import MobileWarning from './components/MobileWarning'

export default function App() {
  const [selectedYear, setSelectedYear] = useState(null)

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      <GlobalContext.Provider value={{ selectedYear, setSelectedYear }}>
        <MobileWarning />
        <Router basename='/Formula-1-VRD/'>
          <AppShell header={<NavHeader />}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/processBook' element={<ProcessBook />} />
              <Route path='*' element={<Error />} />
            </Routes>
          </AppShell>
        </Router>
      </GlobalContext.Provider>
    </MantineProvider>
  )
}
