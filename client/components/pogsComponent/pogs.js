import React from 'React';
import {CSSTransition} from 'react-transition-group'
import Spotlight from '../spotlight';
import { isBoolean } from 'util';
// import Spotlight from '../spotlight'


class Pogs extends React.Component {
  constructor(props) {
    super()
    this.state = {
      on: 0, 
      featured: false, 
      shrink: true,
      top: '',
      left: '',
      diffX: null,
      diffY: null
    }

    this.showPogs = this.showPogs.bind(this)
    this.showFeature = this.showFeature.bind(this)
    this.shrinkPalette = this.shrinkPalette.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleDragStart = this.handleDragStart.bind(this)
  }

  showPogs(e){
    e.preventDefault()
    const toggle = this.state.on ? 0 : 1
      this.setState({on: toggle})
  }

  showFeature(feature){
    // this.shrinkPalette()
    this.setState({featured:feature})
    setTimeout(()=>window.scroll({top: window.innerHeight*0.88, behavior: 'smooth'}), 10)
  }

  shrinkPalette(){
    this.setState({shrink: !this.state.shrink})
  }

  handleDrag(event){
      //event.preventDefault()
      //event.target.parentElement.clientHeight

      console.log('offsetTop! ', event.target.offsetTop)
      console.log('offsetheight ', event.target.offsetHeight)
      const moveY = event.clientY - this.state.diffY
      //console.log('this is the top at time of drag', moveY)

      if((event.clientX || event.clientY) && moveY < event.target.parentElement.clientHeight && event.target.offsetTop - event.target.offsetHeight > 8) this.setState({left: event.clientX - this.state.diffX, top: moveY})
  }

  handleDragStart(event){

    // const empty = document.createElement('img')
    // empty.src='/assets/CCPOG.png'
    // empty.style.visibility='none'
    // event.dataTransfer.setDragImage(empty,0,0)
    

    this.setState({diffX: event.clientX - event.target.offsetLeft, diffY: event.clientY - event.target.offsetTop})
    return false
  }

  render() {
    return (
        <div>
        <div id='palette' className={this.state.shrink ? "fullPalette" : "shrunkenPalette"}>
            <img id="face" className="profilePog" src="/assets/profile.jpg" onClick={this.showPogs} />
            
            <CSSTransition 
            in={this.state.on} classNames="spiral" timeout={1000} unmountOnExit>
            
              <img key="phi" draggable style={{top: this.state.top, left: this.state.left}} onDragStart = {this.handleDragStart} onDrag={this.handleDrag}
                  className="profilePog" src="/assets/KingdomPog.png" onClick={()=>this.showFeature('capstone')} />
            
            </CSSTransition>

            <CSSTransition in={this.state.on} classNames="spiralTwo" timeout={1000} unmountOnExit>
              
              <img key="phi" className="profilePog" src="/assets/TaggerThree.png" onClick={()=>this.showFeature('graceshopper')} />
              
            </CSSTransition>

            <CSSTransition in={this.state.on} classNames="spiralThree" timeout={1000} unmountOnExit>
            
            <img key="phi" className="profilePog" src="/assets/CCPOG.png" onClick={()=>this.showFeature('stackathon')}  />
          
          </CSSTransition>

           <CSSTransition in={this.state.on} classNames="spiralFour" timeout={1000} unmountOnExit>
            
            <img key="phi" className="profilePog" style = {{border: '1px dotted red'}} src="/assets/profile.jpg" onClick={()=>this.showFeature('personalSite')} />
          
          </CSSTransition>
        </div>

        <CSSTransition in={Boolean(this.state.featured)} classNames="spotlightFade" timeout={500} unmountOnExit>
          <Spotlight selectedFeature={this.state.featured} />
        </CSSTransition>

        </div>
        
    );
  }
}

export default Pogs;
