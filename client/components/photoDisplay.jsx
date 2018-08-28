import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import PhotoUpload from './photoUpload.jsx'

const frame = {width: 200, height: 150, display: 'block'}

class Display extends React.Component{

constructor(props){
    super(props)
    this.state={
        photography: []
    }
    this.loadLibrary = this.loadLibrary.bind(this)
    this.deletePhoto = this.deletePhoto.bind(this)
}

loadLibrary(user){

    axios.get(`/api/photography/library/${user.firstName+user.lastName+user.id}`).then(res=>res.data).then(paths=>{
        this.setState({[user.firstName+user.lastName+user.id]: paths})
    })
}

deletePhoto(target, splicePoint){
    console.log('We will delete ', target, splicePoint)
    axios.put(`/api/photography/`, {key: target}).then(res=>{
        if(res.status===204){

            const focus = this.props.displayUser.firstName+this.props.displayUser.lastName+this.props.displayUser.id

            this.setState({[focus]: this.state[focus].slice(0,splicePoint).concat(this.state[focus].slice(splicePoint+1))})
        }
    })
}


componentDidMount(){
    this.loadLibrary(this.props.displayUser)
}

componentDidUpdate(prevProps, prevState){
    const focus = this.props.displayUser.firstName+this.props.displayUser.lastName+this.props.displayUser.id
    
    if(!this.state[focus]){
        console.log('The state? ', this.state)
        this.loadLibrary(this.props.displayUser)
    }
}

render(){ 
    
    const focus = this.props.displayUser.firstName+this.props.displayUser.lastName+this.props.displayUser.id
    
    return (
    <React.Fragment>
        {this.props.displayUser.firstName === this.props.user.firstName && <PhotoUpload/>}
        <div>{this.props.displayUser.firstName}</div>
        {
            this.state[focus] && this.state[focus].map((eachPhoto, photoIndex)=>(
            <div key={eachPhoto} className='frame'>
                <img style={frame} src={eachPhoto.signedUrl} />
                {this.props.user.firstName===this.props.displayUser.firstName && <div className='deleteButton'
                onClick={(evt)=>{this.deletePhoto(eachPhoto.key, photoIndex)}}>[X]</div>}
            </div>
            ))
        }
    </React.Fragment>
)}
}

const mapProps = state => ({user:state.user})

export default connect(mapProps)(Display)