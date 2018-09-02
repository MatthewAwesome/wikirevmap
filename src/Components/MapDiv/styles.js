// Styles for the MapDiv: 
import {alphaGray2,alphaGray5} from '../../Extras/grays'; 

const mapDivStyle = {
	width: window.innerWidth,
	height: window.innerHeight-40,
	position:'absolute',
	display:'flex',
	flexDirection:'column',
	top:60,
	left:0,
	align:'left',
	alignItems:'flex-start'
}

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
} 

export {mapDivStyle, loadingStyle, loadingTextStyle}