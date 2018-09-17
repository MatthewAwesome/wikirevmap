/**
A Component to make a TimePlot. 
**/
import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import {timePlotContainer,timePlotStyle} from './styles'; 
import {baseLineLayout} from './plotStuff';

export default class TimePlot extends Component{

	// Construction: 
	constructor(props){
		super(props); 
		this.state={layout:baseLineLayout}; 
		this.updateDimensions = this.updateDimensions.bind(this); 
		this.renderPlot = this.renderPlot.bind(this); 

	}

	// Add a resize event listener: 
	componentDidMount(){
		window.addEventListener("resize", this.updateDimensions);
	}

	// Callback for resize event listener: 
	updateDimensions() {
    this.setState({width: window.innerWidth,height:window.innerHeight});
  }; 

  componentDidUpdate(prevProps,prevState){
  	if(prevProps && prevProps.pageid != this.props.pageid){
  		// new page: 
  		console.log('NEWPAGE')
  		var layout = baseLineLayout; 
  		this.setState({layout:layout}); 
  	}
  	else if(prevProps && prevProps != this.props){
  		var layout = this.state.layout; 
  		layout.datarevision += 1; 
  		this.setState({layout:layout}); 
  	}
  }

  // Re-rendering plot on data update: (new data is the only thing that will update this.props)
  shouldComponentUpdate(nextProps,nextState){
  	if(nextProps && nextProps.pageid != this.props.pageid){
  		return true; 
  	}
		if(nextProps && nextProps!= this.props){
			return true; 
		}
		else if(nextState && nextState != this.state){
			return true; 
		}
		else{
			return false; 
		}
  }

  renderPlot(){
  	console.log('rendering plot')
  	return(
			<Plot
	      data   = {this.props.lineData}
	      config = {{displayModeBar: false}}
	      layout = {this.state.layout}
	      style  = {timePlotStyle}
	     	onInitialized    = {(fig) => {this.setState({fig})} }
	      onRelayout       = {(figure) => {this.setState(figure)}}
	      resizeHandler = {false}
	    />	
  	)
  }
	// Render: 
	render(){
		return(
			<div style = {timePlotContainer}>
				{this.renderPlot()}
      </div>
		)
	}
}