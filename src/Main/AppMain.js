/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	APPMAIN: COMBINING ALL THE CLASSES (COMPONENTS) INTO A MASTER CLASS.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

// IMPORTING STUFF: 
import React, { Component } from 'react';
// import FontAwesomeIcon from "@fontawesome/react-fontawesome";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; 
import FlagIcon from '../Extras/flag.js'; 

// Bring in our Components: 
import TopBar from '../Components/TopBar/Component'; 
import SearchBar from '../Components/SearchBar/Component';
import MapDiv from '../Components/MapDiv/Component'; 

// Import some functions and vars: 
import CheckAndAppend from './helperFunctions/CheckAndAppend'; 
import GetRevs from './helperFunctions/GetRevs'; 
import GetLocation from './helperFunctions/GetLocation'; 
import RemoveDuplicateIps from './helperFunctions/RemoveDuplicateIps'; 
import FilterRevs from './helperFunctions/FilterRevs'; 
import {mainStyle} from './styles'; 

export default class AppMain extends Component{
	constructor(props){
		super(props); 
		this.state = {
			searchFocus:false, 
			searchSelected:false, 
			randFocus:false, 
			randSelected:false, 
			title:null, 
			viewSearchBar:false,
			revData:[], 
			revCount:0,
			revArray:[],
			revPullComplete:false,
			maxTimes:1,
			bday:0,
			pageid:null, 
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
	async searchResultHandler(pageid){
		// Clear data container: 
		await this.handleSearchClick(); 
		await this.setState({pageid:pageid}); 
	}


	// Building some children right here! 
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
				<MapDiv pageid={this.state.pageid} />
			</div>
		); 
	}
}/// 
