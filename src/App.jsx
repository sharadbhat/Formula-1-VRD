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

// Utils
import useGlobalStore from './utils/store'

export default function App() {
  const env = useGlobalStore(state => state.env)
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      {env === 'prod'
        ? <MobileWarning />
        : null
      }
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
