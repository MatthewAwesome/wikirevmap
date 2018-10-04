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
    // We need to map the results an array: 
    this.state            = { value:'',
                              submitFocus:false,
                              textClick:false,
                              width:window.innerWidth,
                              searchResults:[],
                              visBool:true
                            };
    this.handleChange     = this.handleChange.bind(this);
    this.handleSubmit     = this.handleSubmit.bind(this);
    this.textClick        = this.textClick.bind(this); 
    this.updateDimensions = this.updateDimensions.bind(this);
    this.bottomArrayClick = this.bottomArrayClick.bind(this); 
    this.onLength         = this.onLength.bind(this);
    this.clearSearch      = this.clearSearch.bind(this); 
  }; 

  // To handle browser resize; 
  updateDimensions() {
  	// Lets set the dims of our view in this function: 
    this.setState({width: window.innerWidth});
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
  	else if(this.state.width != nextState.width){
  		return true
  	}
  	else{
  		return true
  	}
  }

	async onLength(val){
		// Search wikipedia with the string, val: 
		let searchResults = await SearchWikipedia(val); 
		if(typeof(searchResults) == "object" && searchResults.length > 0){
			this.setState({searchResults:searchResults,visBool:true})
		}
	}



	// Other stuff: 
  async handleChange(event) {
    this.setState({value: event.target.value});
    if(event.target.value.length > 2){
    	await this.onLength(event.target.value); 
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({value:''})
  }

  clearSearch(){
    this.setState({value:''}); 
  }

  textClick(event){
  	var textClicked = !this.state.textClicked; 
  	this.setState({textClicked:textClicked})
  }

  bottomArrayClick(){
  	this.setState({searchResults:[],visBool:false,value:'',}); 
  }

  render(){
  	return(
  		<div style = {{
  			width: "100%", 
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
          trendingToggle      = {this.props.trendingToggle}
          trending            = {this.props.trending}
        />
			</div>
  	)
	}
};
