import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import UploadTool from './photoUpload.jsx'
import styles from './componentStyles/photoDisplay.css'
import Drawer from './drawer.jsx'
import CompressionForm from './photoCompressionForm.jsx'

class Display extends React.Component{

constructor(props){
    super(props)
    this.state={
        photography: [],
        selectedDisplay: '',
        selectedDisplayIndex: null,
        uploadMode: false
    }
    this.loadLibrary = this.loadLibrary.bind(this)
    this.deletePhoto = this.deletePhoto.bind(this)
    this.displaySelected = this.displaySelected.bind(this)
    this.createDisplay = this.createDisplay.bind(this)
}

loadLibrary(user){

    axios.get(`/api/photography/library/${user.firstName+user.lastName+user.id}`).then(res=>res.data).then(paths=>{
        this.setState({[user.firstName+user.lastName+user.id]: paths})
    })
}

createDisplay(url, uploadMode, photo, index){
  if(uploadMode==='upload') this.setState({selectedDisplay: url, uploadMode: true})
  else this.setState({[photo]: url, selectedDisplay: url, selectedDisplayIndex: index})
}

displaySelected(photo, index){

    if(this.state[photo]) this.setState({selectedDisplayIndex: index, selectedDisplay: this.state[photo]})
    else {
        axios(`/api/photography/library/${photo}`)
        .then(url=>url.data)
        .then(url=>{
            this.createDisplay(url,null,photo,index)
        })
        .catch(err=>{
          //do Nothing?
        })
    }
}

deletePhoto(key, splicePoint){

    axios.put(`/api/photography/`, {key}).then(res=>{
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
        {this.props.displayUser.firstName === this.props.user.firstName && <UploadTool createDisplay={this.createDisplay}/>}
            {   this.state.uploadMode ? <CompressionForm/> : (
              this.state[focus] && <div className={styles.tileStrip}>
                {this.state[focus].map((eachPhoto, photoIndex)=>(
                <div key={eachPhoto.key} className={styles.tile} 
                  onClick={()=>{this.displaySelected(eachPhoto.key, photoIndex)}}>
                    <div className={styles.overLay} />
                    <img className= {styles.thumbImage} src={eachPhoto.signedUrl} />
                </div>
                ))}
              </div>)}
            {this.state.selectedDisplay && (
              <div className={styles.selectedDisplay}>
                <img src={this.state.selectedDisplay}  className={this.setState.uploadMode ? styles.selectedImage : styles.uploadPreview}/>
                {this.props.user.firstName===this.props.displayUser.firstName && 
                 <Drawer scale={40} className={styles.uploadForm} closedClass={styles.uploadFormClosed} openClass={styles.uploadFormOpen}
                 switch={styles.switchButton} root={styles.uploadTool} openWidth={400}>
                <button type='submit'
                    className={styles.deleteButton}
                    onClick={(evt)=>{
                      const {selectedDisplayIndex} = this.state
                      const key = this.state[focus][selectedDisplayIndex].key
                      this.deletePhoto(key, selectedDisplayIndex)}
                    }>delete</button></Drawer>}
              </div>
            )}
        </div>
)}
}

const mapProps = state => ({user:state.user})

export default connect(mapProps)(Display)