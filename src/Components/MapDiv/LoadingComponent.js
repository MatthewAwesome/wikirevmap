// A loading component: 

import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import {loadingStyle,loadingTextStyle} from './styles'


export default class LoadingComponent extends Component{

	constructor(props){
		super(props); 
		this.state = {width:window.innerWidth}
		this.updateDimensions = this.updateDimensions.bind(this); 
	}; 

  updateDimensions() {
  	// Lets set the dims of our view in this function: 
    this.setState({width: window.innerWidth});
  }; 

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }; 

  componentWillUnmount(){
  	 window.removeEventListener("resize", this.updateDimensions);
  }

	shouldComponentUpdate(nextProps,nextState){
		if(nextState && nextState.width != this.state.width){
			return true; 
		}
		else{
			return false; 
		}
	}; 

	render(){
		return(
			<div style = {loadingStyle}>
					<ReactLoading type={'bars'} color={'#ffffff'} />
					<p>Fetching the goods...</p>
					<p>(Some pages take a while to load, especially those beseiged with a barrage of edits)</p>
			</div>
		)
	}; 
}