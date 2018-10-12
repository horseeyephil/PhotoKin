import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import CompressionForm from './photoCompressionForm.jsx'
import canvasCompression from '../util/canvasCompression'
import styles from './componentStyles/uploader.css'

class UploadForm extends React.Component {
    constructor(props){
        super(props)

        this.state={
            image: null,
            photoName: '',
            uploadQuality: 0,
        }

        this.handleAFile=this.handleAFile.bind(this)
        this.compressAndUpload=this.compressAndUpload.bind(this)
        this.setUploadQuality=this.setUploadQuality.bind(this)
    }

    handleAFile(event){
        this.props.setUploadPreview(URL.createObjectURL(event.target.files[0]))
        this.setState({image: event.target.files[0], photoName: event.target.files[0].name})
    }

    setUploadQuality(uploadQuality){
        this.setState({uploadQuality})
    }

    compressAndUpload(event){
        event.preventDefault()
        const {image, uploadQuality, photoName} = this.state

        canvasCompression(image, uploadQuality).then(([thumb, fullSize])=>{

            const {user, uploadPreview} = this.props
            const attachment = new FormData()
            const date = Date.now()+'_'
            attachment.append('image', thumb, date + photoName)
            attachment.append('image', fullSize, date + photoName)

            axios.post(`/api/photography/upload/${user.username}`, attachment)
            .then(res=>{
              this.props.setUploadMode(false, uploadPreview)
            })
        })
    }

    render(){

        return (
                <form className={styles.uploadTool} onSubmit={this.compressAndUpload}>
                    <input className={styles.press} onChange = {this.handleAFile} name="myFile" type="file" />
                    <div> 
                      <button type='submit' disabled={this.state.uploadQuality<=0} className={styles.submitUpload}>Sub</button>
                      <button className={styles.submitUpload} onClick={()=>this.props.setUploadMode(false)}>Cancel</button>
                    </div>
                    {this.state.image && <CompressionForm setUploadQuality = {this.setUploadQuality} handleCompression={this.handleCompression}/>}
                </form>
        )
    }
}

const mapPropsUser = state => ({user: state.user})

export default connect(mapPropsUser)(UploadForm)