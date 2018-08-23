import React from 'React'
import {connect} from 'react-redux'
import ChatBox from './chatBox'

class AdminChat extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            chatSelection : ''
        }
    }
        
        render(){
            return (
                <div className='chatBox'>
                    <div>This will be a nav</div>
                    
                </div>
            )
        }

}

export default AdminChat