import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import PhotoUpload from './photoUpload.jsx'


const thumbnail = { width: 150, height: 150, position: 'relative', flex: '0 1 50%', display: 'flex'}
const selected = { width: '75vw', height: 'auto', padding: 50, border: '1px solid blue', }
const tileStrip = {display: 'flex', width: 300, flexWrap: 'wrap'}
const deleteButton = {position: 'absolute', right: 20, top: 20, zIndex: 100}

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

    if(this.state[photo]) this.setState({selectedDisplay: this.state[photo]})
    else {
        console.log('we need a new signed url')
        axios(`/api/photography/library/${photo}`)
        .then(url=>url.data)
        .then(url=>{
            this.setState({[photo]: url, selectedDisplay: url})
        })
    }
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
        <div className='photoDisplay'>
            <div className='tileStrip'>
            {
                this.state[focus] && this.state[focus].map((eachPhoto, photoIndex)=>(
                <div key={eachPhoto.key} className='tile'>
                    <img className= 'thumbImage' src={eachPhoto.signedUrl} onClick={()=>{this.displaySelected(eachPhoto.key)}}/>
                    {this.props.user.firstName===this.props.displayUser.firstName && <div className='deleteButton' style={deleteButton}
                    onClick={(evt)=>{this.deletePhoto(eachPhoto.key, photoIndex)}}>[X]</div>}
                </div>
                ))
            }
            </div>
            {this.state.selectedDisplay && 
            <img src={this.state.selectedDisplay} style={selected} className='selectedDisplay' />}
        </div>
    </React.Fragment>
)}
}

const mapProps = state => ({user:state.user})

export default connect(mapProps)(Display)