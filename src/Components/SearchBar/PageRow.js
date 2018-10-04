import React, { Component } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; 
import {thumbStyle,letterStyle,rowTitleStyle,pageRowStyle} from './styles'; 
import {alphaGray2,alphaGray3,alphaGray5} from '../../Extras/grays';


export default class PageRow extends Component{

	constructor(props){
		super(props); 
		var bgcolor = props.index % 2 == 0 ? alphaGray3 : alphaGray2; 
		this.state            = {bgcolor:bgcolor,defaultbg:bgcolor}; 
		this.prepRow          = this.prepRow.bind(this); 
		this.clickHandler     = this.clickHandler.bind(this); 
		this.selectionHandler = this.selectionHandler.bind(this); 
	}

	prepRow(){
		// Make the middle component: 
		if(this.props.imgUrl && this.props.imgUrl.indexOf(".svg") == -1){
			var thumbComponent = <img src={this.props.imgUrl} style = {thumbStyle} />; 
		}
		else if(this.props.imgUrl && this.props.imgUrl.indexOf(".svg") != -1){
			var thumbComponent = <img src={this.props.imgUrl} style = {thumbStyle} />; 
		}
		else{
			var thumbComponent = <div style = {letterStyle}>{this.props.pageTitle.slice(0,1)}</div>; 
		}
		return thumbComponent
	}

	selectionHandler(){
		this.props.searchResultHandler(this.props.pageid,this.props.url,this.props.imgUrl); 
		this.props.resultsClearFun();
		if(this.props.trending == true){
			this.props.trendingToggle(); 
		}
	}
	clickHandler(event){
		if(event.type == "mousedown"){
			this.setState({bgcolor:alphaGray5})
		}
		else{
			this.setState({bgcolor:this.state.defaultbg})
		}
	}

	/// Now Render///
	render(){
		pageRowStyle.backgroundColor = this.state.bgcolor; 
		return(
			<div 
				style = {{
				  	flexDirection:'row', 
	  				display:'flex',
	  				height:"50px", 
	  				justifyContent:'space-between', 
	  				alignItems:'center',
	  				width: "100%", 
	  				backgroundColor:this.state.bgcolor,  
	  				paddingLeft:0,
	  		}}
				onClick     = {this.selectionHandler}
				onMouseDown = { (event) => this.clickHandler(event) }
				onMouseUp   = { (event) => this.clickHandler(event) }
			>
				{this.prepRow()}
				<div style = {rowTitleStyle}>
					{this.props.pageTitle}
				</div>
			</div>
		)
	}
}///
