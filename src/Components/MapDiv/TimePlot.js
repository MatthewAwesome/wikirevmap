/**
A Component to make a TimePlot. 
**/
import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import {timePlotContainer} from './styles'; 
import {baseLineLayout} from './plotStuff';

var timePlotStyle = {
	width: window.innerWidth*0.48+200 > window.innerWidth ? window.innerWidth : window.innerWidth*0.48+200 ,
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
	  var layout    = this.state.layout; 
	  var tps       = Object.assign({},this.state.timePlotStyle); 
	  var newWidth  = window.innerWidth * 0.48 + 200; 
	  if(newWidth > window.innerWidth){
		  layout.width         = window.innerWidth; 
			tps.width            = window.innerWidth; 
			layout.datarevision += 1; 
	  }
	  else{
		  layout.width         = newWidth; 
			tps.width            = newWidth; 
			layout.datarevision += 1; 
	  }

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
  		// Our default is edits/time
  		var layout = this.state.layout; 
  		layout.datarevision += 1;
  		// We have to layout the annotations according to the root axis: 
			var maxEdits   = Math.max(...this.props.lineData[0].y);
			var roundEdits = Math.ceil(maxEdits); 
			var midVal = roundEdits/2; 
  		// SIZE: 
  		if(this.props.traceVis[1] == true){
  			layout.xaxis.range[1] = this.props.lineData[1].x.length-1; 
	  		var maxSize   = Math.max(...this.props.lineData[1].y);
	  		var roundSize = maxSize <= 1 ? 1 : Math.floor(maxSize); 
	  		var maxSizeStr = maxSize.toString().slice(0,4); 
	  		if(maxSizeStr.indexOf('.') == 3){
	  			maxSizeStr = maxSizeStr.slice(0,3); 
	  		} 
	  		layout.yaxis2.tickvals[0] = maxSize; 
	  		layout.yaxis2.ticktext[0] = '<b style="color:rgb(255,0,235);">' + maxSizeStr + '</b>'; 
				// clear the other one: 
				layout.yaxis3.tickvals[0] = 0;  
	  		layout.yaxis3.ticktext[0] = '';
	  		layout.annotations[1].y  = midVal; 
  		}
  		// CONTRIBUTORS: 
  		else if(this.props.traceVis[2] == true){
	  		var maxContribs =  Math.max(...this.props.lineData[2].y);
	  		var roundContribs = maxContribs <= 1 ? 1 : Math.floor(maxContribs); 
  			layout.xaxis.range[1] = this.props.lineData[2].x.length-1; 
  	  	layout.yaxis3.tickvals[0] = roundContribs; 
	  		layout.yaxis3.ticktext[0] = "<b>" + roundContribs.toString() + "</b>"	
	  		layout.yaxis3.autorange = false; 
  			layout.yaxis3.range = [0,roundContribs]; 
	  		layout.annotations[2].y  = midVal; 
  		}
  		// EDITS: 
  		else{
  			// get the value (we use changes in data to change the layout...)
	  		console.log(maxEdits,roundEdits,midVal)
	  		layout.xaxis.range[1] = this.props.lineData[0].x.length-1; 
	  		layout.yaxis.tickvals[0] = roundEdits; 
	  		layout.yaxis.ticktext[0] = "<b>" + roundEdits.toString() + "</b>"; 
	  		layout.yaxis.range
	  		console.log(layout.yaxis.ticktext)
	  		layout.yaxis.autorange = false; 
  			layout.yaxis.range = [0,roundEdits];  
				layout.annotations[0].y  = midVal; 
  		}
			// Move the annotations:  	 
			for(let j = 0; j<this.props.traceVis.length; j++){
				layout.annotations[j].visible = this.props.traceVis[j];
				var jplus = j+1; 
				var axisString = j == 0 ? 'yaxis':'yaxis'+jplus.toString(); 
				console.log(axisString); 
				layout[axisString].visible = this.props.traceVis[j]; 
			}
  		// layout.yaxis2.visible = true;  
  		// layout.yaxis3.visible = this.props.traceVis[2];
  		console.log(layout)
  		// setState! 
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