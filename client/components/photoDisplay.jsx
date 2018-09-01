import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import PhotoUpload from './photoUpload.jsx'

//const frame = {width: 150, height: 150, display: 'block'}
const frame = {display: 'block', width: 1000, height: 'auto'}

class Display extends React.Component{

constructor(props){
    super(props)
    this.state={
        photography: [],
        selectedDisplay: ''
    }
    this.loadLibrary = this.loadLibrary.bind(this)
    this.deletePhoto = this.deletePhoto.bind(this)
    this.displaySelected = this.displaySelected.bind(this)
}

loadLibrary(user){

    axios.get(`/api/photography/library/${user.firstName+user.lastName+user.id}`).then(res=>res.data).then(paths=>{
        this.setState({[user.firstName+user.lastName+user.id]: paths})
    })
}

displaySelected(photo){

    axios(`/api/photography/library/${photo}`)
    .then(url=>url.data)
    .then(url=>{
        this.setState({selectedDisplay: url})
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
        this.loadLibrary(this.props.displayUser)
    }
}

render(){ 
    
    const focus = this.props.displayUser.firstName+this.props.displayUser.lastName+this.props.displayUser.id
    
    return (
    <React.Fragment>
        {this.props.displayUser.firstName === this.props.user.firstName && <PhotoUpload/>}
        <div>{this.props.displayUser.firstName}</div>
        {this.state.selectedDisplay && <img src={this.state.selectedDisplay} style={{border: '1px solid green'}}/>}
        {
            this.state[focus] && this.state[focus].map((eachPhoto, photoIndex)=>(
            <div key={eachPhoto.key} className='frame'>
                <img style={frame} src={eachPhoto.signedUrl} onClick={()=>{this.displaySelected(eachPhoto.key)}}/>
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