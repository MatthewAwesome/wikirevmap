// Styles for the MapDiv: 
import {alphaGray2,alphaGray5} from '../../Extras/grays'; 


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
	zIndex:1,
	paddingBottom:2,
	borderBottomWidth:2, 
	borderBottomColor:alphaGray5,
	height:40,
}

const timePlotContainer = {
	width:"100%",
	display:'flex',
	flexDirection:'row',
	justifyContent:'center', 
	alignItems:'flex-start',
	height:80,
	paddingTop:5,
}

const timePlotStyle = {
	width:"60%",
	height:80,
	overflow:'hidden',
	align:'center',
	paddingLeft:0, 
	paddingRight:0, 
}

export { 
	loadingStyle,
	loadingTextStyle, 
	controlBarStyle, 
	rightButtonDivStyle, 
	leftButtonDivStyle
,	playButtonStyle, 
	pauseButtonStyle, 
	soundButtonStyle, 
	statRowStyle, 
	timePlotContainer, 
}