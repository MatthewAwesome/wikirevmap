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
			pageurl:null, 
			trending:true,
		}; 
		this.searchResultHandler  = this.searchResultHandler.bind(this);
		this.updateDimensions     = this.updateDimensions.bind(this); 
		this.toggleTrendingTopics = this.toggleTrendingTopics.bind(this); 
	};
	
	shouldComponentUpdate(nextProps,nextState){
		if(nextProps == null){
			return true
		}
		else if(nextState && nextState.pageid != this.state.pageid){
			return true
		}
	  else if(nextState && nextState.width != this.state.width){
			return true; 
		}
	  else if(nextState && nextState.height != this.state.height){
			return true; 
		}
		else if(nextState && nextState.trending != this.state.trending){
			return true; 
		}
		else{
			return false 
		}
	}

	componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

	updateDimensions() {
  	// Lets set the dims of our view in this function: 
    this.setState({width: window.innerWidth,height:window.innerHeight});
  }; 

  // This is the is called when a user clicks on a page of interest. We update the map accordingly. 
	searchResultHandler(pageid,pageurl,imgurl){
		this.setState({pageid:pageid,pageurl:pageurl,imgurl:imgurl}); 
	}

	// For toggling on/off trending topic view. 
	toggleTrendingTopics(){
		var trending = !this.state.trending; 
		console.log('toggle')
		this.setState({trending:trending}); 
	}


	// Assembling the App into a single component:  
	render(){ 
		return (
			<div style = {mainStyle}>
				<TopBar 
					searchResultHandler = {this.searchResultHandler}
					trendingToggle      = {this.toggleTrendingTopics}
					trending            = {this.state.trending}
				/>
				<MapDiv 
					pageid   = {this.state.pageid}
					pageurl  = {this.state.pageurl} 
					imgurl   = {this.state.imgurl}
					trending = {this.state.trending}
				/>
			</div>
		); 
	}
}/// 
