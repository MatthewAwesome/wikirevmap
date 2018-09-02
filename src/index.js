/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	BEGIN INDEX.JS:
	VISUALIZING WIKIPEDIA EDITS!
>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

// IMPORTING STUFF: 
import React, { Component } from 'react';
import ReactDOM from "react-dom"; 
import AppMain from './Main/AppMain'; 
import SliderTest from './SliderTest'; 
// import FontAwesomeIcon from "@fontawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, 
				 faKey,
				 faSearch,
	       faDice,
	       faArrowRight,
	       faAngleDoubleUp,
	       faPauseCircle, 
	       faPlayCircle,
	       faVolumeOff, 
	       faVolumeUp, 
} from '@fortawesome/free-solid-svg-icons';
// Add them to our library. 
library.add(
	faEnvelope, 
	faKey, 
	faSearch, 
	faDice,
	faArrowRight,
	faAngleDoubleUp,
	faPlayCircle,
	faPauseCircle, 
	faVolumeOff, 
	faVolumeUp,
);

console.log(library)

/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	PLACING APP MAIN INTO CONTAINER COMPONENT TO ALIGN WITH WEBPACK. 
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

const Index = () => {
	return (
		<div style = {{height:window.innerHeight}}>
			<AppMain/>
		</div>
	); 
	///
}; 

/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	RENDER THE APP 		
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
document.body.style.overflow = "hidden"
ReactDOM.render(<Index/>, document.getElementById("index")); 



