import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'


import Photo from './components/photoUpload.jsx'

// establishes socket connection
//import './socket'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter history={history}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
)

//ReactDOM.render(<Photo/>, document.getElementById('app'))
