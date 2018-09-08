// Styles for the MapDiv: 
import {alphaGray2,alphaGray5} from '../../Extras/grays'; 

const mapDivStyle = {
	width: "100%",
	height: window.innerHeight-40,
	position:'absolute',
	display:'flex',
	flexDirection:'column',
	top:60,
	left:0,
	align:'left',
	alignItems:'flex-start'
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
	height:120, 
	display:'flex', 
	flexDirection:'column', 
	justifyContent: 'flex-start', 
	alignItems:'center', 
	paddingBottom:0,
}; 

const sliderBarStyle = {
	width:"60%",  
	height:50,
	alignItems:'center', 
	justifyContent:'center', 
	paddingBottom:20, 
}; 

const buttonDivStyle = {
	height:30, 
	width:"60%", 
	display:'flex', 
	flexDirection:'row', 
	justifyContent:'space-around', 
	alignItems:'center', 
}; 

const playButtonStyle = {
	height:"24px",
	width:"24px",
	padding:"6px",
	borderRadius:"24px"
}; 

const pauseButtonStyle = {
	height:"24px",
	width:"24px",
	padding:"6px",
	borderRadius:"24px"
}; 

const soundButtonStyle = {
	height:"24px",
	width:"24px",
	padding:"6px",
	borderRadius:"24px"
}; 

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
}