import React from 'React'
import {connect} from 'react-redux'

import ChatBox from './chatBox'
import AuthorizedChatBox from './authorizedChatBox'

class Chat extends React.Component {
    constructor(props){
        super(props)
        this.state = {author: '', chats: []}
    }


    render(){
        return (
            <div>
                <h2>{this.props.user.name || 'Friend'}</h2>
                {this.state.chats.length > 0 && this.state.chats.map(eachChat => (
                    <div>eachChat</div>
                ))}
                <a href="/auth/fb">Let's Oauth with Facebook!</a>
                {this.props.user.name && <ChatBox />}
            </div>
        )
    }
}

const mapState = state => ({user: state.user})

export default connect(mapState)(Chat)
