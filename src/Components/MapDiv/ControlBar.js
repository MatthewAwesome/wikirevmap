// ControlBar Component! 
import React, { Component } from 'react';
import Slider from 'react-rangeslider'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTimeout from 'react-timeout'; 
import {
	controlBarStyle, 
	rightButtonDivStyle, 
	leftButtonDivStyle, 
	playButtonStyle, 
	pauseButtonStyle, 
	soundButtonStyle, 
	rewindButtonStyle,
} from './styles';
// Inline stying here: 
var sliderBarStyle = {
	width:window.innerWidth*0.6+20,  
	height:70,
	alignItems:'center', 
	justifyContent:'center', 
	paddingTop:22,
}; 
// Place into a container class for export and use by Parent Component: 
export default class ControlBar extends Component{
	constructor(props){
		super(props); 
		this.state = {
    	playing:false, 
    	muted:false,
    	width:window.innerWidth,
    	height:window.innerHeight, 
    	sliderBarStyle:sliderBarStyle, 
		}; 
		this.onPause          = this.onPause.bind(this); 
		this.onPlay           = this.onPlay.bind(this); 
		this.onMute           = this.onMute.bind(this); 
		this.updateDimensions = this.updateDimensions.bind(this); 
	}
  // Listen to resize events, and call this.updateDimensions() when on is detected. 
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
	// To handle browser resize: 
  updateDimensions() {
  	var slab = Object.assign({},this.state.sliderBarStyle); 
  	slab.width = window.innerWidth * 0.6+20; 
    this.setState({width: window.innerWidth,height:window.innerHeight,sliderBarStyle:slab});
  }; 
  // Determine if an update is needed: 
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
  	else if(nextState && nextState.height != this.state.height){
  		return true; 
  	}
  	else{
  		return false; 
  	}
  }
  // For the play button: 
  onPlay(){
  	var playing = !this.state.playing; 
  	this.setState({playing:playing})
  	this.props.onPlay();
  }
  //...the pause button:
  onPause(){
  	// We are going to make the pause button flash, 300ms. 
  	var playing = !this.state.playing; 
  	this.setState({playing:playing})
  	this.props.onPause(); 
  }
  //...the mute/unmute button!
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
		// Determining the sound Icon via sound state: 
		let volIcon = this.state.muted ? "volume-off" : "volume-up"; 
		return(
			<div style = {controlBarStyle}>
				<div style = {leftButtonDivStyle}>
					<FontAwesomeIcon
						icon="pause-circle"
						onClick ={this.onPause}
						style = {pauseButtonStyle}
					/>
					<FontAwesomeIcon
						icon="play-circle"
						onClick ={this.onPlay}
						style = {playButtonStyle}
					/>
				</div>
				<div style = {this.state.sliderBarStyle}>
					<Slider 
						min      = {0}
						max      = {594}
						value    = {this.props.sliderVal}
						onChange = {this.props.onSliderChange}
						labels   = {this.props.labels}
						tooltip={false}
					/>
				</div>
				<div style = {rightButtonDivStyle}>
					<FontAwesomeIcon
						icon="undo"
						onClick ={ () => this.props.onRewind() }
						style = {rewindButtonStyle}
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


