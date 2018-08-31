import React, { Component } from 'react';
import LoadingComponent from './LoadingComponent'; 
import Plot from 'react-plotly.js';
import {mapDivStyle} from './styles'; 
import CheckAndAppend from './helperFunctions/CheckAndAppend'; 
import GetRevs from './helperFunctions/GetRevs'; 
import GetLocation from './helperFunctions/GetLocation'; 
import RemoveDuplicateIps from './helperFunctions/RemoveDuplicateIps'; 
import FilterRevs from './helperFunctions/FilterRevs'; 


/* Some notes on what we need to do here: 

We need to make an animation slider. 

MOVING ALL THE FETCHING OF DATA INTO THIS FUCKING COMPONENT! 
*/

export default class MapDiv extends Component{

	constructor(props){

		// super-size, anyone? 
		super(props); 

		// Some variables for potential use: 
    var D      = new Date(); 
    // frameWidth=100 days! (a lot of millseconds in 100 days, eh?)
    var frameWidth = 8.64e9;  

    // Defining a default layout: 
    var mapLayout = {
	    title: 'Wikipedia Edit Map for <a href="https://en.wikipedia.org/wiki/Neuroscience"> Neuroscience</a>',
	    geo:{
	      showcoastlines: true,
	      projection:{
	        type: "miller", 
	      }, 
	      scope:'world',
	      showland:true,
	      showocean:true,
	      oceancolor: 'rgb(0, 0, 0)',
	      landcolor: 'rgb(0, 0, 0)',
	      coastlinecolor: '#777777',
	      coastlinewidth:1,
	      bgcolor:'black',
	      margin:{l:0,r:0,t:0,b:0},
	      lonaxis:{range:[-180,180]}
	    },
	    margin:{l:0,r:0,t:0,b:0},
	    plot_bgcolor:"black",
	    paper_bgcolor:"#000",
	    autosize:true,
  	};

    // Initialize the state container: 
    this.state = { data: [{type: 'scattergeo'}], 
	    layout: mapLayout,
	    frames: [],
	    config: {displayModeBar: false},
	    rawdata:[],
	    now:D.getTime(),
	    frameWidth:frameWidth,
	    sliderSteps:[],
	    revPullComplete:false,
	    bday:null, 
	    revCount:0, 
	    maxTimes:1,
	    fetching:false, 
	    baseLayout:mapLayout, 
	    baseData:[{type: 'scattergeo'}],
	    cleared:true, 
	    width:window.innerWidth, 
  	};

  	// Instantiating some audio (typewriter sounds) to be played as frames are animated. 
  	var abc = 'abcdefghijklmnopqrstuvwxyz'; 
  	var soundsArray = []; 
  	for(let j = 0; j < abc.length; j++){
  		var url = require("../../Assets/Sounds/" + abc[j] + ".mp3");  
  		soundsArray.push(new Audio(url)); 
  	}
  	this.soundsArray = soundsArray; 

 		// Some function, the utility of which will soon become apparent: 
		this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this); 
		this.componentDidUpdate    = this.componentDidUpdate.bind(this); 
		this.Unpack                = this.Unpack.bind(this); 
		this.framifyData           = this.framifyData.bind(this); 
		this.getFrameData          = this.getFrameData.bind(this); 
		this.revPuller             = this.revPuller.bind(this); 
		this.getNumberOfFrames     = this.getNumberOfFrames.bind(this); 
		this.loopSounds            = this.loopSounds.bind(this); 
		this.playSound             = this.playSound.bind(this); 
		this.updateDimensions      = this.updateDimensions.bind(this); 
	}

  // To handle browser resize; 
  updateDimensions() {
  	// Lets set the dims of our view in this function: 
    this.setState({width: window.innerWidth});
  }; 

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }


	// A change in props will prompt an update in this Component, as defined via componentShouldUpdate. 
	// What we do here is essentiall update the update. Basically, we the iniial update just resets the props, 
	// Now we utilize the new props and actually UPDATE the data and display accordingly. 
	async componentDidUpdate(prevProps,prevState){

		// Do we need to clear existing data: 
		if(prevProps.pageid != this.props.pageid && this.state.cleared == false){
			//
			var D = new Date(); 
			await this.setState({
				frames:[],
				data:this.state.baseData,
				layout:this.state.baseLayout,
				sliderSteps:[],
				now:D.getTime(),
				revPullComplete:false,
				bday:null,
				revCount:0,
				maxTimes:1,
				fetching:false, 
				cleared:true,
			});  
		}

		// Is there no existing data? If so, we pull revs for selected page according to its pageid: 
		else if(prevProps.pageid != this.props.pageid && this.state.cleared == true){
			console.log('about to pull')
			await this.revPuller();
		}


		else if(prevState.cleared == false && this.state.cleared == true){
			await this.revPuller(); 
		}

		// Have we pulled all revs for our page of interest? If so, we place the data into frames: 
		else if(prevState.revPullComplete == false && this.state.revPullComplete == true){
			await this.framifyData(); 
		}

	}

	// Update when re receive new data: 
	shouldComponentUpdate(nextProps,nextState){

		// This tells us to being pulling the data: 
		if(nextProps && nextProps.pageid != this.props.pageid){
			return true; 
		}

		// Perhaps we have to clear things! 
		else if(this.state.cleared != nextState.cleared){
			return true; 
		}

		// This tell us to framfiy the data: 
		else if(nextState && nextState.revPullComplete == true){
			return true; 
		}

		// Tells us we have new frames and are ready to display accordingly: 
		else if(nextState && this.state.frames.length && this.state.frames.length != nextState.frames.length){
			return true; 
		}

		else if(nextState && nextState.fetching != this.state.fetching){
			return true;
		}

		else if(nextState && nextState.width != this.state.width){
			return true; 
		}

		// If all else fails, we don't update the thing: 
		else{
			return false; 
		}

	}

	async revPuller(){
		try{
			await this.setState({fetching:true}); 
			// Pulling revs! 
			var revCount = 0; 
			// The first call happens outside of the below WHILE loop. 
			var revData = await GetRevs(this.props.pageid); 
			var bday    = new Date(revData.revs[0].timestamp); 
			bday = bday.getTime(); 
			// Filter Revs: 
      revData.revs = FilterRevs(revData.revs); 
      // Handle duplicates and get locations: 
      var noDups =  RemoveDuplicateIps(revData.revs); 
      revData.revs = noDups; 
      noDups = null; 
      // Now we get the locations and remove revs that don't yield location data: 
      var keeperArray = []; 
      revData.revs = await revData.revs.reduce( 
      	async function (acc,currElement){
      		if(currElement.user != null){
      			let locationData = await GetLocation(currElement.user); 
      			if(locationData != null){
		      		// Go through the fields of location object and add them to {b}. 
		      		var keys = Object.keys(locationData);  
			      	for(let k = 0; k < keys.length; k++){
				      	currElement[keys[k]] = locationData[keys[k]]; 
				      }	
				      keeperArray.push(currElement); 
				      return acc
		      	}
      		}
      	},[]
      ); 
      revData.revs = keeperArray; 
      keeperArray = null; 
			revCount += revData.revsPulled; 
			await this.setState({bday:bday,revCount:revCount,revArray:revData.revs}); 
			// Further processing the rev data to display on map: 
			// This is the first rev: 
			while(revData.cont != null ){
				// Keep calling the api and updating the data container: 
				revData      = await GetRevs(this.props.pageid,revData.cont); 
				revCount    += revData.revsPulled; 
				revData.revs = FilterRevs(revData.revs); 
				noDups       = await RemoveDuplicateIps(revData.revs); 
				revData.revs = noDups; 
				// Perhaps we've already searched some of these IPs? We don't want to do so again...CheckAndAppend! 
				var appendedRevs = await CheckAndAppend(revData.revs,this.state.revArray); 
				await this.setState({revArray:appendedRevs,revCount:revCount});
				if(revData.cont == null){
					noDups = null; 
					this.setState({revPullComplete:true})
					break
				}
			}
		}
		catch(error){
			console.log('Error in search result handler: ', error); 
		}
	}

	// onDataUpdate()
	getNumberOfFrames(){

		// The last timestamp in each timesArray should be the most recent. Put all the 
		// 'most recent' timestamps into an array and get the max:  
		var tArray = this.state.revArray.map(
			(x) => {
				return x.timesArray[x.timesArray.length-1];
			}
		)
		var maxTime  = Math.max(...tArray); 
		var startTime = this.state.frames.length*this.state.frameWidth + this.state.bday; 
		// Make the available frames. 
		if(this.state.revPullComplete == false){
			var numFrames = Math.floor((maxTime-startTime)/this.state.frameWidth);
		}
		else{
			var numFrames = Math.ceil((maxTime-startTime)/this.state.frameWidth);
		}
		// Lets make some frames and update the state accordingly: 
		return numFrames
	}

	// Function to place data into frames as dictated by the incoming data: 
	async framifyData(){
		try{

			// Arrays and such: 
			var frames      =  []; 
			var sliderSteps =  []; 
			var layout      = this.state.layout; 
			var framesToAdd = this.getNumberOfFrames(); 

			var times = this.state.revArray.map( (x) => {
				return x.timesArray.length; 
			})

			var maxTimes = Math.max(...times); 
			await this.setState({maxTimes:maxTimes}); 

			// Filling the arrays frame by frame: 
			for(let i = 0; i < framesToAdd; i++){

				// Define start/end time for the current frame: 
				var frameStartTime = i * this.state.frameWidth + this.state.bday;  
				var frameEndTime   = (i + 1) * this.state.frameWidth + this.state.bday; 

				// Filter the according to start/end times, and subsequently slice the timesArrays: 
				var filteredData = this.state.revArray.filter( (x) => {
					var tIndex = x.timesArray.findIndex( t => t < frameEndTime); 
					if(tIndex != -1){
						return true
					}
					else{
						return false; 
					}
				}).map(
					(x) => {
						var last_t_index = x.timesArray.findIndex( t => t > frameEndTime);
						if(last_t_index != -1){
							x.timesArray = x.timesArray.slice(0,last_t_index);
						}
						return x 
					}
				); 

				// Assemble data container: 
				var frameData  = this.getFrameData(filteredData); 
				var frameIdStr = i.toString(); 
				var frame      = {data:frameData,name:frameIdStr}

				// Add frame: 
				frames.push(frame); 

				// Make a slider step for this frame: 
				var sliderObj = {
					method:'animate',
					label:frameIdStr,
					args:[ 
						[frameIdStr], 
						{mode:'immediate',transition:{duration:600},frame:{duration:600,redraw:false}}
					]
				}; 
				sliderSteps.push(sliderObj); 
			} // FRAME ASSEMBLY COMPLETE //

			// Endowing layout object with frame info: 

			// UPDATEMENUS: This gives out plot component play/pause buttons: 
			var updatemenus = [{
	      x: 0,
	      y: 0,
	      yanchor: 'top',
	      xanchor: 'left',
	      showactive: true,
	      direction: 'left',
	      type: 'buttons',
	      pad: {t: 0, r: 10},
	      buttons: [{
	        method: 'animate',
	        args: [null, {
	          mode: 'immediate',
	          fromcurrent: true,
	          transition: {duration: 0},
	          frame: {duration: 300, redraw: false}
	        }],
	        label: 'Play'
	      }, {
	        method: 'animate',
	        args: [[null], {
	          mode: 'immediate',
	          transition: {duration: 0},
	          frame: {duration: 300, redraw: false}
	        }],
	        label: 'Pause'
	      }]
	    }]; 

	    // SLIDERS gives our plot component a slider bar: 
	    var sliders = [{
	      pad: {l: 130, t: 0,b:10},
	      currentvalue: {
	        visible: true,
	        prefix: 'Step:',
	        xanchor: 'right',
	        font: {size: 20, color: '#666'}
	      },
	      steps: sliderSteps, 
	      active:0,
	    }]

	    // Append the layout object accordingly: 
	    layout.updatemenus = updatemenus; 
	    layout.sliders = sliders; 

	    // Finally, set the state and that's a wrap for this function: 
			await this.setState({layout:layout,frames:frames,sliderSteps:sliderSteps,cleared:false,fetching:false}); 
		}
		catch(error){
			console.log('ERROR: ', error)
		}
	}

	getFrameData(data){

		// Retrieve certain info from {data}: 
    var lats       = this.Unpack(data,'latitude') ;
    var lons       = this.Unpack(data,'longitude'); 
    var tstamps    = this.Unpack(data,'timesArray'); 

    // Arrays to house of plot info:  
    var markerSizes     = []; 
    var textArray       = []; 
    var markerColors    = []; 
    var markerOpacities = [];
    var scale           = 50; 

    // Fill said arrays with plot ino:  
    for( let i = 0 ; i < data.length; i++) {
      var markerSize = Math.log(tstamps[i].length/this.state.maxTimes+1) * scale; 
      var markerText = ""; 
      if(data[i].city && data[i].city.length != 0){
          markerText = markerText + data[i].city + ", "; 
      }
      if(data[i].region_name && data[i].region_name.length != 0){
        markerText = markerText + data[i].region_name + ", "; 
      }
      if(data[i].country_name && data[i].country_name.length != 0){
        markerText = markerText + data[i].country_name + "\n"; 
      }
      markerText = markerText + "Number of Edits: " + data[i].timesArray.length.toString();
      textArray.push(markerText); 
      markerSizes.push(markerSize); 
      markerColors.push('coral');
      markerOpacities.push(data[i].timesArray.length / this.state.maxTimes);  
    }

  // Now we package the arrays into a data container: 
  	var dataContainer = [{
      type: 'scattergeo',
      lat: lats,
      lon: lons,
      hoverinfo: 'text',
      text: textArray,
      marker: {
        size: markerSizes,
        line: {
          color: 'coral',
          width: 2
        },
        color: markerColors,
      }
    }];

    return dataContainer

	}

	Unpack(rows,key) {
	  return rows.map(function(row) { return row[key]; });
	}

	// A function to loop sounds; the number of iterations determined by the number of revs in each frame. 
	loopSounds(frameData){
		var frame = parseInt(frameData.name); 
		var numEdits = this.state.frames[frame].data[0].lat.length; 
		if(frame > 0){
			numEdits = numEdits - this.state.frames[frame-1].data[0].lat.length; 
		}
		var numSounds = Math.ceil(numEdits / this.state.maxTimes) * 10; 
		for(let j = 0; j < numSounds; j++){
			this.playSound(); 
		}
	}

	// A function to play sounds, as called by loopSounds(). 
	playSound(){
		var i = Math.floor(Math.random() * Math.floor(26));
		if(this.soundsArray[i].currentTime > 0.6){
			this.soundsArray[i].pause(); 
			this.soundsArray[i].currentTime = 0; 
		}
		this.soundsArray[i].play();
	}

	// Define a render function for our class: 
	render(){
		var layout = this.state.layout; 
		var frames = this.state.frames; 
		var data = this.state.data; 
		if(this.state.fetching == true){
			console.log('fetching render')
			return(
				<div style = {mapDivStyle}>
					<LoadingComponent/>
				</div>
			)
		}
		else if(this.state.fetching == false && this.state.data && this.state.layout && this.state.frames){
			return(
				<div style = {mapDivStyle}>
		      <Plot
		        data={this.state.data}
		        layout={this.state.layout}
		        frames={this.state.frames}
		        config={this.state.config}
		        style = {{width:window.innerWidth, height:window.innerHeight-80,}}
		        useResizeHandler ={true}
	          onInitialized={(figure) => this.setState(figure)}
	          onRelayout = {
	          	(stuff) => {
	          		console.log('on relayout')
	          	}
	          }
	          onAnimatingFrame = {(x) => {this.loopSounds(x)}}
		      >
		      </Plot>
		    </div>
			)
		}
		else{
			return(
				<div style = {mapDivStyle}>
					<LoadingComponent/>
				</div>
			)
		}
	}////
}




