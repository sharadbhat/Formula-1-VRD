import { useState } from 'react';
import { AppShell, MantineProvider, Title, Header } from '@mantine/core';
import SeasonSelector from './components/SeasonSelector';
import GlobalContext from './utils/globalContext';

export default function App() {
  const [selectedYear, setSelectedYear] = useState(null);
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
      <GlobalContext.Provider value={{ selectedYear, setSelectedYear }}>
        <AppShell
          header={
            <Header height={70} p='md'>
              <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
                <Title style={{ width: 250 }} order={2}>Formula 1 VRD</Title>
                <SeasonSelector />
                <div style={{ width: 250 }} />
              </div>
            </Header>
          }
        >

        </AppShell>
      </GlobalContext.Provider>
    </MantineProvider>
  );
}
