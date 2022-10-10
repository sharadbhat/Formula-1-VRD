import React from 'react'

const GlobalContext = React.createContext({
    selectedYear: null,
    setSelectedYear: year => {}
})

export default GlobalContext
