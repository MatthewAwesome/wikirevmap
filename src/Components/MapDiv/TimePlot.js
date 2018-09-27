/**
A Component to make a TimePlot. 
**/
import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import {timePlotContainer} from './styles'; 
import {baseLineLayout} from './plotStuff';

var timePlotStyle = {
	width: window.innerWidth*0.6+200 > window.innerWidth ? window.innerWidth : window.innerWidth*0.6+200 ,
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
	  var newWidth  = window.innerWidth * 0.6 + 200; 
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
  		var layout = this.state.layout; 
  		layout.datarevision += 1; 
  		// get the value (we use changes in data to change the layout...)
  		var maxEdits   = Math.max(...this.props.lineData[0].y);
  		var roundEdits = maxEdits <= 1 ? 1 : Math.floor(maxEdits); 
  		var midVal   = maxEdits/2;
  		layout.yaxis.tickvals[0] = roundEdits; 
  		layout.yaxis.ticktext[0] = this.props.traceVis[0] ? "<b>" + roundEdits.toString() + "</b>" : '';
  		// for size: 
  		var maxSize   = Math.max(...this.props.lineData[1].y);
  		var roundSize = maxSize <= 1 ? 1 : Math.floor(maxSize); 
  		var maxSizeStr = maxSize.toString().slice(0,4); 
  		if(maxSizeStr.indexOf('.') == 3){
  			maxSizeStr = maxSizeStr.slice(0,3); 
  		}
  		// for contributors: 
  		var maxContribs =  Math.max(...this.props.lineData[2].y);
  		var roundContribs = maxContribs <= 1 ? 1 : Math.floor(maxContribs); 
  		// We add tick vals depending on visiblility: 
  		if(this.props.traceVis[1] == true && this.props.traceVis[2] == false){
	  		layout.yaxis2.tickvals[0] = maxSize; 
	  		layout.yaxis2.ticktext[0] = '<b style="color:rgb(255,0,235);">' + maxSizeStr + '</b>'; 
	  		layout.yaxis2.visible = true; 
	  		layout.annotations[1].visible = true; 
	  		layout.annotations[2].visible = false; 
				layout.annotations[3].visible = false; 
				// clear the other one: 
				layout.yaxis3.tickvals[0] = 0;  
	  		layout.yaxis3.ticktext[0] = '';
	  		layout.yaxis3.visible = false; 
  		}
  		else if(this.props.traceVis[1] == false && this.props.traceVis[2] == true){
  	  	layout.yaxis3.tickvals[0] = roundContribs; 
	  		layout.yaxis3.ticktext[0] = "<b>" + roundContribs.toString() + "</b>"	
	  		layout.yaxis3.visible = true;
	  		layout.annotations[1].visible = false; 
	  		layout.annotations[2].visible = true; 
				layout.annotations[3].visible = false; 
				layout.yaxis2.tickvals[0] = 0;  
	  		layout.yaxis2.ticktext[0] = '';
	  		layout.yaxis2.visible = false;
  		}
  		else if(this.props.traceVis[1] == true && this.props.traceVis[2] == true){
  			// need to take both into account: 
  	  	layout.yaxis3.tickvals[0] = roundContribs; 
	  		layout.yaxis3.ticktext[0] = '<b style="color:rgb(150, 255, 2);">' + roundContribs.toString() + '</b><b style="color:rgb(255,0,235);">(' + maxSizeStr +')</b>'
	  		layout.annotations[1].visible = false; 
	  		layout.annotations[2].visible = false; 
				layout.annotations[3].visible = true;
				layout.yaxis2.visible = false;
				layout.yaxis3.visible = true; 			
  		}
  		else{
  			layout.annotations[1].visible = false; 
  			layout.annotations[2].visible = false; 
				layout.annotations[3].visible = false; 
				layout.yaxis2.visible = false;
				layout.yaxis3.visible = false;
  		}
			// Move the annotations:  	 
  		layout.annotations[0].y  = midVal; 
  		layout.annotations[1].y  = midVal; 
  		layout.annotations[2].y  = midVal; 
  		layout.annotations[3].y  = midVal; 
  		layout.annotations[0].visible = this.props.traceVis[0]; 
  		// layout.yaxis2.visible = true;  
  		// layout.yaxis3.visible = this.props.traceVis[2];

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