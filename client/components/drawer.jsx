import React from 'react'

class Panel extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open: false
        }
        this.closedStyle = {
            width: this.props.scale,
            height: this.props.scale,
            borderRadius: this.props.scale,
            transition: 'height 1s, width 1s'
        }

        this.openStyle = {
          width: this.props.openWidth,
          height: this.props.openHeight,
          borderRadius: this.props.scale,
          transition: 'height .5s, width .5s'

        }
        this.togglePanel=this.togglePanel.bind(this)
    }

    togglePanel(){
        console.log('toggle')
        this.setState({open: !this.state.open})
    }

    render(){
        return (
        <div className={this.props.root}>
        <div className={this.props.switch} style={this.closedStyle}
                onClick={this.togglePanel}></div>
        <div className = {this.props.className + ' ' + (this.state.open ? this.props.openClass : this.props.closedClass)} 
            style={this.state.open ? this.openStyle : this.closedStyle}>
            {this.props.children}
        </div>
        </div>
    )}
}

export default Panel