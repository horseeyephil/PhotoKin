import React from 'react'

class Panel extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            toggled: this.props.toggled
        }
        this.togglePanel=this.togglePanel.bind(this)
        this.triggerCallBack=this.triggerCallBack.bind(this)
    }

    togglePanel(evt){
        event.stopPropagation()
        this.setState({toggled: !this.state.toggled})
    }

    triggerCallBack(event){
      console.log('we here?')
      this.props.cb && this.props.cb()
      this.setState({toggled: !this.state.toggled})
    }

    getDerivedStateFromProps(props,state){
      if(props.toggled!==state.toggled) return {toggled: props.toggled}
    }

    render(){
        return (
          <div className={this.props.root}>
            <div className = {this.props.buttonClass + ' ' + (this.state.toggled ? this.props.openClass : this.props.closedClass)} 
            onClick={this.triggerCallBack}>{this.props.label}</div>
            <div className={this.props.switch} onClick={this.togglePanel}></div>
          </div>
    )}
}

export default Panel