// Styles for the MapDiv: 
import {alphaGray2,alphaGray5} from '../../Extras/grays'; 

// const mapDivStyle = {
// 	width: "100%",
// 	height: window.innerHeight-40,
// 	position:'absolute',
// 	display:'flex',
// 	flexDirection:'column',
// 	top:60,
// 	left:0,
// 	alignItems:'center', 
// 	justifyContent:'space-around'
// }; 

const mapDivStyle = {
	width: "100%",
	display:'flex', 
	flexDirection:'column',
	justifyContent:'flex-start', 
	alignItems:'center', 
	height:window.innerHeight-60,
}; 

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

var controlBarStyle = {
	width:"100%", 
	display:'flex', 
	flexDirection:'row', 
	justifyContent: 'center', 
	alignItems:'center', 
	paddingBottom:10,
}; 

const sliderBarStyle = {
	width:"60%",  
	height:50,
	alignItems:'center', 
	justifyContent:'center', 
	paddingBottom:20, 
	paddingLeft:5, 
	paddingRight:5,
}; 

const buttonDivStyle = {
	height:70, 
	width:"20%", 
	display:'flex', 
	flexDirection:'row', 
	justifyContent:'space-around', 
	alignItems:'center', 
	paddingBottom:20,
	paddingRight:3, 
	paddingLeft:3,
}; 

const playButtonStyle = {
	height:"32px",
	width:"32px",
	borderRadius:"32px"
}; 

const pauseButtonStyle = {
	height:"32px",
	width:"32px",
	borderRadius:"32px"
}; 

const soundButtonStyle = {
	height:"32px",
	width:"32px",
	borderRadius:"32px"
}; 

const statRowStyle = {
	display:'flex', 
	flexDirection:'row', 
	width:"100%", 
	justifyContent:'space-between', 
	alignItems:'center', 
	fontFamily:'courier', 
	fontSize:14, 
	fontWeight:300, 
	color:'white', 
}

const dataFlexStyle = {
	display:'flex', 
	flexDirection:'column', 
	height:window.innerHeight-60, 
	width:"100%", 
}

const timePlotContainer = {
	width:"100%",
	display:'flex',
	flexDirection:'row',
	justifyContent:'center', 
	alignItems:'flex-start',
}

const timePlotStyle = {
	width:"60%",
	height:80,
	overflow:'hidden',
	align:'center', 
}

export {
	mapDivStyle, 
	loadingStyle,
	loadingTextStyle, 
	controlBarStyle, 
	sliderBarStyle, 
	buttonDivStyle, 
	playButtonStyle, 
	pauseButtonStyle, 
	soundButtonStyle, 
	statRowStyle, 
	timePlotContainer, 
	timePlotStyle, 
}