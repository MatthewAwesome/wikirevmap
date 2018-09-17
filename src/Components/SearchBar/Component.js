/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	 SEARCHBAR COMPONENT
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
import React, { Component } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; 
import {searchBarStyle, searchFieldStyle} from './styles'; 
import {alphaGray2,alphaGray3} from '../../Extras/grays';
import SearchResults from './SearchResults'; 
import SearchWikipedia from './helperFunctions/SearchWikipedia'; 

export default class SearchBar extends Component{

	constructor(props) {
    super(props);
    // Setting the size: 
    if(window.innerWidth < 600){
  		var percent = "100%"; 
  	}
  	else if(window.innerWidth < 720){
  		var windowDiff = window.innerWidth - 600; 
	  	var searchWidth  = Math.round(600 + windowDiff/10); 
	  	var searchWidthPct = 100 * searchWidth / window.innerWidth;  
	  	var percent = Math.round(searchWidthPct); 
	  	var percent = percent.toString() + "%";  
  	}
  	else{
	  	var percent = "80%"; 
  	}
    // We need to map the results an array: 
    this.state = {value:'',submitFocus:false,textClick:false,Width:window.innerWidth,percent:percent,searchResults:[],visBool:true};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this); 
    this.componentWillUnmount = this.componentWillUnmount.bind(this); 
    this.textClick = this.textClick.bind(this); 
    this.updateDimensions = this.updateDimensions.bind(this);
    this.bottomArrayClick = this.bottomArrayClick.bind(this); 
    this.onLength = this.onLength.bind(this);
  }; 

  // To handle browser resize; 
  updateDimensions() {
  	// Lets set the dims of our view in this function: 
  	if(window.innerWidth < 600){
  		var percent = "100%"; 
  	}
  	else if(window.innerWidth < 720){
  		var windowDiff = window.innerWidth - 600; 
	  	var searchWidth  = Math.round(600 + windowDiff/10); 
	  	var searchWidthPct = 100 * searchWidth / window.innerWidth;  
	  	var percent = Math.round(searchWidthPct); 
	  	var percent = percent.toString() + "%";  
  	}
  	else{
	  	var percent = "80%"; 
  	}
    this.setState({Width: window.innerWidth,percent:percent});
  }; 
  // add a window resize listener upon mount. Perhaps update dimensions needs to be of broader scope. 
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  shouldComponentUpdate(nextProps,nextState){
		if(this.state == null || nextState == null){
			return false
		}
  	else if(this.state.Width > 600 && nextState.Width <= 600 ){
  		return true
  	}
  	else if(this.state.Width <= 600 && nextState.Width > 600 ){
  		return true
  	}
  	else{
  		return true
  	}
  }

	async onLength(val){
		// Search wikipedia with the string, val: 
		var searchResults = await SearchWikipedia(val); 
		if(typeof(searchResults) == "object" && searchResults.length > 0){
			this.setState({searchResults:searchResults,visBool:true})
		}
	}



	// Other stuff: 
  async handleChange(event) {
    this.setState({value: event.target.value});
    if(event.target.value.length > 2){
    	await this.onLength(this.state.value); 
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({value:''})
  }

  textClick(event){
  	var textClicked = !this.state.textClicked; 
  	this.setState({textClicked:textClicked})
  }

  bottomArrayClick(){
  	this.setState({searchResults:[],visBool:false}); 
  }

  render(){
  	return(
  		<div style = {{
  			width: this.state.percent, 
  			display:'flex', 
  			flexDirection:'column', 
  			justifyContent:'flex-start', 
  			alignItems:'flex-start', 
  		}}>
	  		<div style = {searchBarStyle}>
	  			<form onSubmit={this.handleSubmit}>
	  				<input 
	  					type = "text"
	  					value = {this.state.value}
	  					onChange={this.handleChange}
	  					placeholder = "Search Wikipedia"
	  					onClick={this.textClick} 
	  					style = {searchFieldStyle}
	  				/>
	  			</form>
				</div>
				<SearchResults 
          searchResults       = {this.state.searchResults}
          searchResultHandler = {this.props.searchResultHandler}
          arrowClickHandler   = {this.bottomArrayClick}
          visBool             = {this.state.visBool}
        />
			</div>
  	)
	}
};
