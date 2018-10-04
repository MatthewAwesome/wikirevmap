// Styles for the MapDiv: 
import {alphaGray1,alphaGray2,alphaGray3,alphaGray4,alphaGray5} from '../../Extras/grays'; 

const loadingStyle = {
	height:"100%", 
	width:"100%", 
	display:'flex', 
	flexDirection:'column', 
	justifyContent:'center', 
	alignItems:'center', 
	backgroundColor:alphaGray2,
	fontFamily:'courier', 
	color:'white',
}; 

const loadingTextStyle = {
	fontFamily:'courier', 
	fontSize:20, 
	fontWeight:400,
};  

const controlBarStyle = {
	width:"100%", 
	display:'flex', 
	flexDirection:'row', 
	justifyContent: 'center', 
	alignItems:'center', 
	height:80,
	paddingTop:10,
}; 

const rightButtonDivStyle = {
	height:70, 
	width:"20%", 
	display:'flex', 
	flexDirection:'row', 
	justifyContent:'flex-start', 
	alignItems:'center', 
	paddingLeft:0,
	zIndex:1,
}; 

const leftButtonDivStyle = {
	height:70, 
	width:"20%", 
	display:'flex', 
	flexDirection:'row', 
	justifyContent:'flex-end', 
	alignItems:'center', 
	paddingRight:0,
	zIndex:1,
}; 

const playButtonStyle = {
	height:"28px",
	width:"28px",
	borderRadius:"28px", 
	padding:10,
}; 

const pauseButtonStyle = {
	height:"28px",
	width:"28px",
	borderRadius:"28px", 
	padding:10,
}; 

const soundButtonStyle = {
	height:"28px",
	width:"28px",
	borderRadius:"28px",
	padding:10,
}; 

const arrowButtonStyle = {
	height:"28px",
	width:"28px",
	borderRadius:"28px",
	padding:10,
	color:'white',
}; 

const rewindButtonStyle = {
	height:"28px",
	width:"28px",
	borderRadius:"28px",
	padding:10,
	color:'darkgray',
}; 

const statRowStyle = {
	display:'flex', 
	flexDirection:'row', 
	width:"100%", 
	justifyContent:'space-around', 
	alignItems:'center', 
	fontFamily:'courier', 
	fontSize:14, 
	fontWeight:300, 
	color:'lightgray', 
	zIndex:1,
	paddingBottom:2,
	height:35,
	paddingTop:10,
}

const timePlotContainer = {
	width:"100%",
	display:'flex',
	flexDirection:'row',
	justifyContent:'center', 
	alignItems:'flex-start',
	height:80,
	paddingTop:3,
}

const titleRowStyle = {
	width:"100%", 
	height:30, 
	display:'flex',
	flexDirection:'row', 
	justifyContent:'space-between',  
	alignItems:'center', 
}

const titleStyle = {
	height:30, 
	color:'white', 
	fontFamily:'courier', 
	fontSize:24, 
	fontWeight:400,
	textAlign:'center',
	paddingLeft:10,
	paddingRight:10,
}; 

const thumbStyle = {
	width:30,
	height:30, 
	borderRadius:30,
	borderWidth:"2px", 
	borderColor:"transparent",
	fontSize:24, 
	fontWeight:"400", 
	color:"white",
	paddingLeft:0,
	alignItems:'center', 
	align:'center'
}; 

const letterStyle = {
	width:30,
	height:30, 
	fontSize:24, 
	fontWeight:"400", 
	color:"white",
	paddingLeft:8,
	fontFamily:'courier',
	textAlign:'center',
}; 

const mapDivStyle = {
	width: "100%",
	display:'flex', 
	flexDirection:'column',
	justifyContent:'flex-start', 
	alignItems:'center', 
	height:window.innerHeight-60,
}; 

const mapPlotContainer = {
	width:"100%",
	display:'flex',
	flexDirection:'row',
	justifyContent:'center', 
	alignItems:'flex-start',
	height:window.innerHeight-300, 
	paddingBottom:4,
}; 

export { 
	loadingStyle,
	loadingTextStyle, 
	controlBarStyle, 
	rightButtonDivStyle, 
	leftButtonDivStyle,
	playButtonStyle, 
	pauseButtonStyle, 
	soundButtonStyle, 
	statRowStyle, 
	timePlotContainer, 
	thumbStyle, 
	letterStyle, 
	titleStyle, 
	titleRowStyle,
	rewindButtonStyle,
	mapPlotContainer,
	mapDivStyle,
	arrowButtonStyle,
}