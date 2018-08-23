import React from 'React'
import {connect} from 'react-redux'
import {postChat, fetchChats} from '../store/chats'
import ChatNav from './chatNav'

class Chat extends React.Component {
    constructor(props){
        super(props)
        this.state = {   
            currentText: '',
            collapse: false,
            userList: false,
            selectedChats: ''
        }
        this.sendChat = this.sendChat.bind(this)
        this.setText = this.setText.bind(this)
        this.enterPress = this.enterPress.bind(this)
        this.toggleCollapse = this.toggleCollapse.bind(this)
        this.toggleUserList = this.toggleUserList.bind(this)
    }

    componentDidMount(){
        this.props.populateChat(this.props.user.id)
    }

    sendChat(){
        this.props.sendChat(this.state.currentText, this.props.user.id)
        this.setState({currentText: ''})
    }

    setText(evt){
        this.setState({currentText: evt.target.value})
    }

    enterPress(evt){
        if(evt.charCode===13) this.sendChat()
    }

    toggleCollapse(){
        this.setState({collapse: !this.state.collapse})
    }

    toggleUserList(id){
        this.setState({userList: id})
    }

    render(){

        const chatsToShow = this.props.chats.filter(eachChat=>eachChat.userId===this.state.userList)

        //console.log(this.state.currentText)
        return (
            <div className={this.state.collapse ? "chatBoxCollapse" : "chatBox"}>
            <ChatNav toggleUserList = {this.toggleUserList} userName = {this.props.user.name} toggleCollapse={this.toggleCollapse}/>
            {this.props.user.isAdmin && !this.state.userList ? 
                (<div>{
                    this.props.user.isAdmin && 
                    this.props.allUsers.map(eachUser=>(
                        <div onClick={()=>this.toggleUserList(eachUser.id)}>{eachUser.name}</div>
                    ))
                }</div>)
                :   (<div>

               <div style={{display: 'flex', height: '10%'}}>
                <input 
                    style={{ width: '98%', border: '1px solid black'}} 
                    value={this.state.currentText} 
                    onChange = {this.setText}
                    onKeyPress = {this.enterPress}
                />
                <button style = {{ width: '40px'}} onClick={this.sendChat}>></button>
                </div>
                {chatsToShow.length>0 && chatsToShow.map(eachConvo=>(
                    <div>{eachConvo.conversation + '   ' + eachConvo.userId}</div>
                ))}
            </div>)}
        
            </div>
        )
    }

}

const mapState = state => ({chats: state.chats, user: state.user, allUsers: state.myUsers})
const mapDispatch = dispatch => ({sendChat: (chat, id) => dispatch(postChat(chat, id)), populateChat: (id) => dispatch(fetchChats(id))})

export default connect(mapState, mapDispatch)(Chat)
