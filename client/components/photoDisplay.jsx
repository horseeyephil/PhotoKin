import React from 'react'
import axios from 'axios'

const frame = {width: 200, height: 150, display: 'block'}

class Display extends React.Component{

constructor(props){
    super(props)
    this.state={
        photography: []
    }
    this.loadLibrary = this.loadLibrary.bind(this)
}

loadLibrary(){
    const {user} = this.props
    axios.get(`/api/photography/library/${user.firstName+user.lastName+user.id}`).then(res=>res.data).then(paths=>{
        this.setState({photography: paths})
    })
}


componentDidMount(){
    this.loadLibrary()
}


render(){ return (
    <React.Fragment>
        {
            this.state.photography.map(eachPhoto=><img key={eachPhoto} style={frame} src={eachPhoto} />)
        }
    </React.Fragment>
)}
}

export default Display