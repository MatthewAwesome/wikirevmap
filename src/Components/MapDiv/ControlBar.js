// ControlBar Component! 
import React, { Component } from 'react';
import Slider from 'react-rangeslider'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTimeout from 'react-timeout'; 
import {
	controlBarStyle, 
	sliderBarStyle, 
	buttonDivStyle, 
	playButtonStyle, 
	pauseButtonStyle, 
	soundButtonStyle, 
} from './styles';

// Place into a container class for use by Parent Component: 
export default class ControlBar extends Component{

	constructor(props){

		super(props); 

		this.state = {
    	playing:false, 
    	muted:false,
    	width:window.innerWidth,
    	height:window.innerHeight, 
		}; 

		this.onPause = this.onPause.bind(this); 
		this.onPlay = this.onPlay.bind(this); 
		this.onMute = this.onMute.bind(this); 
		this.updateDimensions = this.updateDimensions.bind(this); 
		this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this); 
	}
  // Listen to resize events, and call this.updateDimensions() when on is detected. 
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
	// To handle browser resize: 
  updateDimensions() {
    this.setState({width: window.innerWidth,height:window.innerHeight});
  }; 

  // Lifecycle methods to keep things zippy.

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



  // Button/slider handlers:

  // For the play button: 
  onPlay(){
  	var playing = !this.state.playing; 
  	this.setState({playing:playing})
  	this.props.onPlay();
  }

  // ... the pause button:
  onPause(){
  	// We are going to make the pause button flash, 300ms. 
  	var playing = !this.state.playing; 
  	this.setState({playing:playing})
  	this.props.onPause(); 
  }

  // ... the mute/unmute button!
  onMute(){
  	var muted = !this.state.muted; 
  	this.setState({muted:muted})
  	this.props.onMute(); 
  }

  // Finally, the only necessary function of them all: RENDER!
	render(){

		// Update styles according to state/props: 
		playButtonStyle.color  = this.props.playing != null ? 'white' : 'darkgray'; 
		pauseButtonStyle.color = this.props.playing != null ? 'darkgray' : 'darkgray'; 
		soundButtonStyle.color = "darkgray";

		// Determining the sound Icon via sound state: 
		let volIcon = this.state.muted ? "volume-off" : "volume-up"; 

		// Package it all into a div and sent it on its way... 
		return(
			<div style = {controlBarStyle}>
				<div style = {buttonDivStyle}>
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
				<div style = {sliderBarStyle}>
					<Slider 
						min      = {0}
						max      = {594}
						value    = {this.props.sliderVal}
						onChange = {this.props.onSliderChange}
						labels   = {this.props.labels}
						tooltip={true}
					/>
				</div>
				<div style = {buttonDivStyle}>
					<FontAwesomeIcon
						icon="undo"
						onClick ={this.onMute}
						style = {soundButtonStyle}
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


