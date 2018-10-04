// A stat row Component! 

import React, { Component } from 'react';
import {
	statRowStyle, 
} from './styles'; 
import {alphaGray1,alphaGray2,alphaGray3,alphaGray4} from '../../Extras/grays';

export default class StatRow extends Component {

	constructor(props){
		super(props); 
		this.state = {};  
		this.updateDimensions = this.updateDimensions.bind(this); 
	}

  updateDimensions() {
    this.setState({width: window.innerWidth,height:window.innerHeight,sliderBarStyle:slab});
  }; 

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

	render(){
		// set styles according to traceVis: 
		return(
			<div style ={statRowStyle}>
				<div 
					style = {
						{
							width:"100%",
							height:36,
							alignItems:'center',
							justifyContent:'center',
							display:'flex',
							fontSize:16,
							textAlign:'center',
							whiteSpace:'pre-line',
							backgroundColor: this.props.traceVis[2] == true ? alphaGray3 : alphaGray1,
							padding:3,
							borderRightStyle:'solid', 
							borderRightColor:'darkgray', 
							borderRightWidth:1,
							color: this.props.traceVis[2] == true ? 'rgb(150, 255, 2)' : 'lightgray',
						}
					}
					onClick = {() => this.props.toggleTrace('contributors')}
				>
					EDITORS{'\n'}{this.props.uniqueEditors}
				</div>
				<div 
					style = {
						{
							width:"100%",
							height:36,
							alignItems:'center',
							justifyContent:'center',
							display:'flex',
							fontSize:16,
							textAlign:'center',
							whiteSpace:'pre-line',
							backgroundColor: this.props.traceVis[0] == true ? alphaGray3 : alphaGray1,
							padding:3,
							borderRightStyle:'solid', 
							borderRightColor:'darkgray', 
							borderRightWidth:1,
							color: this.props.traceVis[0] == true ? 'rgb(0, 255, 255)' : 'lightgray',
						}
					}
					onClick = {() => this.props.toggleTrace('revs')}
				>
					EDITS{'\n'}{this.props.revArray.length}
				</div>
				<div style = {
						{
							width:"100%",
							height:36,
							alignItems:'center',
							justifyContent:'center',
							display:'flex',
							fontSize:16,
							textAlign:'center',
							whiteSpace:'pre-line',
							backgroundColor: this.props.traceVis[1] == true ? alphaGray3 : alphaGray1,
							padding:3,
							color: this.props.traceVis[1] == true ? 'rgb(255, 0, 235)' : 'lightgray',
						}
					}
					onClick = {() => this.props.toggleTrace('size')}
				>
					SIZE{'\n'}{this.props.currentSize}
				</div>
			</div>
		)
	}
}