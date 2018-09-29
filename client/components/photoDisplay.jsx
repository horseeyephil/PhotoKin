import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import UploadTool from './photoUpload.jsx'
import styles from './componentStyles/photoDisplay.css'

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
        <div className={styles.display}>
        {this.props.displayUser.firstName === this.props.user.firstName && <UploadTool/>}
            <div className={styles.tileStrip}>
            {
                this.state[focus] && this.state[focus].map((eachPhoto, photoIndex)=>(
                <div key={eachPhoto.key} className={styles.tile} 
                onClick={()=>{this.displaySelected(eachPhoto.key)}}>
                    <div className={styles.overLay}/>
                    <img className= {styles.thumbImage} src={eachPhoto.signedUrl} />
                    {this.props.user.firstName===this.props.displayUser.firstName && <div className='deleteButton' style={deleteButton}
                    onClick={(evt)=>{this.deletePhoto(eachPhoto.key, photoIndex)}}>[X]</div>}
                </div>
                ))
            }
            </div>
            
            <div className={styles.selectedDisplay}>
            {this.state.selectedDisplay && <img src={this.state.selectedDisplay} className={styles.selectedImage} />}
            </div >
        </div>
)}
}

const mapProps = state => ({user:state.user})

export default connect(mapProps)(Display)