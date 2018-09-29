import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import CompressionForm from './photoCompressionForm.jsx'
import canvasCompression from '../util/canvasCompression'
import styles from './componentStyles/uploader.css'

const frame = {width: 600, height: 'auto', display: 'block'}


class Photo extends React.Component {


    constructor(props){
        super(props)

        this.state={
            photoPreview: null,
            photoName: '',
            library: false,
            uploadQuality: 0,
            openTool: true
        }

        this.handleAFile=this.handleAFile.bind(this)
        this.handleUpload=this.handleUpload.bind(this)
        this.handleCompression=this.handleCompression.bind(this)
        this.setUploadQuality=this.setUploadQuality.bind(this)
    }

    handleAFile(event){

        this.setState({photoPreview: event.target.files[0], photoName: event.target.files[0].name})
    }

    handleUpload(event){
        const {user} = this.props
        event.preventDefault()

        const attachment = new FormData()
        attachment.append('image', this.state.photoPreview)

        axios.post(`/api/photography/upload/${user.firstName+user.lastName+user.id}`, attachment).then(console.log)
    }

    setUploadQuality(uploadQuality){
        this.setState({uploadQuality})
    }

    handleCompression(event){

        event.preventDefault()

        const image = this.state.photoPreview
        canvasCompression(image, this.state.uploadQuality).then(([thumb, fullSize])=>{

            const {user} = this.props
            const attachment = new FormData()
            attachment.append('image', thumb, Date.now() + this.state.photoName)
            attachment.append('image', fullSize, Date.now() + this.state.photoName)

            axios.post(`/api/photography/upload/${user.firstName+user.lastName+user.id}`, attachment)
            .then(res=>res.data)
            .then(res=>{

                console.log(res)
                this.setState({photoPreview: null})
            })
        })
    }

    render(){

        return (
            <div className = {styles.uploadTool}>
            <div className={styles.switchButton}
            onClick = {()=>{this.setState({openTool: !this.state.openTool})}}>U</div>
                {true && <div className={this.state.openTool ? styles.uploadFormClosed : styles.uploadFormOpen}>
                <form onSubmit={this.handleCompression}>
                    <input onChange = {this.handleAFile} name="myFile" type="file" />
                    {this.state.uploadQuality>0 && <button>Sub</button>}
                </form>
                {this.state.photoPreview && <div>
                    <img style={frame} src={URL.createObjectURL(this.state.photoPreview)} />
                    <CompressionForm setUploadQuality = {this.setUploadQuality} handleCompression={this.handleCompression}/>
                </div>}
                </div>}
            </div>

        )
    }
}

const mapPropsUser = state => ({user: state.user})

export default connect(mapPropsUser)(Photo)