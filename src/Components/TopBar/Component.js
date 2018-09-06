import React, { Component } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; 
import {titleStyle, topRowStyle} from './styles'; 


export default class TopBar extends Component {

	constructor(props){
		super(props);
		this.state = {
			searchFocus:this.props.searchSelected, 
			randFocus:false, 
			randSelected:false, 
			width:window.innerWidth, 
		}; 
		this.mouseOnSearch = this.mouseOnSearch.bind(this); 
		this.mouseOffSearch =  this.mouseOffSearch.bind(this); 
		this.mouseOnRand = this.mouseOnRand.bind(this); 
		this.mouseOffRand = this.mouseOffRand.bind(this);  
		this.searchClickListener = this.searchClickListener.bind(this);
		this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this); 
		this.updateDimensions = this.updateDimensions.bind(this); 
	}

	updateDimensions() {
  	// Lets set the dims of our view in this function: 
    this.setState({width: window.innerWidth});
  }; 


  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

	shouldComponentUpdate(nextProps,nextState){
		if(nextProps == null){
			return true
		}
	  else if(nextState && nextState.width != this.state.width){
			return true; 
		}
		else if(nextProps.searchSelected != this.props.searchSelected){
			return true
		}

		else{
			return false 
		}
	}
	// Some class methods to make things pop: 

	mouseOnSearch(event){
		this.setState({searchFocus:true,viewSearchBar:true}); 
	};

	mouseOffSearch(event){
		var searchView = this.props.searchSelected; 
		this.setState({searchFocus:searchView,viewSearchBar:searchView}); 

	};

	mouseOnRand(event){
		this.setState({randFocus:true}); 
	};

	mouseOffRand(event){
		this.setState({randFocus:false}); 
	};

  searchClickListener(){
  	// Toggle search selection! 
  	var searchSelected = !this.state.searchSelected; 
  	this.setState({searchSelected:this.props.searchSelected}); 
  	this.props.handleSearchClick('top'); 
  }

	render(){
		return(
			<div style = {topRowStyle}>
			  <FontAwesomeIcon
					icon="search"
					onClick ={this.searchClickListener}
					onMouseEnter = {this.mouseOnSearch}
					onMouseLeave	= {this.mouseOffSearch}
					style = { {
  						color: this.state.searchFocus ? "darkgray": "black", 
							height:"32px",
							width:"32px",
							backgroundColor: this.state.searchFocus  ? "lightgray" : "#555555", 
							backgroundColor: this.props.searchSelected  ? "lightgray" : "#555555", 
							padding:"6px",
							borderRadius:"32px"
					}
				}
				/>
	  		<div style = {titleStyle}>
					WIKI_REV_MAP
				</div>
				<FontAwesomeIcon
					icon="dice"
					onClick ={this.props.handleRandClick}
					onMouseEnter = {this.mouseOnRand}
					onMouseLeave	= {this.mouseOffRand}
					style = { {
  						color: this.state.randFocus ? "darkgray": "black", 
							height:"32px",
							width:"32px",
							backgroundColor: this.state.randFocus ? "lightgray" : "#555555", 
							padding:"6px",
							borderRadius:"32px"
						}
					}
				/>
			</div>
		)
	}
}////
