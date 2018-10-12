import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import PhotoStrip from './tileStrip.jsx'
import UploadTool from './photoUpload.jsx'
import styles from './componentStyles/photoDisplay.css'
import Drawer from './switch.jsx'
import immutableSplice from '../util/immutableSplice'


class Display extends React.Component{

constructor(props){
    super(props)
    this.state={
        userKeys: {},
        userImages: {}, 
        selectedDisplay: '',
        selectedDisplayIndex: null,
        uploadMode: false,
        uploadPreview: '',

    }
    this.loadLibrary = this.loadLibrary.bind(this)
    this.deletePhoto = this.deletePhoto.bind(this)
    this.fetchSelection = this.fetchSelection.bind(this)
    this.createDisplay = this.createDisplay.bind(this)
    this.setUploadMode = this.setUploadMode.bind(this)
    this.setUploadPreview = this.setUploadPreview.bind(this)
}

loadLibrary(username){

    axios.get(`/api/photography/library/${username}`).then(res=>res.data).then(paths=>{
        this.setState({
          userKeys: {...this.state.userKeys, [username]: paths},
          userImages: {...this.state.userImages, [username]: new Array(paths.length).fill(null)},
        })
      })
      .catch(err=>{console.log('Failed to load user library ', err)})
}

setUploadMode(bool, optionalAppend){ 
  if(optionalAppend){
    const {username} = this.props.user
    this.setState({
      uploadMode: bool, 
      userKeys: {...this.state.userKeys, [username]: [...this.state.userKeys[username], optionalAppend]},
      userImages: {...this.state.userImages, [username]: [...this.state.userImages[username], optionalAppend]},
    },_=>{
      this.props.history.push(`${this.state.userImages[username].length-1}`)}
    )
  }
  else this.setState({uploadMode: bool})
}

setUploadPreview(uploadPreview){
  this.setState({uploadPreview})
}

createDisplay(url, index){

  const {username} = this.props.match.params

  this.setState({
    selectedDisplay: url, selectedDisplayIndex: index,
    userImages: {...this.state.userImages, 
      [username]: immutableSplice(this.state.userImages[username], index, url)
  }})
}

fetchSelection(key, index){

  //const key = this.state.userKeys[index].key
  
  axios(`/api/photography/library/${key}`)
  .then(url=>url.data)
  .then(url=>{
    this.createDisplay(url,index)
  })
  .catch(err=>{
    console.log('Error retrieving photo ', err)
  })
}

deletePhoto(){

  const {username} = this.props.match.params
  const splicePoint = this.state.selectedDisplayIndex
  const key = this.state[username][splicePoint].key

    axios.put(`/api/photography/`, {key}).then(res=>{
        if(res.status===204){

            const cb = _=>{this.props.history.push('0')}

            this.setState({
              userKeys: {...this.state.userKeys, 
                [username]: immutableSplice(this.state.userKeys[username], splicePoint)},
              userImages: {...this.state.userImages,
                [username]: immutableSplice(this.state.userImages[username], splicePoint)   
              }
            }, cb)
        }
    })
}

componentDidMount(){
    //this.loadLibrary(this.props.match.params.username)
}

componentDidUpdate(prevProps, prevState, snapshot){
  
  const {username, photoId} = this.props.match.params
  const keys = this.state.userKeys[username]
  const images = this.state.userImages[username]

  console.log('keys', keys, images, photoId)
    
    if(!keys){
      this.loadLibrary(username)
    }

    else if(images && images[photoId] === null){
      this.fetchSelection(keys[photoId].key, +photoId)
    }
    // else if(images && photoId) {
    //   console.log('here')
    //   this.createDisplay(images[photoId], photoId)
    // }
}

render(){ 
    const {username, photoId} = this.props.match.params
    const thumbs = this.state.userKeys[username]
    const ownPage = (username===this.props.user.username)
    const selection = this.state.userImages[username] ? this.state.userImages[username][photoId] : null 
    const display = this.state.uploadMode ? this.state.uploadPreview : selection

    return (
        <div className={styles.display}>
            {   this.state.uploadMode ? <UploadTool setUploadPreview={this.setUploadPreview} setUploadMode={this.setUploadMode} 
            uploadPreview={this.state.uploadPreview}/> 
            : (<PhotoStrip ownPage={ownPage} username={username} thumbs={thumbs} setUploadMode={this.setUploadMode} />)}
            {this.state.selectedDisplay && (
              <div className={styles.selectedDisplay}>
                <img src={display}  className={this.state.uploadMode ? styles.uploadPreview : styles.selectedImage}/>
                {ownPage && 
                 <Drawer root={styles.deleteDrawer} buttonClass={styles.deleteButton} closedClass={styles.deleteClosed} openClass={styles.deleteOpen}
                 switch={styles.deleteSwitch} label='delete'
                 cb={this.deletePhoto}
                />}
              </div>
            )}
        </div>
)}
}

const mapProps = state => ({user:state.user, allUsers: state.myUsers})

export default connect(mapProps)(Display)