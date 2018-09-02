// ControlBar Component! 
import React, { Component } from 'react';
import Slider from 'react-rangeslider'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTimeout from 'react-timeout'; 


const controlBarStyle = {
	width:"100%", 
	height:100, 
	display:'flex', 
	flexDirection:'column', 
	justifyContent: 'flex-start', 
	alignItems:'center', 
}; 

const sliderBarStyle = {
	width:"70%",  
	height:50,
	alignItems:'center', 
	justifyContent:'center', 
}; 

const buttonDivStyle = {
	height:50, 
	width:"70%", 
	display:'flex', 
	flexDirection:'row', 
	justifyContent:'space-around', 
	alignItems:'center', 
}; 

const playButtonStyle = {
	height:"32px",
	width:"32px",
	padding:"6px",
	borderRadius:"32px"
}; 

const pauseButtonStyle = {
	height:"32px",
	width:"32px",
	padding:"6px",
	borderRadius:"32px"
}; 

const soundButtonStyle = {
	height:"32px",
	width:"32px",
	padding:"6px",
	borderRadius:"32px"
}; 

class ControlBar extends Component{

	constructor(props){
		super(props); 
		this.state = {
    	playing:false, 
    	muted:false,
		}; 
		this.onPause = this.onPause.bind(this); 
		this.onPlay = this.onPlay.bind(this); 
		this.onMute = this.onMute.bind(this); 
		this.updateDimensions = this.updateDimensions.bind(this); 
	}

	// To handle browser resize; 
  updateDimensions() {
  	// Lets set the dims of our view in this function: 
    this.setState({
    	width: window.innerWidth,  
    });
  }; 


  // Lifecycle methods to keep things zippy.
  shouldComponentUpdate(nextProps,nextState){
  	if(nextProps && nextProps != this.props){
  		return true
  	}
  	else if(nextState && nextState != this.state){
  		return true; 
  	}
  	else if(nextState && nextState.width != this.state.width){
  		return true; 
  	}
  	else{
  		return false; 
  	}
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

  onPlay(){
  	var playing = !this.state.playing; 
  	this.setState({playing:playing})
  	this.props.onPlay();
  }

  onPause(){
  	// We are going to make the pause button flash, 300ms. 
  	var playing = !this.state.playing; 
  	this.setState({playing:playing})
  	this.props.onPause(); 
  }

  onMute(){
  	var muted = !this.state.muted; 
  	this.setState({muted:muted})
  	this.props.onMute(); 
  }

	render(){

		// Update styles according to state/props: 
		playButtonStyle.color  = this.props.playing != null ? 'white' : 'darkgray'; 
		pauseButtonStyle.color = this.props.playing != null ? 'darkgray' : 'darkgray'; 
		soundButtonStyle.color = "darkgray";
		let volIcon = this.state.muted ? "volume-off" : "volume-up"; 
		return(
			<div style = {controlBarStyle}>
				<div style = {sliderBarStyle}>
					<Slider 
						min      = {0}
						max      = {100}
						value    = {this.props.sliderVal}
						onChange = {this.props.onSliderChange}
					/>
				</div>
				<div style = {buttonDivStyle}>
					<FontAwesomeIcon
						icon="play-circle"
						onClick ={this.onPlay}
						style = {playButtonStyle}
					/>
					<FontAwesomeIcon
						icon="pause-circle"
						onClick ={this.onPause}
						style = {pauseButtonStyle}
					/>
					<FontAwesomeIcon
						icon={volIcon}
						onClick ={this.onMute}
						style = {soundButtonStyle}
					/>
				</div>
			</div>
		)
	}
}

export default ControlBar;

