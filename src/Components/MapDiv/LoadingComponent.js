// A loading component: 

import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import {loadingStyle,loadingTextStyle} from './styles'


export default class LoadingComponent extends Component{

	constructor(props){
		super(props); 
		this.state = {}
		console.log('loading component')
	}

	render(){
		return(
			<div style = {loadingStyle}>
					<ReactLoading type={'bars'} color={'#ffffff'} />
					Fetching the goods...
			</div>
		)
	}
}