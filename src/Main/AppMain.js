/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	APPMAIN: COMBINING ALL THE CLASSES (COMPONENTS) INTO A MASTER CLASS.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

// IMPORTING STUFF: 
import React, { Component } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; 
import FlagIcon from '../Extras/flag.js'; 

// Bring in our Components: 
import TopBar from '../Components/TopBar/Component'; 
import SearchBar from '../Components/SearchBar/Component';
import MapDiv from '../Components/MapDiv/Component'; 

// Import the style for AppMain: 
import {mainStyle} from './styles'; 

export default class AppMain extends Component{
	constructor(props){
		super(props); 
		this.state = {
			searchFocus:false, 
			searchSelected:false, 
			randFocus:false, 
			randSelected:false, 
			viewSearchBar:false,
			pageid:null, 
			pageurl:null
		}; 
		this.handleSearchClick = this.handleSearchClick.bind(this); 
		this.searchResultHandler = this.searchResultHandler.bind(this);
	};
	
	handleSearchClick(source){
		if(source == 'top'){
			var selection = !this.state.searchSelected; 
			this.setState({searchSelected:selection,viewSearchBar:selection}); 
		}
		else{
			var selection = !this.state.searchSelected; 
			this.setState({searchSelected:false,viewSearchBar:selection,searchFocus:false}); 
		}
	};

  // This is the is called when a user clicks on a page of interest: 
	async searchResultHandler(pageid,pageurl){
		// Clear data container: 
		await this.handleSearchClick(); 
		await this.setState({pageid:pageid,pageurl:pageurl}); 
	}

	// Assembling the App into a single component:  
	render(){ 
		return (
			<div style = {mainStyle}>
				<TopBar handleSearchClick = {this.handleSearchClick} searchSelected = {this.state.searchSelected}/>
				<SearchBar 
					visBool = {this.state.viewSearchBar} 
					onClick ={this.handleSearchClick}
					searchResultHandler = {this.searchResultHandler}
					arrowClickHandler = {this.handleSearchClick}
				/>
				<MapDiv pageid={this.state.pageid} pageurl={this.state.pageurl} />
			</div>
		); 
	}
}/// 
