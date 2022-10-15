import { MantineProvider, AppShell } from '@mantine/core'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'

// Pages
import Home from './pages/Home'
import ProcessBook from './pages/ProcessBook'
import Error from './pages/Error'

// Components
import NavHeader from './components/NavHeader'
import MobileWarning from './components/MobileWarning'

export default function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
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
    </MantineProvider>
  )
}
