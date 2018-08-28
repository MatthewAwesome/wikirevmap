import React, { Component } from 'react';
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

	// Perhaps we do the IP ---> Location lookup in here. This makes it easier to look/update
	constructor(props){
		super(props); 

		// Some variables for potential use: 
    var D      = new Date(); 
    var now    = D.getTime(); 
    var frameWidth = 8.64e9; 

    // Defining a layout: 
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
    // The state container: 
    this.state = { data: [{type: 'scattergeo'}], 
	    layout: mapLayout,
	    frames: [],
	    config: {},
	    rawdata:[],
	    now:now,
	    framesBuilt:0,
	    frameWidth:frameWidth,
	    sliderSteps:[],
	    revPullComplete:false,
	    bday:null, 
	    revCount:0, 
	    fetching:false, 
  	};
 		// Some functions of utility: 
		this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this); 
		// this.componentDidUpdate    = this.componentDidUpdate.bind(this); 
		this.Unpack                = this.Unpack.bind(this); 
		this.framifyData           = this.framifyData.bind(this); 
		this.getFrameData          = this.getFrameData.bind(this); 
		this.revPuller             = this.revPuller.bind(this); 
		this.getNumberOfFrames     = this.getNumberOfFrames.bind(this); 
	}

	// A change in props will prompt an update in this Component, as defined via componentShouldUpdate. 
	// What we do here is essentiall update the update. Basically, we the iniial update just resets the props, 
	// Now we utilize the new props and actually UPDATE the data and display accordingly. 
	async componentDidUpdate(prevProps,prevState){
		// Here We want to update our state! 
		if(prevProps.pageid != this.props.pageid){
			// We've received a pageid. Lets pull some data! 
			await this.revPuller();
		}
		// Framify the stuff: 
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
		// This tell us to framfiy the data: 
		else if(nextState && nextState.revPullComplete == true){
			console.log(nextState); 
			return true; 
		}
		// Tells us we have new frames and are ready to display accordingly: 
		else if(nextState && this.state.frames.length != nextState.frames.length){
			return true; 
		}
		// If all else fails, we don't update the thing: 
		else{
			return false; 
		}
	}

	async revPuller(){
		try{
			// Pulling revs! 
			var revCount = 0; 
			await this.setState({fetching:true}); 
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
		// How many frames can you make with the data available? We don't settle for incomplete frames until the end!  
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
		// Get the current array of frames that we will add frames to: 
		try{
			var frames      =  []; 
			var sliderSteps =  []; 
			var layout      = this.state.layout; 
			// Lets see how many frames we need to add: 
			var framesToAdd = this.getNumberOfFrames(); 
			console.log(this.state.revArray.length)
			for(let i = 0; i < framesToAdd; i++){
				// Define start/end time for the current frame: 
				var frameStartTime = i * this.state.frameWidth + this.state.bday;  
				var frameEndTime   = (i + 1) * this.state.frameWidth + this.state.bday; 

				// Filter the data accordingly: 
				var filteredData = this.state.revArray.filter( (x) => {
					var tIndex = x.timesArray.findIndex( t => t < frameEndTime); 
					if(tIndex != -1){
						return true
					}
					else{
						return false; 
					}
				}); 
				// Filter the time arrays accordingly, to: 
				filteredData = filteredData.map(
					(x) => {
						var last_t_index = x.timesArray.findIndex( t => t < frameEndTime);
						x.timesArray = x.timesArray.slice(0,last_t_index+1);
						return x 
					}
				); 
				console.log(this.state.revArray.length)
				console.log(filteredData);
				// Assemble data container: 
				var frameData = this.getFrameData(filteredData); 
				var frameIdStr = i.toString(); 
				var frame = {data:frameData,name:frameIdStr}
				// Add frame: 
				frames.push(frame); 
				// Make a slider step for this frame: 
				var sliderObj = {
					method:'animate',
					label:frameIdStr,
					args:[ 
						[frameIdStr], 
						{mode:'immediate',transition:{duration:300},frame:{duration:300,redraw:true}}
					]
				}; 
				sliderSteps.push(sliderObj); 
			}

			// Instantiate things: 
			var updatemenus = [{
	      x: 0,
	      y: 0,
	      yanchor: 'top',
	      xanchor: 'left',
	      showactive: true,
	      direction: 'left',
	      type: 'buttons',
	      pad: {t: 87, r: 10},
	      buttons: [{
	        method: 'animate',
	        args: [null, {
	          mode: 'immediate',
	          fromcurrent: true,
	          transition: {duration: 300},
	          frame: {duration: 500, redraw: true}
	        }],
	        label: 'Play'
	      }, {
	        method: 'animate',
	        args: [[null], {
	          mode: 'immediate',
	          transition: {duration: 0},
	          frame: {duration: 0, redraw: true,}
	        }],
	        label: 'Pause'
	      }]
	    }]; 

	    var sliders = [{
	      pad: {l: 130, t: 55},
	      currentvalue: {
	        visible: true,
	        prefix: 'Step:',
	        xanchor: 'right',
	        font: {size: 20, color: '#666'}
	      },
	      steps: sliderSteps, 
	      active:0,
	    }]
	    layout.updatemenus = updatemenus; 
	    layout.sliders = sliders; 
			await this.setState({layout:layout,frames:frames,sliderSteps:sliderSteps}); 
		}
		catch(error){
			console.log('ERROR: ', error)
		}
	}

	getFrameData(data){
    var lats       = this.Unpack(data,'latitude') ;
    var lons       = this.Unpack(data,'longitude'); 
    var tstamps    = this.Unpack(data,'timesArray'); 
    // Arrays and such: 
    var markerSizes = []; 
    var textArray = []; 
    var markerColors = []; 
    var markerOpacities = [];
    var scale = 32; 
    // We are scaling my occurrences! 
    var tLens = tstamps.map( x => x.length); 
    var maxLength = Math.max(...tLens); 
    // Fill the arrays with IP data. 
    for( let i = 0 ; i < data.length; i++) {
      var markerSize = Math.log(tstamps[i].length/maxLength+1) * scale; 
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
      markerOpacities.push(data[i].timesArray.length / maxLength);  
    }
  // Now we package the arrays into a dataObject: 
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
        // opacity: markerOpacities,
      }
    }];
    return dataContainer
	}

	Unpack(rows, key) {
	    return rows.map(function(row) { return row[key]; });
	}

	// Define a render function for our class: 
	render(){
		var layout = this.state.layout; 
		var frames = this.state.frames; 
		var data = this.state.data; 
		return(
			<div style = {mapDivStyle}>
	      <Plot
	        data={this.state.data}
	        layout={this.state.layout}
	        frames={this.state.frames}
	        style = {{width:window.innerWidth, height:window.innerHeight-50,}}
	        useResizeHandler ={true}
          onInitialized={(figure) => this.setState(figure)}
          onRelayout = {
          	(stuff) => {
          		console.log('on relayout')
          	}
          }
	      />
			</div>
		)

	}///
}


	// Need a function to transform raw data into map data: 
	// async mapifyData(){
	// 	if(this.props.readyToPlot == true){
	// 	  // This function will operate upon props.data. 
	//     // The raw data: 
	//     var maxTimes = this.props.maxTimes; 
	//     console.log(maxTimes)
	//     var lats       = this.Unpack(this.props.data,'latitude') ;
	//     var lons       = this.Unpack(this.props.data,'longitude'); 
	//     var tstamps    = this.Unpack(this.props.data,'timesArray'); 
	//     // Arrays and such: 
	//     var markerSizes = []; 
	//     var textArray = []; 
	//     var markerColors = []; 
	//     var markerOpacities = [];
	//     var scale = 32; 

	//     // Fill the arrays with IP data. 
	//     for ( let i = 0 ; i < this.props.data.length; i++) {
	//       var markerSize = Math.log(tstamps[i].length/maxTimes+1) * scale; 
	//       var markerText = ""; 
	//       if(this.props.data[i].city && this.props.data[i].city.length != 0){
	//           markerText = markerText + this.props.data[i].city + ", "; 
	//       }
	//       if(this.props.data[i].region_name && this.props.data[i].region_name.length != 0){
	//         markerText = markerText + this.props.data[i].region_name + ", "; 
	//       }
	//       if(this.props.data[i].country_name && this.props.data[i].country_name.length != 0){
	//         markerText = markerText + this.props.data[i].country_name + "\n"; 
	//       }
	//       markerText = markerText + "Number of Edits: " + this.props.data[i].timesArray.length.toString();
	//       textArray.push(markerText); 
	//       markerSizes.push(markerSize); 
	//       markerColors.push('coral');
	//       markerOpacities.push(this.props.data[i].timesArray.length / maxTimes);  
	//     }

	//     // Populate a data array. 

	//     var emptyData = [{
	//       type: 'scattergeo',
	//       lat: [],
	//       lon: [],
	//       hoverinfo: 'text',
	//       text: [],
	//       marker: {
	//         size: [],
	//         line: {
	//           color: 'coral',
	//           width: 2
	//         },
	//         color: [],
	//       }
	//     }];



	//     var dataContainer = [{
	//       type: 'scattergeo',
	//       lat: lats,
	//       lon: lons,
	//       hoverinfo: 'text',
	//       text: textArray,
	//       marker: {
	//         size: markerSizes,
	//         line: {
	//           color: 'coral',
	//           width: 2
	//         },
	//         color: markerColors,
	//         // opacity: markerOpacities,
	//       }
	//     }];

	//     // Add a new slider step: 

	// 		// Add a new frame: 
	// 		var frames = this.state.frames; 
	// 		var startFrame = {
	// 			name:'beginning', 
	// 			data:emptyData,
	// 		};
	// 		var endFrame = {
	// 			name:'end', 
	// 			data:dataContainer
	// 		}; 
	// 		frames.push(startFrame); 
	// 		frames.push(endFrame); 
	// 		console.log(frames)

	// 	var beginObj = {
	// 		method:'animate',
	// 		label:'Beginning',
	// 		args:[ 
	// 			['beginning'], 
	// 			{mode:'immediate',transition:{duration:300},frame:{duration:300,redraw:true}}
	// 		]
	// 	}; 
	// 	var endObj = {
	// 		method:'animate',
	// 		label:'End',
	// 		args:[ 
	// 			['end'], 
	// 			{mode:'immediate',transition:{duration:300},frame:{duration:300,redraw:true}}
	// 		]
	// 	}; 
	// 	var sliderSteps = [beginObj,endObj]; 
	// 		// for layout: 
	// 		var mapLayout = {
	//     title: 'Wikipedia Edit Map for <a href="https://en.wikipedia.org/wiki/Neuroscience"> Neuroscience</a>',
	//     geo:{
	//       showcoastlines: true,
	//       projection:{
	//         type: "miller", 
	//       }, 
	//       scope:'world',
	//       showland:true,
	//       showocean:true,
	//       oceancolor: 'rgb(0, 0, 0)',
	//       landcolor: 'rgb(0, 0, 0)',
	//       coastlinecolor: '#777777',
	//       coastlinewidth:1,
	//       bgcolor:'black',
	//       margin:{l:0,r:0,t:0,b:0},
	//       lonaxis:{range:[-180,180]}
	//     },
	//     margin:{l:0,r:0,t:0,b:0},
	//     plot_bgcolor:"black",
	//     paper_bgcolor:"#000",
	//     autosize:true,
	//     updatemenus: [{
	//       x: 0,
	//       y: 0,
	//       yanchor: 'top',
	//       xanchor: 'left',
	//       showactive: true,
	//       direction: 'left',
	//       type: 'buttons',
	//       pad: {t: 87, r: 10},
	//       buttons: [{
	//         method: 'animate',
	//         args: [null, {
	//           mode: 'immediate',
	//           fromcurrent: true,
	//           transition: {duration: 300},
	//           frame: {duration: 500, redraw: true}
	//         }],
	//         label: 'Play'
	//       }, {
	//         method: 'animate',
	//         args: [[null], {
	//           mode: 'immediate',
	//           transition: {duration: 0},
	//           frame: {duration: 0, redraw: true,}
	//         }],
	//         label: 'Pause'
	//       }]
	//     }],
	//     sliders: [{
	//       pad: {l: 130, t: 55},
	//       currentvalue: {
	//         visible: true,
	//         prefix: 'Year:',
	//         xanchor: 'right',
	//         font: {size: 20, color: '#666'}
	//       },
	//       steps: sliderSteps, 
	//       active:0,
	//     }],
 //  	};
	// 		console.log('settingState');
	//     // setState: 
	//     await this.setState({frames:frames,layout:mapLayout,}); 
 //  	}
 //  	else{
 //  		// make empty frames: 
 //  		// var dataContainer = [{type:'scattergeo'}]; 
 //  		// this.setState({mapData:dataContainer}); 
 //  	}
	// }

   //  updatemenus: [{
	  //     x: 0,
	  //     y: 0,
	  //     yanchor: 'top',
	  //     xanchor: 'left',
	  //     showactive: false,
	  //     direction: 'left',
	  //     type: 'buttons',
	  //     pad: {t: 87, r: 10},
	  //     buttons: [{
	  //       method: 'animate',
	  //       args: [null, {
	  //         mode: 'immediate',
	  //         fromcurrent: true,
	  //         transition: {duration: 300},
	  //         frame: {duration: 500, redraw: true}
	  //       }],
	  //       label: 'Play'
	  //     }, {
	  //       method: 'animate',
	  //       args: [[null], {
	  //         mode: 'immediate',
	  //         transition: {duration: 0},
	  //         frame: {duration: 0, redraw: true}
	  //       }],
	  //       label: 'Pause'
	  //     }]
	  //   }],
			// sliders: [{
	  //     pad: {l: 130, t: 55},
	  //     currentvalue: {
	  //       visible: true,
	  //       prefix: 'Year:',
	  //       xanchor: 'right',
	  //       font: {size: 20, color: '#666'}
	  //     },
	  //     steps: sliderSteps
	  //   }],

