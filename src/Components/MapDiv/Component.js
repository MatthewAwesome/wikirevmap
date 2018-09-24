import React, { Component } from 'react';
import LoadingComponent from './LoadingComponent'; 
import Plot from 'react-plotly.js';
import {statRowStyle,thumbStyle,letterStyle,titleStyle,titleRowStyle} from './styles'; 
import {baseMapLayout,baseLineData,} from './plotStuff';
import GetRevs from './helperFunctions/GetRevs'; 
import ProcessIpRevs from './helperFunctions/ProcessIpRevs'; 
import GetLocation from './helperFunctions/GetLocation'; 
import UserChecker from './helperFunctions/UserChecker'; 
import Slider from 'react-rangeslider'; 
import ReactTimeout from 'react-timeout'; 
import ControlBar from './ControlBar'; 
import TimePlot from './TimePlot'; 

/* Some notes on what we need to do here: 

* Pulling data needs to be broken up. The wait time at present is unacceptable for most 
  pages that garner even modest interest. 

* Need to pull some telling stats. Page Size, # of edits, # Unique contributors, etc, 

* Can we identify vandals? And plot them acccordingly? Could be neat! Where are most vandals located? 

*/

var mapDivStyle = {
	width: "100%",
	display:'flex', 
	flexDirection:'column',
	justifyContent:'flex-start', 
	alignItems:'center', 
	height:window.innerHeight-60,
}; 

var mapPlotContainer = {
	width:"100%",
	display:'flex',
	flexDirection:'row',
	justifyContent:'center', 
	alignItems:'flex-start',
	height:window.innerHeight-300, 
}; 

var statItemStyle = {
	width:"33.3%",
	height:36,
	alignItems:'center',
	justifyContent:'center',
	display:'flex',
	fontSize:16,
	textAlign:'center',
	whiteSpace:'pre-line'
}; 

var emptyLineData = [
  {
    x:[], 
    y:[], 
    type: 'scatter',
    mode: 'lines',
    marker:{color:'white'}, 
    hoverinfo: 'none',
    fillcolor:'rgba(128,128,128,0.8)',
    fill:'tozeroy',
    line: {
      color:'white',
      width: 1,
    } 
  }, 
  {
    x:[], 
    y:[], 
    type: 'scatter',
    mode: 'lines',
    marker:{color:'white'}, 
    hoverinfo: 'none',
    fillcolor:'lightgray', 
    fill:'tozeroy', 
  }, 
]; 

class MapDiv extends Component{

	constructor(props){

		// super-size, anyone? 
		super(props); 
		// Some variables for potential use: 
    var D = new Date();  
    // Initialize the state container: 
    this.state = { data: [{type: 'scattergeo'}], 
	    layout: baseMapLayout,
	    frameData: [],
	    config: {displayModeBar: false},
	    now:D.getTime(),
	    revPullComplete:false,
	    bday:null, 
	    maxTimes:1,
	    fetching:false, 
	    baseMapLayout:baseMapLayout, 
	    baseData:[{type: 'scattergeo'}],
	    cleared:true, 
	    width:window.innerWidth, 
	    height:window.innerHeight, 
	    currentFrame:0, 
	    sliderPosition:0,
	    muted:false, 
	    revArray:[], 
	    ipRevArray:[], 
	    cont:null, 
	    articleAge:null, 
	    mapEnds:null, 
	    lineEnds:null,
	    labels:{}, 
	    tstep:null, 
	    lineData:baseLineData,
	    currentSize:'', 
	    uniqueEditors:0, 
	    mapDivStyle:mapDivStyle, 
	    mapPlotContainer:mapPlotContainer, 
	    statItemStyle:statItemStyle, 
	    vandalList:[], 
	    title:'',
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
		this.Unpack              = this.Unpack.bind(this); 
		this.framifyData         = this.framifyData.bind(this); 
		this.getFrameData        = this.getFrameData.bind(this); 
		this.getNumberOfFrames   = this.getNumberOfFrames.bind(this); 
		this.loopSounds          = this.loopSounds.bind(this); 
		this.playSound           = this.playSound.bind(this); 
		this.updateDimensions    = this.updateDimensions.bind(this);  
		this.onPlay              = this.onPlay.bind(this); 
		this.animate             = this.animate.bind(this); 
		this.sliderChangeHandler = this.sliderChangeHandler.bind(this); 
		this.onPause             = this.onPause.bind(this); 
		this.onMute              = this.onMute.bind(this); 
		this.RevPuller           = this.RevPuller.bind(this); 
		this.renderControlBar    = this.renderControlBar.bind(this); 
		this.renderStatRow       = this.renderStatRow.bind(this); 
		this.getLineFrames       = this.getLineFrames.bind(this); 
		this.removeDuplicates    = this.removeDuplicates.bind(this); 
		this.mapScaler           = this.mapScaler.bind(this); 
		this.renderMap           = this.renderMap.bind(this); 
		this.findVandals         = this.findVandals.bind(this); 
		this.renderTitleBar      = this.renderTitleBar.bind(this); 
	}

  // To handle browser resize; 
  updateDimensions() {
  	// Do things with the current window size: 
  	var divStyle           = Object.assign({},this.state.mapDivStyle); 
  	var plotStyle          = Object.assign({},this.state.mapPlotContainer); 
  	var mapLayout          = Object.assign({},this.state.layout); 
  	var statStyle          = Object.assign({},this.state.statItemStyle); 
  	var heightCheck        = window.innerHeight < 400 ? 400 : window.innerHeight; 
  	divStyle.height        = window.innerHeight-60; 
  	plotStyle.height       = heightCheck-300; 
  	mapLayout.height       = heightCheck-300; 
  	mapLayout.datarevision = mapLayout.datarevision + 1; 
  	// And update the state accordingly: 
    this.setState({
    	width: window.innerWidth,
    	height:window.innerHeight,
    	mapDivStyle:divStyle,
    	mapPlotContainer:plotStyle, 
    	layout:mapLayout,
    });
  }; 

  // Attached UpdateDimensions to our window: 
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }


  // componentDidUpdate is used to fetch and/or clear data for wiki_revs: 
	async componentDidUpdate(prevProps,prevState){
		// This ie executed when the user initial comes into the app.  
		if(prevProps.pageid != this.props.pageid && this.state.cleared == true){
			// This call pulls the first rev batch: 
			await this.RevPuller();
		}
		// Do we need to clear existing data, users has requested a new page: 
		else if(prevProps.pageid != this.props.pageid && this.state.cleared == false){
			var DD = new Date(); 
			console.log('in update')
			this.setState({
				frameData:[],
				data:this.state.baseData,
				layout:this.state.baseMapLayout,
				sliderSteps:[],
				now:DD.getTime(),
				revPullComplete:false,
				bday:null,
				articleAge:null, 
				maxTimes:1,
				fetching:false, 
				cleared:true,
				cont:null, 
		    mapEnds:null, 
		    lineEnds:null,
				labels:{}, 
				currentFrame:0, 
				sliderPosition:0, 
				anim:null, 
				lineData:emptyLineData.slice(), 
				tstep:null, 
				revArray:[], 
				ipRevArray:[], 
				cont:null, 
				currentSize:'',
				uniqueEditors:0, 
				vandalList:[],
				title:'',
			});
		}
		// Fetching after the clear: 
		else if(prevState.cleared == false && this.state.cleared == true ){
			await this.RevPuller(); 
		}
		// Fetching additional revs... 
		else if(prevState.cont != this.state.cont && this.state.cont != null){
			await this.RevPuller(); 
		}
		// Setting state signifying that we have pulled all the revs for a given page: 
		else if(prevState.cont != null && this.state.cont == null){
			// And we tack on end label: 
			var labels   = this.state.labels; 
			var tEnd     = new Date(this.state.mapEnds[59]); 
			labels[599] = tEnd.toGMTString().slice(8,16);
			// Get a middle pt. too, 
			var tMid     = new Date(this.state.mapEnds[29]); 
			labels[299] = tMid.toGMTString().slice(8,16); 
			this.setState({revPullComplete:true,labels:labels})
		}
		// Sometimes all the revs get fetch in a single call, and therefore cont never goes to null; this is handled below. 
		else if(prevState.revPullComplete == false && this.state.revPullComplete == true){
			var labels   = this.state.labels; 
			var tEnd     = new Date(this.state.mapEnds[59]);
			labels[599] = tEnd.toGMTString().slice(8,16);
			// Get a middle pt. too, 
			var tMid     = new Date(this.state.mapEnds[29]); 
			labels[299] = tMid.toGMTString().slice(8,16); 
			this.setState({labels:labels})
		}
	}

	// Update when we receive new data: 
	shouldComponentUpdate(nextProps,nextState){
		// This tells us to being pulling the data: 
		if(nextProps && nextProps != this.props){
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
		// We have more revs: 
		else if(nextState && nextState.revArray != this.state.revArray){
			return true; 
		}
		// Tells us we have new frames and are ready to display accordingly: 
		else if(nextState && this.state.frameData.length != nextState.frameData.length){
			return true; 
		}
		else if(nextState && nextState.lineData != this.state.lineData){
			return true; 
		}
		// We have a continue to fetch: 
		else if(nextState && this.state.cont != nextState.cont){
			return true; 
		}
		// Are we fetching data?
		else if(nextState && nextState.fetching != this.state.fetching){
			return true;
		}
		// Has the window been resized? (horizontally)
		else if(nextState && nextState.width != this.state.width){
			return true; 
		}
		// Has the window been resized? (vertically)
		else if(nextState && nextState.height != this.state.height){
			return true; 
		}
		// Has the slider moved?
		else if(nextState && nextState.sliderPosition != this.state.sliderPosition){
			return true; 
		}
		else if(nextState && nextState.layout != this.state.layout){
			return true; 
		}
		// If all else fails, we don't update the thing: 
		else{
			return false; 
		}
	}

	async RevPuller(){
		// Here we grab revs in batches of 500 (or less). 
		try{
			// Grab some new revData:
			var revData    = await GetRevs(this.props.pageid,this.state.cont); 
			// Bookmark our rev-grabbing spot with a continue: 
			var cont       = revData.cont == null ? null : revData.cont; 
			// Determine the articles birthday: 
			var bdayObj    = new Date(revData.revs[0].timestamp); 
			var bday       = bdayObj.getTime(); 
			// And its age: 
			var articleAge = this.state.now - bday; 

			// Seeing how big each revision is compared to the previous article. That is, how much did a user add or delete?
			revData.revs = revData.revs.map( (x,i) => {
				if(i == 0 && this.state.revArray.length == 0){
					x.diff = x.size; 
				}
				else if(i == 0 && this.state.revArray.length > 0){
					x.diff = x.size - this.state.revArray[this.state.revArray.length-1].size; 
				}
				else{
					x.diff = x.size - revData.revs[i-1].size; 
				}
				if(x.user){
					x.user = x.user.trim(); 
				}
				x.vandal = false; 
				return x; 
			})

			// This if-statement is only executed when instantiating a page (e.g. the user selected a new page). 
			if(this.state.bday == null && this.state.articleAge == null){
				// Take this opportunity to make time vectors and labels: 
				var lineEnds = [], mapEnds = []; 
				// Fill up the arrays:
				for(let j = 0; j < 120; j++){
					var endpt = bday + ((j+1) * articleAge / 120); 
					lineEnds.push(endpt)
					if( j % 2 != 0){
						mapEnds.push(endpt); 
					}
				}
				// Begin to make the labeles for slider: 
				var bdayStr = bdayObj.toGMTString().slice(8,16); 
				var labels  = this.state.labels; 
				labels[0]   = bdayStr; 
				// Update the state: 
				this.setState({
					bday:bday,
					articleAge:articleAge,
					cleared:false,
					lineEnds:lineEnds,
					mapEnds:mapEnds,
					labels:labels,
					fetching:true, 
					title:revData.title,
				}); 
			}
			
			// Concatenating revs, and getting some stats from them:  
			var currentSize,uniqueEditors,accRevs,newRevs; 
			newRevs       = revData.revs; 
			// AccRevs dos 
			accRevs       = this.state.revArray.concat(revData.revs);
			uniqueEditors = accRevs.map(x => x.user).filter(this.removeDuplicates).length;  
			currentSize   = accRevs[accRevs.length-1].size/1000; 
			currentSize      = currentSize.toString(); 
			if(currentSize.indexOf('.') != -1 && currentSize.indexOf('.') >= 4 ){
				currentSize = currentSize.slice(0,currentSize.indexOf('.')); 
			}
			else{
				currentSize = currentSize.slice(0,4); 
			}
			currentSize = currentSize + 'kB'; 
			
			// This is all about sampling the data, framesToMake is the number of samples we will grab this iteration: 
			var lastTime     = new Date(revData.revs[revData.revs.length-1].timestamp); lastTime = lastTime.getTime(); 
			var framesToMake = this.getNumberOfFrames(lastTime,this.state.frameData); 

			// Cleaning the revs for mapping. revData.revs will be merged with this.state.revArray. 
      revData.revs  = await ProcessIpRevs(revData.revs,this.state.ipRevArray); 

			// This looks for vandalism and tabulates it: newVandals is an object {vandalList:[],vandalCound:int}. 
			var newVandals = await this.findVandals(newRevs,this.state.vandalList); 
		
			// //Here, we loop through newVandals.vandalList and either update the revData.revs section, or make a new entry to signal vandalism. 
			var baseArray = revData.revs.slice(); 
			await newVandals.vandalObjList.forEach(
				async (x) => {
					if(x != null && x.user && x.user != null){
						var vandIndex = revData.revs.findIndex( (y) => {if(y.user == x.user){return true}}); 
						if(vandIndex != -1){
							// updating rev entry: 
							revData.revs[vandIndex].vandal = true;  
							baseArray[vandIndex].vandal = true; 
						}
						else{
							// Make an entry for this vandal!
							 x = await GetLocation(x);
							if(x != null){
								var ipIndex = revData.revs.findIndex( y => y.ip == x.ip); 
								if(ipIndex != -1){
									revData.revs[ipIndex].vandal = true;  
								}
								else{
								 	x.vandal = true; 
								  revData.revs.push(x); 
								  baseArray.push(x); 
								}
							}
						}
					}
				}
			); 
	
      // Make desired number of line frames: 	
      if(framesToMake.lineFrames > 0){
      	var lineFrames = this.getLineFrames(accRevs,framesToMake.lineFrames); 
      }

      // Make desired number of map frames: 
			if(framesToMake.mapFrames > 0){
				// Make/update frames: 
				var frames = this.framifyData(revData.revs,framesToMake.mapFrames,newVandals); 
				// we update labels again: 
				var labels = this.state.labels; 
				if(frames.frameData.length != this.state.mapEnds.length){
					var labels = this.state.labels; 
					// get percent loaded: 
					var pct = Math.round((frames.frameData.length/60)*100).toString(); 
					labels[599] = pct + "% loaded..."
				}
				// Make a title: 
				// title string: 
				var annotations = [
			  	{
			  		text: revData.title, 
			  		font:{family:'courier',size:18,color:'white',weight:400}, 
			  		y:0.99,
			  		showarrow:false,
			  		bgcolor:'black',
			  		visible:false,
			  	}
  			]; 
  			var layout = this.state.layout; 
  			layout.annotations = annotations; 
  			var complete = cont == null ? true:false; 
				this.setState({
					revArray:accRevs,
					frameData:frames.frameData,
					maxTimes:frames.maxTimes, 
					fetching:false,
					cont:cont,
					labels:labels, 
					layout:layout, 
					revPullComplete:complete,
					currentSize:currentSize,
					uniqueEditors:uniqueEditors, 
					ipRevArray:revData.revs, 
				});			
			}
			else{
				this.setState({
					revArray:accRevs,
					cont:cont,
					currentSize:currentSize, 
					uniqueEditors:uniqueEditors, 
					ipRevArray:revData.revs, 
				});		
			}
		}
		catch(error){
			console.log('Error in search result handler: ', error); 
		}
	}

	// This function will yield a list of IP vandals for mapping, and a vandal count, to dipslay in the stat bar. 
	findVandals(revs,existingVandals){
		// Regexs to identify vandalism and the users responsible for said vandalsim 
		var vandReg     = /\bvandal/i;
		var regUsername = /\|(.*?)\]\]/g;
		// An array of vandals: 
		var vandalList = []; 
		var vandalObjList = []; 
		// Keeping a count of those assholes:
		var vandalCount = 0; 
		// Loop through revs and identify vandals: 
		for(let r in revs){
			// Some revs don't have comments, if-statement to avoid error: 
			if(revs[r].comment && revs[r].comment != null){
				var vandCheck = revs[r].comment.search(vandReg); 
				// If we found 'vandal' in the comment, vandalism has been identified: 
				if(vandCheck != -1 && r > 0){
					vandalCount += 1; 
					// Checking to see if a user has been identified as the vandal: 
					var possibleUsers = revs[r].comment.match(regUsername);
					if(possibleUsers != null){
						for(let p in possibleUsers){
							var trimmed = possibleUsers[p].replace(/[|\]]/g,"").trim().replace(' ',''); 
							// Only caring about IP vandals here, also making sure we don't double dip them: 
							var trimMatch = trimmed.match(/[.:]/g); 
							if(trimMatch != null && trimmed.length > 5 && existingVandals.indexOf(trimmed) == -1){
								var timeObject = new Date(revs[r].timestamp); 
								var msTime     = timeObject.getTime(); 
								vandalObjList.push({
									user:trimmed,
									userid:0,
									timestamp:revs[r].timestamp,
									timesArray:[msTime], 
									vandal:true,
								}); 
								vandalList.push(trimmed); 
							}
						}
					}
					// Similar to the above, but we look for users in a much more vague way: 
					else{ 
						var comment = revs[r].comment.slice(vandCheck); 
						var words = comment.split(' '); 
						for(let w in words){
							var wordNumberMatch = words[w].match(/^\d/); 
							var wordCarMatch = words[w].match(/[.:]/g)
							if(wordNumberMatch != null && wordCarMatch != null ){
								var word = words[w].trim(); 
								if(word.length > 5 && existingVandals.indexOf(word) == -1){
									var timeObject = new Date(revs[r].timestamp); 
									var msTime     = timeObject.getTime(); 
									vandalObjList.push({
										user:word,
										userid:0,
										timestamp:revs[r].timestamp,
										timesArray:[msTime], 
										vandal:true, 
									}); 
									vandalList.push(word); 
								}
							}
						}
					}
				}
			}
		}
		return {vandalObjList:vandalObjList,vandalList:vandalList,vandalCount:vandalCount}; 
	}

	// this function serves as a callback to array.filter()
  removeDuplicates( item, index, inputArray ){
    if(item != undefined){
      return inputArray.indexOf(item) == index;
    }
  } 

	// A function to determine how many frames we can assemble with the most recently pulled rev batch: 
	getNumberOfFrames(lastTime){
		// The last timestamp in each timesArray should be the most recent. Put all the 
		var timePercent        = (lastTime - this.state.bday) / this.state.articleAge; 
		// Map frames:  
		var numberOfMapFrames  = Math.ceil(timePercent * 60) - this.state.frameData.length; 
		// Line frames: 
		var numberOfLineFrames = Math.ceil(timePercent * 120) - this.state.lineData[0].x.length;
		// return the numbers:  
		return {mapFrames:numberOfMapFrames,lineFrames:numberOfLineFrames}
	}

	// Assembling data for our line chart: 
	getLineFrames(revs,framesToMake){
		// Establish some vars to make frames: 
		var lineData  = this.state.lineData; 
		var startI    = this.state.lineData[0].x.length; 
		var maxI      = framesToMake + this.state.lineData[0].x.length; 
		var frameWeek = (this.state.lineEnds[1]-this.state.lineEnds[0])/6.048e8; // 6.048e8 milliseconds in a week!
		// Iterate and add frames:  
		for(let i = startI; i < maxI; i++){
			var startTime = i == 0 ? this.state.articleAge : this.state.lineEnds[i-1]; 
			var endTime   = this.state.lineEnds[i]; 
			// Determine how many revs are between these point. 
			var filteredRevs = revs.filter( (x) => {
					var timeObject = new Date(x.timestamp); 
					var msTime     = timeObject.getTime(); 
					if( msTime >= startTime && msTime < endTime ){
						return true; 
					}
					else{
						return false; 
					}
				}
			); 
			// Coolness, lets add this data to our array as x-y pairs!
			lineData[0].x.push(i); 
			lineData[0].y.push(filteredRevs.length/frameWeek); 
		}
		// Okay, we've finished interating, lets update the state; 
		this.setState({lineData:lineData})
	}

	// Function to place data into frames as dictated by the incoming data: 
	framifyData(revArray,framesToMake,vandalList){
		try{
			// Getthe 'maxTimes'. This might be unnecessary... 
			var times     = revArray.map( (x) => {return x.timesArray.length}); 
			var maxTimes  = Math.max(...times);
			var newFrames = []; 
			var oldFrames = this.state.frameData; 


			// Push Elements to new frames: 
			//for(let i = oldFrames.length; i < oldFrames.length + framesToMake; i++){
			for(let i = oldFrames.length; i < oldFrames.length + framesToMake; i++){
				// Update old frames: 
					// Make new frames: 
					var filteredData = revArray.filter( (x) => {
						var tIndex = x.timesArray.findIndex( t => t < this.state.mapEnds[i]); 
						if(tIndex != -1){
							return true
						}
						else{
							return false; 
						}
					}).map(
						(x) => {
							var last_t_index = x.timesArray.findIndex( t => t > this.state.mapEnds[i]);
							if(last_t_index != -1){
								x.timesArray = x.timesArray.slice(0,last_t_index);
							}
							return x 
						}
					);
					newFrames.push(filteredData); 
					 
			}
			newFrames = this.getFrameData(newFrames,maxTimes)
			var nn = oldFrames.concat(newFrames);
			return{frameData:nn,maxTimes:maxTimes}; 
			oldFrames = null; 
		}
		catch(error){
			console.log('ERROR: ', error)
			return null
		}
	}

	getFrameData(data,maxTimes){
		// data is an Array of frames. Update accordingly: 
		var mappedData = data.map(
			(x) => {
				// Get the data from x, an array of objects: 
				var lats            = this.Unpack(x,'latitude') ;
		    var lons            = this.Unpack(x,'longitude'); 
		    var tstamps         = this.Unpack(x,'timesArray'); 
	      // Arrays to house of plot info:  
		    var markerSizes     = []; 
		    var textArray       = []; 
		    var markerColors    = []; 
		    var markerOpacities = [];
		    var userArray       = []; 
		    var hoverlabels     = []; 
		    x.forEach(
		    	(y,index) => {
		    		if(y.vandal == false){
					    var markerSize = Math.log(y.timesArray.length * Math.E) * 4;  
					    var editStr = y.timesArray.length == 1 ? ' Edit': ' Edits' 
				      var markerText = '<b>' + y.timesArray.length.toString() + editStr + '</b><br>'; 
				      if(y.totalDiff && y.totalDiff >= 0){
				      	markerText = markerText + '<b style="color:#4AC948;">' + Math.abs(y.totalDiff).toString() + ' bytes added</b><br>'; 
				      }
				      else if(y.totalDiff && y.totalDiff < 0){
				      	markerText = markerText + '<b style="color:red;">' + Math.abs(y.totalDiff).toString() + ' bytes deleted</b><br>'; 
				      } 
				      else if(y.totalDiff == 0){
				      	markerText = markerText + '<b style="grey:#4AC948;">' + Math.abs(y.totalDiff).toString() + ' bytes added</b><br>'; 
				      }
				      else{
				      	// console.log(y.totalDiff, typeof y.totalDiff)
				      	// console.log(y); 
				      }
				      markerText = markerText + '<b>'; 
				      if(y.city && y.city.length != 0){
				          markerText = markerText + y.city + ","; 
				      }
				      if(y.region_name && y.region_name.length != 0){
				        markerText = markerText + y.region_name + ","; 
				      }
				      if(y.country_name && y.country_name.length != 0){
				        markerText = markerText + y.country_name + '.'; 
				      }
				      markerText = markerText + '</b>'; 
				      textArray.push(markerText); 
				      markerSizes.push(markerSize); 
				      markerColors.push('white');
				      markerOpacities.push(y.timesArray.length / maxTimes); 	 
				      userArray.push(y.user);    		
			    	}
				    else if(y.vandal == true){
					    var markerSize = Math.log(y.timesArray.length * Math.E) * 4;  
					    var editStr = "Location of Potential Vandal"; 
				      var markerText = '<b style="color:white;">' + editStr; 
				      markerText = markerText + '</b>' + '<br>' + '<b style="color:white;">'; 
				      if(y.city && y.city.length != 0){
				          markerText = markerText + y.city + ","; 
				      }
				      if(y.region_name && y.region_name.length != 0){
				        markerText = markerText + y.region_name + ","; 
				      }
				      if(y.country_name && y.country_name.length != 0){
				        markerText = markerText + y.country_name; 
				      }
				      markerText = markerText + '</b>' + '<br>';
				      textArray.push(markerText); 
				      markerSizes.push(markerSize); 
				      markerColors.push('red');
				      markerOpacities.push(y.timesArray.length / maxTimes); 	 
				      userArray.push(y.user);  			    	
				    }
			  	}
		    )
		    var dataContainer = [{
		      type: 'scattergeo',
		      lat: lats,
		      lon: lons,
		      hoverinfo: 'text',
		      hoverlabel:{font:{family:'Courier New',size:14},bgcolor:markerColors,align:'center'},
		      text: textArray,
		      marker: {
		        size: markerSizes,
		        line: {
		          color: 'white',
		          width: 0
		        },
		        color: markerColors,
		      }, 
		      dates:tstamps, 
		      baseSizes:markerSizes, 
		    }]
		    return dataContainer
			}
		)
    return mappedData
	}

	Unpack(rows,key) {
	  return rows.map(function(row) { return row[key]; });
	}

	// A function to loop sounds; the number of iterations determined by the number of revs in each frame. 
	loopSounds(index){ 
		var numEdits = this.state.frameData[index][0].lat.length; 
		if(index > 0){
			numEdits = numEdits - this.state.frameData[index-1][0].lat.length; 
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
		this.soundsArray[i].volume = this.state.muted ? 0 : 1; 
		this.soundsArray[i].play();
	}

	async animate(){
		if(this.state.anim != null){
			// Have we initialized tstep yet? 
			if(this.state.tstep == null && this.state.frameData.length > 0){
				var tstep = 0; 
			}
			// Else we check to see if we have more data to display: 
			else if(this.state.tstep != null && Math.ceil(this.state.tstep/10) <= this.state.frameData.length-1){
				var tstep = this.state.tstep + 1; 
			}
			else if(this.state.tstep != null && Math.ceil(this.state.tstep/10) == this.state.frameData.length){
				this.props.clearInterval(this.state.anim); 
				this.setState({anim:null});	
				var tstep = this.state.tstep; 
			}
			else{
				var tstep = this.state.tstep; 
			}
			// We do things with the current tstep: 
			if(tstep != this.state.tstep){
				if(tstep % 10 == 0){
					// We update current frame: 
					var currentFrame = tstep/10; 
					var lineFrame    = Math.round(tstep/5); 
					var data         = this.state.frameData[currentFrame];
					// var lineData     = this.state.lineData[lineFrame]; 
					// Play thte sounds: 
					this.loopSounds(currentFrame); 
					// update the layout: 
					var layout = this.state.layout; 
					layout.datarevision += 1; 
					// update the data: 
					this.setState({
						data:data,
						currentFrame:currentFrame,
						tstep:tstep,
						sliderPosition:tstep,
						layout:layout,
					}); 
				}
				else if(tstep % 5 == 0){
					var lineFrame    = Math.round(tstep/5); 
					// var lineData     = this.state.lineData[lineFrame]; 
					// update the data in state: 
					this.setState({tstep:tstep,sliderPosition:tstep}); 					
				}
				else{
					this.setState({tstep:tstep,sliderPosition:tstep})
				}
			}
		}
		else{
			this.props.clearInterval(this.state.anim); 
			this.setState({anim:null});		
		}
	}

	async onPlay(){
		// Loop through frames. Updating this.state.data! 

		// Making sure we have frames, and that we want to shift from pause to play: 
		if(this.state.frameData.length > 0 && this.state.anim == null){
			// Animate:
			this.setState({anim:this.props.setInterval(this.animate, 15)}); 	
		}	
		// Else, we are playing, and we seek tp pause: 
		else if(this.state.anim != null){
			this.props.clearInterval(this.state.anim);
			this.setState({anim:null}); 
		}
	}

	onPause(){
		this.props.clearInterval(this.state.anim); 
		this.setState({anim:null}); 
	}

	onMute(){
		var muted = !this.state.muted; 
		this.setState({muted:muted}); 
	}


	async sliderChangeHandler(val){
		// handling slider changes... 
		await this.onPause(); 
		if(val != this.state.sliderPosition){
			// The first condition satisifies when the user moves the slider when there are frames, 
			// and an animation is not in progress: 
			if(this.state.frameData.length > 0){
				var roundedVal = Math.floor(val/10); 
				if(roundedVal >= this.state.frameData.length){
					roundedVal = this.state.frameData.length-1; 
				}
				var data   = this.state.frameData[roundedVal]; 
				var layout = Object.assign({},this.state.layout); 
				layout.datarevision = layout.datarevision + 1; 
				await this.setState({data:data,currentFrame:roundedVal,sliderPosition:val,anim:null,tstep:val,layout:layout,}); 
				this.loopSounds(roundedVal); 
			}
			// What if the slider 
			else if(this.state.frameData.length == 0){
				this.setState({sliderPosition:0,})
			}
		}
	}

	// This function keeps the map from disappering. 
	async mapScaler(figure){
		var layout     = Object.assign({},this.state.layout); 
		var updateData = false; 
		var update     = false; 
		// Bounding the upper and lower latitudes. Map will not vertically pan beyong (-40,60)
		if(figure["geo.center.lat"] != null){
			if(figure["geo.center.lat"] > 60){
				layout.geo.center.lat = 60; 
				update = true; 
			}
			else if(figure["geo.center.lat"] < -40){
				layout.geo.center.lat = -40; 
				update = true; 
			}
		}
		if(figure["geo.projection.scale"] != null){
			// Preventing the user from zooming any further out. Doing so excessively tends to make the map microscopic. 
			updateData = true; 
			update     = true;
			if(figure["geo.projection.scale"] < 1){
				layout.geo.projection.scale = 1; 
			}
		}
		// Update layout only: 
		if(update === true && updateData === false){
			layout.datarevision = layout.datarevision + 1; 
			await this.setState({layout:layout}); 
		}
		// Update layout and data (i.e. resize the markers). 
		else if(update === true && updateData === true){ 
			var frameData   = this.state.frameData.slice();
			var data        = this.state.data.slice(); 
			var markerScale = layout.geo.projection.scale <= 35 ? layout.geo.projection.scale : 25; 
			for(let f in frameData){
				frameData[f][0].marker.size = frameData[f][0].baseSizes.map( (x) => {return x*Math.E**((markerScale-1)/10)});
			}
			// And make sure to update the current frame!
			if(data && data[0].marker && data[0].marker.size && data[0].baseSizes){
				data[0].marker.size = data[0].baseSizes.map((x) => {return x*Math.E**((markerScale-1)/10)});
			}
			layout.datarevision = layout.datarevision + 1;
			await this.setState({layout:layout,frameData:frameData,data:data}); 
		}
	}

	renderTitleBar(){
		// Determining if we have an image etc. 
		if(this.props.imgurl && this.props.imgurl.indexOf(".svg") == -1){
			var thumbComponent = <img src={this.props.imgurl} style = {thumbStyle} />; 
		}
		else if(this.props.imgurl && this.props.imgurl.indexOf(".svg") != -1){
			var thumbComponent = <img src={this.props.imgurl} style = {thumbStyle} />; 
		}
		else{
			var thumbComponent = <div style = {letterStyle}>{this.state.title.slice(0,1)}</div>; 
		}
		// Render it up: 
		return(
			<div style = {titleRowStyle}>
			  <div style = {titleStyle}>{this.state.title}</div>
			</div>
		)
	}

	renderStatRow(){
		if(this.state.frameData.length > 0){
			return(
				<div style ={statRowStyle}>
					<div style = {statItemStyle}>
						contributors{'\n'}{this.state.uniqueEditors}
					</div>
					<div style ={statItemStyle}>
						edits{'\n'}{this.state.revArray.length}
					</div>
					<div style ={statItemStyle}>
						size{'\n'}{this.state.currentSize}
					</div>
				</div>
			); 
		}
		else{
			return(null); 
		}
	}

	renderControlBar(){
		if(this.state.frameData.length > 0){
			// need to update the labels: 
			return(
	      <ControlBar
	      	onPlay         = {this.onPlay}
	      	onPause        = {this.onPause}
	      	onMute         = {this.onMute}
	      	onSliderChange = {this.sliderChangeHandler}
	      	sliderVal      = {this.state.sliderPosition}
	      	playing        = {this.state.anim}
	      	style          = {{width:"100%",zIndex:99}}
	      	labels         = {this.state.labels}
	      />
			)
		}
		else{
			return(null); 
		}
	}

	renderMap(){
		return(
			<div style = {this.state.mapPlotContainer}>
	      <Plot
	        data          = {this.state.data}
	        layout        = {this.state.layout}
	        config        = {{displayModeBar: false}}
	        style         = {{width:"100%", height:this.state.mapPlotContainer.height}}
          onInitialized = {(figure) => this.setState(figure)}
          onRelayout    = {this.mapScaler}
	      />
      </div>
		)
	}

	render(){
		console.log(this.state.title);
		var layout = this.state.layout; 
		var frames = this.state.frameData; 
		var data   = this.state.data; 

		if(this.state.fetching == true){
			return(
				<div style = {this.state.mapDivStyle}>
					<LoadingComponent/>
				</div>
			)
		}
		else if(this.state.fetching == false && this.state.data != null && this.state.layout != null && this.state.frameData && this.state.frameData.length == 0){
			return(
				<div style = {this.state.mapDivStyle}>
					{this.renderTitleBar()}
					{this.renderMap()}
		    </div>
			)
		}
		else if(this.state.fetching == false && this.state.data && this.state.layout && this.state.frameData  && this.state.height >= 400 ){
			return(
				<div style = {this.state.mapDivStyle}>
					{this.renderTitleBar()}
					{this.renderMap()}
					{this.renderStatRow()}		      
		      <TimePlot lineData={this.state.lineData} pageid = {this.props.pageid}/>
		      {this.renderControlBar()}
		    </div>
			)
		}
		else if(this.state.fetching == false && this.state.data && this.state.layout && this.state.frameData && this.state.height < 400){
			return(
				<div style = {mapDivStyle}>
					{this.renderTitleBar()}
					{this.renderMap()}
		      {this.renderControlBar()}
					}
		    </div>
	    )			
		}
		else{
			return(
				<div style = {this.state.mapDivStyle}>
					<LoadingComponent/>
				</div>
			)
		}
	}
}

export default ReactTimeout(MapDiv)



