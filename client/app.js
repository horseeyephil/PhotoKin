import React from 'react'

import {Navbar} from './components'
import Routes from './routes'
import Chat from './components/chatAuth'
import UserSelector from './components/userSelector.jsx'



import {Pogs} from './components'


const App = () => {
  return (
    <div>
        <Navbar/>
        <Routes />
        <UserSelector />
    </div>
  )
}

export default App
