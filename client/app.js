import React from 'react'

import {Navbar} from './components'
import Routes from './routes'
import Chat from './components/chatAuth'
import Photos from './components/photoUpload.jsx'
import UserSelector from './components/userSelector.jsx'



import {Pogs} from './components'


const App = () => {
  return (
    <div>
        <Navbar/>
        <Photos/>
        <Routes />
        <UserSelector />
    </div>
  )
}

export default App
