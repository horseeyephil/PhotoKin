import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {HashRouter} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'


import Photo from './components/photoUpload.jsx'

// establishes socket connection
//import './socket'

ReactDOM.render(
  <Provider store={store}>
    <HashRouter history={history}>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('app')
)

//ReactDOM.render(<Photo/>, document.getElementById('app'))