import React, { Component } from 'react';
import PageRow from './PageRow'; 
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; 
import {minSearchResultStyle,searchResultStyle} from './styles'; 
import {alphaGray2} from '../../Extras/grays';

export default class SearchResults extends Component {

	constructor(props){
		super(props); 
		this.resultsToComponent = this.resultsToComponent.bind(this); 
		this.arrowClickHandler  = props.arrowClickHandler.bind(this); 
	}

	shouldComponentUpdate(nextProps,nextState){
		if(nextProps != this.props || nextState != this.state){
			return true
		}
		else{
			return false
		}
	}

	resultsToComponent(){
		// return null
		var results = this.props.searchResults; 
		var componentArray = results.map( (element,index) => {
				if(element.title.length > 38){
					var title = element.title.slice(0,37) + '...'; 
				}
				else{
					var title = element.title
				}
				if(element.image){
					return(
						<PageRow 
							imgUrl              = {element.image}
							pageTitle           = {title}
							searchResultHandler = {this.props.searchResultHandler}
							pageid              = {element.pageid}
							index               = {index}
							url                 = {element.url}
							key                 = {index.toString()}
							resultsClearFun     = {this.props.arrowClickHandler}
						/> 
					)
				}///
				else{
					return(
						<PageRow
							Color               = {element.color}
							pageTitle           = {title}
							searchResultHandler = {this.props.searchResultHandler}
							pageid              = {element.pageid}
							index               = {index}
							url                 = {element.url}
							key                 = {index.toString()}
							resultsClearFun     = {this.props.arrowClickHandler}
						/> 
					)
				}
			}
		)
		return componentArray
	}/// 

	render(){
		if(typeof(this.props.searchResults) == 'object' && this.props.searchResults.length > 0){
			var Components = this.resultsToComponent(); 
			return(
				<div style = {searchResultStyle}>
					{Components}
					<div style = {minSearchResultStyle} onClick = {this.props.arrowClickHandler}>
						<FontAwesomeIcon
	  					icon="angle-double-up"
							style = { {
	    						color: "lightgray", 
									height:"24px",
									width:"24px", 	
								}
							}
						/>
					</div>
				</div>
			)
		}///
		else{
			return(null)
		}
	}
}///