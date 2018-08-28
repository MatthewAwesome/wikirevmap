/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	BEGIN INDEX.JS:
	VISUALIZING WIKIPEDIA EDITS!
>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

// IMPORTING STUFF: 
import React, { Component } from 'react';
import ReactDOM from "react-dom"; 
import AppMain from './Main/AppMain'
// import FontAwesomeIcon from "@fontawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey, faSearch, faDice, faArrowRight,faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
library.add(faEnvelope, faKey, faSearch, faDice, faArrowRight, faAngleDoubleUp);


/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	PLACING APP MAIN INTO CONTAINER COMPONENT TO ALIGN WITH WEBPACK. 
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

const Index = () => {
		return (
			<div>
				<AppMain/>
			</div>
		); 
	///
}; 

/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	RENDER THE APP 		
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

ReactDOM.render(<Index/>, document.getElementById("index")); 



