import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import PhotoDisplay from './photoDisplay.jsx'
import CompressionForm from './photoCompressionForm.jsx'
import canvasCompression from '../util/canvasCompression'

const frame = {width: 800, height: 'auto', display: 'block'}


class Photo extends React.Component {


    constructor(props){
        super(props)

        this.state={
            photoPreview: null,
            library: false,
            canvasAppear: false
        }
        this.handleAFile=this.handleAFile.bind(this)
        this.handleUpload=this.handleUpload.bind(this)
        this.handleCompression=this.handleCompression.bind(this)
    }

    handleAFile(event){
        this.setState({photoPreview: event.target.files[0]})
    }

    handleUpload(event){
        const {user} = this.props
        event.preventDefault()

        const attachment = new FormData()
        attachment.append('image', this.state.photoPreview)

        axios.post(`/api/photography/upload/${user.firstName+user.lastName+user.id}`, attachment).then(console.log)
    }

    handleCompression(){
        const data = URL.createObjectURL(this.state.photoPreview)
        console.log('Time to compress', data)
        canvasCompression(data)
    }
    
    render(){

        return (
            <div>PHOTOS GO

            <img style={frame} src={'/photos/plannedWork.jpg'}/>
            <form onSubmit={this.handleUpload}>
                <span>Looking to upload a photo</span>
                <input onChange = {this.handleAFile} name="myFile" type="file" />
                <button>Sub</button>
            </form>
            {this.props.user && (
                <button onClick = {()=>this.setState({library: !this.state.library})}
                >LOAD MY LIBRARY</button>)
            }
            {this.state.photoPreview && <div>
                <img style={frame} src={URL.createObjectURL(this.state.photoPreview)} />
                <CompressionForm handleCompression={this.handleCompression}/>
            </div>}
            {this.state.library && <PhotoDisplay displayUser={this.props.user}/>}
            {this.state.photoPreview && <canvas id='theCanvas' style={{border: '1px solid black'}}/>}
            </div>

        )
    }
}

const mapPropsUser = state => ({user: state.user})

export default connect(mapPropsUser)(Photo)