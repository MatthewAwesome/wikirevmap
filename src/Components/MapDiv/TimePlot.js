/**
A Component to make a TimePlot. 
**/
import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import {timePlotContainer} from './styles'; 
import {baseLineLayout} from './plotStuff';

var timePlotStyle = {
	width:window.innerWidth*0.6+200,
	height:80,
	overflow:'hidden',
	align:'center',
	paddingLeft:0, 
	paddingRight:0, 
}; 

export default class TimePlot extends Component{

	constructor(props){
		super(props); 
		this.state={layout:baseLineLayout,timePlotStyle:timePlotStyle,}; 
		this.updateDimensions = this.updateDimensions.bind(this); 
	}

	// Add a resize event listener: 
	componentDidMount(){
		window.addEventListener("resize", this.updateDimensions);
	}

	// Callback for resize event listener: 
	updateDimensions() {
		// Update the layout on resize: 
	  var layout = this.state.layout; 
		layout.width = window.innerWidth * 0.6 + 200; 
		layout.datarevision += 1; 
		var tps = Object.assign({},this.state.timePlotStyle); 
		tps.width = window.innerWidth * 0.6 + 200; 
    this.setState({width: window.innerWidth,height:window.innerHeight,layout:layout,timePlotStyle:tps});
  }; 

  // Updating state in response to new data received via newProps. These state changes then refresh the plot.  
  componentDidUpdate(prevProps,prevState){
  	// We've got a new page to pull: 
  	if(prevProps && prevProps.pageid != this.props.pageid){
  		var layout = baseLineLayout; 
  		this.setState({layout:layout}); 
  	}
  	// We've received new data:
  	else if(prevProps && prevProps != this.props){
  		var layout = this.state.layout; 
  		layout.datarevision += 1; 
  		// get the value;
  		var maxVal   = Math.max(...this.props.lineData[0].y);
  		var roundVal = maxVal <= 1 ? 1 : Math.floor(maxVal); 
  		var midVal   = maxVal/2; 
  		layout.yaxis.tickvals[0] = roundVal; 
  		layout.yaxis.ticktext[0] = "<b>" + roundVal.toString() + "</b>"
  		layout.annotations[0].y  = midVal; 
  		this.setState({layout:layout}); 
  	}
  }

  // Updating the component in response to newProps/State. 
  shouldComponentUpdate(nextProps,nextState){
  	if(nextProps && nextProps.pageid != this.props.pageid){
  		return true; 
  	}
		else if(nextProps && nextProps!= this.props){
			return true; 
		}
		else if(nextState && nextState != this.state){
			return true; 
		}
		else{
			return true; 
		}
  }

	render(){
		return(
			<div style = {timePlotContainer}>
				<Plot
		      data             = {this.props.lineData}
		      config           = {{displayModeBar: false}}
		      layout           = {this.state.layout}
		      style            = {this.state.timePlotStyle}
		     	onInitialized    = {(figure) => {this.setState(figure)}}
		      onRelayout       = {(figure) => {this.setState(figure)}}
		      resizeHandler    = {false}
		    />	
      </div>
		)
	}
}