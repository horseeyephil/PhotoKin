import React from 'react'
import styles from './componentStyles/nav.css'

class Panel extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open: 'Closed'
        }
        this.style = {
            width: this.props.scale,
            height: this.props.scale,
            borderRadius: this.props.scale,
        }
        this.togglePanel=this.togglePanel.bind(this)
    }

    togglePanel(){
        if(this.state.open === 'Open') this.setState({open: 'Closed'})
        else this.setState({open: 'Open'})
    }

    render(){
        return (
        <div className={styles.navTool}>
        <div className={styles.switchButton} style={this.style}
                onClick={this.togglePanel}
            ></div>
        <div className = {styles['nav'+this.state.open]} 
            style={this.state.open === 'Closed' ? this.style : null}>
            {this.props.children}
        </div>
        </div>
    )}
}

export default Panel