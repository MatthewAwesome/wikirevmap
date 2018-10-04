import React, { Component } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; 
import {titleStyle, topRowStyle} from './styles'; 
import SearchBar from '../SearchBar/Component';


export default class TopBar extends Component {

	constructor(props){
		super(props);
		this.state = {
			width:window.innerWidth, 
		}; 
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
		else if(nextProps.trending != this.props.trending){
			return true
		}
		else{
			return false 
		}
	}


	render(){
		return(
			<div style = {topRowStyle}>
				<SearchBar 
					searchResultHandler = {this.props.searchResultHandler}
					trendingToggle      = {this.props.trendingToggle}
					trending            = {this.props.trending}
				/>
				<div style = {{display:'flex',flexDirection:'row'}}>
					<FontAwesomeIcon
						icon="fire"
						style = {
							{
	  						color: this.props.trending ? "white": "darkgray", 
								height:"24px",
								width:"24px",
								padding:"6px",
								borderRadius:"24px", 
								borderWidth:2,
								borderColor:this.props.trending ? "white": "darkgray",  
								borderStyle:'solid', 
								paddingRight:3,
						}
					}
					onClick = { () => this.props.trendingToggle() }
					/>
					<span style = {{width:10}}/>
					<FontAwesomeIcon
						icon="info"
						style = { {
	  						color: this.state.searchFocus ? "darkgray": "black", 
								height:"24px",
								width:"24px",
								backgroundColor: this.state.searchFocus  ? "lightgray" : "white", 
								backgroundColor: this.props.searchSelected  ? "lightgray" : "white", 
								padding:"6px",
								borderRadius:"24px"
						}
					}
					/>
				</div>
			</div>
		)
	}
}
////

				// <FontAwesomeIcon
				// 	icon="search"
				// 	onClick ={this.searchClickListener}
				// 	onMouseEnter = {this.mouseOnSearch}
				// 	onMouseLeave	= {this.mouseOffSearch}
				// 	style = { {
  		// 				color: this.state.searchFocus ? "darkgray": "black", 
				// 			height:"32px",
				// 			width:"32px",
				// 			backgroundColor: this.state.searchFocus  ? "lightgray" : "#555555", 
				// 			backgroundColor: this.props.searchSelected  ? "lightgray" : "#555555", 
				// 			padding:"6px",
				// 			borderRadius:"32px"
				// 	}
				// }
				// />