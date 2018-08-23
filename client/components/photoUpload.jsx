import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import PhotoDisplay from './photoDisplay.jsx'

const frame = {width: 200, height: 150, display: 'block'}


class Photo extends React.Component {


    constructor(props){
        super(props)

        this.state={
            photoPreview: null,
            library: false
        }
        this.handleAFile=this.handleAFile.bind(this)
        this.handleUpload=this.handleUpload.bind(this)
    }

    handleAFile(event){
        console.log('files are in the computer ', event.target.files)
        this.setState({photoPreview: event.target.files[0]})
    }

    handleUpload(event){
        const {user} = this.props
        event.preventDefault()

        const attachment = new FormData()
        attachment.append('image', this.state.photoPreview)

        axios.post(`/api/photography/upload/${user.firstName+user.lastName+user.id}`, attachment).then(console.log)
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
                <div onClick = {()=>this.setState({library: !this.state.library})}
                >LOAD MY LIBRARY</div>)
            }
            {this.state.photoPreview && <img style={frame} src={URL.createObjectURL(this.state.photoPreview)} />}
            {this.state.library && <PhotoDisplay user={this.props.user}/>}
            </div>

        )
    }
}

const mapPropsUser = state => ({user: state.user})

export default connect(mapPropsUser)(Photo)