import {alphaGray2,alphaGray5} from '../../Extras/grays'; 

const searchBarStyle = {
  width: "100%", 
	flexDirection:'row', 
	display:'flex',
	height:"35px", 
	justifyContent:'space-between', 
	alignItems:'center',
	backgroundColor:"transparent",
	borderColor:'#BBBBBB', 
	borderBottomWidth:2,
	borderBottomStyle:'solid',
}; 

const searchFieldStyle = {
	fontSize: "18px",
  backgroundColor:alphaGray2,
  paddingTop:0, 
  paddingLeft:10,
  color:'white',
  border: "none", 
  outlineWidth:0,
  width: "120%", 
  fontFamily:"courier", 
  fontWeight:"300",
}; 

const thumbStyle = {
	alignItems:'center',
	width:40,
	height:40, 
	borderRadius:40,
	borderWidth:"2px", 
	borderColor:"transparent",
	fontSize:32, 
	fontWeight:"400", 
	color:"white",
	paddingLeft:0,
}; 

const rowTitleStyle = {
	fontSize: "18px",
  backgroundColor:"transparent",
  paddingTop:0, 
  color:'white',
  border: "none", 
  outlineWidth:0,
  width: "100%",
  paddingLeft:5,
  textAlign:'center', 
  fontFamily:"courier"					
}; 

const minSearchResultStyle = {
	height:30, 
	width:"100%",
	backgroundColor:alphaGray5, 
	display:"flex", 
	flexDirection:"row", 
	alignItems:"center", 
	justifyContent:'center',
	borderColor:'#BBBBBB', 
	borderTopWidth:2,
	borderTopStyle:'solid',
}; 

const pageRowStyle = {
	flexDirection:'row', 
	display:'flex',
	height:50, 
	justifyContent:'space-between', 
	alignItems:'center',
	width: "100%", 
	backgroundColor:alphaGray2,  
	paddingLeft:0,
}; 

const searchResultStyle = {
	flexDirection:'column', 
	display:'flex',
	justifyContent:'flex-start', 
	alignItems:'flex-start',
	width: "100%",
	height:"100%",
	top:60,
	position:'absolute', 
	backgroundColor:alphaGray2,  
	zIndex:99,
}

const letterStyle = {
	alignItems:'center',
	width:40,
	height:40, 
	borderRadius:40,
	borderWidth:"2px", 
	borderColor:"transparent",
	fontSize:32, 
	fontWeight:"400", 
	color:"white",
	paddingLeft:10,
	fontFamily:'courier',
}; 


export {
	searchBarStyle,
	searchFieldStyle,
	thumbStyle, 
	rowTitleStyle, 
	minSearchResultStyle, 
	letterStyle, 
	pageRowStyle,
	searchResultStyle, 
}