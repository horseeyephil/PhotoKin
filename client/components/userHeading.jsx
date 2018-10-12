import React from 'react'
import styles from './componentStyles/nav.css'

class Title extends React.Component{

    constructor(props){
        super(props)
        this.state={
            name: this.props.username
        }
        this.handleText = this.handleText.bind(this)
    }

    handleText(event){
      this.setState({name: event.target.value})
    }

    render(){
        return (
          <input className = {styles.nameHeader}
          value={this.state.name} onChange={this.handleText}>
          </input>
        )
    }

}

export default Title