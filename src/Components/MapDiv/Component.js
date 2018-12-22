/**************************************************************
	MAPDIV COMPONENT 
**************************************************************/

import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingComponent from './LoadingComponent'; 
import Plot from 'react-plotly.js';
import {
	thumbStyle,
	letterStyle,
	titleStyle,
	titleRowStyle, 
	mapPlotContainer,
	mapDivStyle,
	arrowButtonStyle,
	mobileTitleStyle, 
	mapDivMobileStyle,
	mobileTitleFont,
	mapPlotContainerMobile, 
} from './styles'; 
import {
	baseMapLayout,
	baseLineLayout, 
	traceOne, 
	traceTwo,
	traceThree,
} from './plotStuff';
import GetRevs from './helperFunctions/GetRevs'; 
import ProcessIpRevs from './helperFunctions/ProcessIpRevs'; 
import GetLocation from './helperFunctions/GetLocation'; 
import UserChecker from './helperFunctions/UserChecker'; 
import Slider from 'react-rangeslider'; 
import ReactTimeout from 'react-timeout'; 
import ControlBar from './ControlBar'; 
import TimePlot from './TimePlot'; 
import StatRow  from './StatRow'; 
import {alphaGray1,alphaGray2,alphaGray3,alphaGray4} from '../../Extras/grays'; 
import {pageviews} from './helperFunctions/pageview';
import HotTopics from './helperFunctions/HotTopic'; 
/* Some notes on what we need to do here: 

* Pulling data needs to be broken up. The wait time at present is unacceptable for most 
  pages that garner even modest interest. 

* Need to pull some telling stats. Page Size, # of edits, # Unique contributors, etc, 

* Can we identify vandals? And plot them acccordingly? Could be neat! Where are most vandals located? 

*/

class MapDiv extends Component{

	constructor(props){

		// super-size, anyone? 
		super(props); 
  
    // Initialize the state container: 
    this.state = { data: [{type: 'scattergeo'}], 
	    layout: baseMapLayout,
	    frameData: [],
	    revPullComplete:false,
	    maxTimes:1,
	    fetching:false, 
	    cleared:true, 
	    width:window.innerWidth, 
	    height:window.innerHeight, 
	    sliderPosition:0,
	    muted:false, 
	    revArray:[], 
	    ipRevArray:[], 
	    cont:null, 
	    mapEnds:null, 
	    lineEnds:null,
	    labels:{}, 
	    tstep:null, 
	    lineData:[traceOne,traceTwo,traceThree,],
	    currentSize:'', 
	    uniqueEditors:0, 
	    mapDivStyle:mapDivStyle, 
	    mapPlotContainer:mapPlotContainer, 
	    mapPlotContainerMobile:mapPlotContainerMobile, 
	    vandalList:[], 
	    title:'',
	    traceVis:[true,false,false], 
	    selectedMarkers:[], 
	    trendingIndex:0, 
	    trending:[],
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
		this.onRewind            = this.onRewind.bind(this); 
		this.toggleTrace         = this.toggleTrace.bind(this); 
		this.markerToggle        = this.markerToggle.bind(this);
		this.stepTrend           = this.stepTrend.bind(this); 
		this.getTimeStep         = this.getTimeStep.bind(this); 
	}

  // To handle browser resize; 
  updateDimensions() {
  	// Instantiate some variables: 
  	let divStyle           = Object.assign({},this.state.mapDivStyle); 
  	let plotStyle          = Object.assign({},this.state.mapPlotContainer); 
  	let mapLayout          = Object.assign({},this.state.layout); 
  	let mapMobile          = Object.assign({},this.state.mapPlotContainerMobile)
  	let heightCheck        = window.innerHeight < 400 ? 400 : window.innerHeight; 
  	// Update necessary fields: 
  	if(window.innerWidth < 600){
  		divStyle.height        = window.innerHeight-100; 
  		plotStyle.height       = heightCheck-400; 
	  	mapLayout.height       = heightCheck-400;
	  	mapMobile.height       = heightCheck-400; 
  	}
  	else{
  		divStyle.height        = window.innerHeight-60; 
	  	plotStyle.height       = heightCheck-300; 
	  	mapLayout.height       = heightCheck-300; 
	  	mapMobile.height       = heightCheck-300; 
  	}
  	// plotStyle.height       = heightCheck-300; 
  	// mapLayout.height       = heightCheck-300; 
  	mapLayout.datarevision = mapLayout.datarevision + 1; 
  	// And update the state accordingly: 
    this.setState({
    	width: window.innerWidth,
    	height:window.innerHeight,
    	mapDivStyle:divStyle,
    	mapPlotContainer:plotStyle, 
    	mapPlotContainerMobile:mapmobile, 
    	layout:mapLayout,
    });
  }; 

  // Attached UpdateDimensions to our window: 
  async componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    // Get hot topics: 
    let trending = await HotTopics(); 
    this.setState({trending:trending});     
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
		else if(nextState && nextState.traceVis!= this.state.traceVis){
			return true; 
		}
		else if(nextState && nextState.trending != this.state.trending){
			return true;
		}
		else if(nextState && nextState.trendingIndex != this.state.trendingIndex){
			return true;
		}
		else if(nextProps && nextProps.trending != this.props.trending){
			return true; 
		}
		// If all else fails, we don't update the thing: 
		else{
			return false; 
		}
	}

  // componentDidUpdate is used to fetch and/or clear data for wiki_revs: 
	async componentDidUpdate(prevProps,prevState){
	// 	// This ie executed when the user initial comes into the app.
		if(prevProps.pageid != this.props.pageid && this.state.cleared == true){
			// This call pulls the first rev batch: 
			let date     = new Date('2001-01-15T00:00:00'); // date.setFullYear(date.getFullYear()-1);
			let pullObject = {pageid:this.props.pageid,rvstart:date.toISOString()}
			await this.RevPuller(pullObject);
		}
		// Do we need to clear existing data, users has requested a new page: 
		else if((prevProps.pageid != this.props.pageid && this.state.cleared == false) || (this.state.trendingIndex != prevState.trendingIndex && this.state.cleared == false)){
			var lineData = this.state.lineData; 
			lineData[0].x = []; 
			lineData[0].y = []; 
			lineData[0].visible = true; 
			lineData[1].x = []; 
			lineData[1].y = []; 
			lineData[1].visible = false; 
			lineData[2].x = []; 
			lineData[2].y = []; 
			lineData[2].visible = false; 
			var layout = this.state.layout; 
			layout.datarevision += 1; 
			// 
			var data = [{type: 'scattergeo'}]; 
			await this.setState({
				frameData:[],
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
				sliderPosition:0, 
				anim:null, 
				lineData:lineData, 
				tstep:null, 
				revArray:[], 
				ipRevArray:[], 
				cont:null, 
				currentSize:'',
				uniqueEditors:0, 
				vandalList:[],
				title:'',
				layout:layout, 
				data:data,
				traceVis:[true,false,false], 
				selectedMarkers:[], 
			});
		}
		// Fetching after the clear when we aren't scanning trending topics: 
		else if(prevState.cleared == false && this.state.cleared == true && this.props.trending == false ){
			let date     = new Date('2001-01-15T00:00:00');
			let pullObject = {pageid:this.props.pageid,rvstart:date.toISOString()}
			await this.RevPuller(pullObject); 
		}
		// Fetching another trending topic:  
		else if(prevState.cleared == false && this.state.cleared == true && this.props.trending == true ){
			let date     = new Date(); date.setFullYear(date.getFullYear()-1);
			let pullObj  = {title:this.state.trending[this.state.trendingIndex],rvstart:date.toISOString()};  
	    await this.RevPuller(pullObj); 
		}
		// Fetching additional revs... 
		else if(prevState.cont != this.state.cont && this.state.cont != null && this.props.trending == false){
			let date     = new Date('2001-01-15T00:00:00');
			let pullObject = {pageid:this.props.pageid,cont:this.state.cont}
			await this.RevPuller(pullObject); 
		}
		else if(prevState.cont != this.state.cont && this.state.cont != null && this.props.trending == true){
			let date     = new Date(); date.setFullYear(date.getFullYear()-1);
			let pullObject = {title:this.state.trending[this.state.trendingIndex],cont:this.state.cont,rvstart:date.toISOString()}
			await this.RevPuller(pullObject); 
		}
		// Setting state signifying that we have pulled all the revs for a given page: 
		else if(prevState.cont != null && this.state.cont == null){
			// And we tack on end label: 
			var labels   = this.state.labels; 
			var tEnd     = new Date(this.state.mapEnds[this.state.mapEnds.length-1]); 
			labels[this.state.lineEnds.length*3-1]  = tEnd.toGMTString().slice(8,16);
			// Get a middle pt. too, 
			var tMidIndex = Math.round(this.state.mapEnds.length/2)-1; 
			var tMid     = new Date(this.state.mapEnds[tMidIndex]); 
			var midIndex = Math.round((this.state.lineEnds.length * 3)/2) -1; 
			labels[midIndex]  = tMid.toGMTString().slice(8,16); 
			console.log(labels,tMid)
			this.setState({
				revPullComplete:true,
				labels:labels,
			})
		}
		// Sometimes all the revs get fetch in a single call, and therefore cont never goes to null; this is handled below. 
		else if(prevState.revPullComplete == false && this.state.revPullComplete == true){
			var labels   = this.state.labels; 
			var tEnd     = new Date(this.state.mapEnds[this.state.mapEnds.length-1]); 
			labels[this.state.lineEnds.length*3-1] = tEnd.toGMTString().slice(8,16);
			// Get a middle pt. too, 
			var tMidIndex = Math.round(this.state.mapEnds.length/2)-1; 
			var tMid     = new Date(this.state.mapEnds[tMidIndex]); 
			var midIndex = Math.round((this.state.lineEnds.length * 3)/2) -1; 
			labels[midIndex] = tMid.toGMTString().slice(8,16); 
			console.log(labels[midIndex],tMid); 
			this.setState({
				labels:labels,
			})
		}
		// Called when we get new trending data. Should only happen on page load. 
		else if(prevState.trending != this.state.trending){
			// Establish a date a subtract one year. 
			let date     = new Date(); date.setFullYear(date.getFullYear()-1);
			let pullObj  = {title:this.state.trending[0],rvstart:date.toISOString()};  
	    await this.RevPuller(pullObj); 
		}
	}

	async RevPuller(pullObject){
		// Here we grab revs. 

		// Need to modify to pull trending topics AND user selected pages. 
		try{
			var revData    = await GetRevs(pullObject); 
			// Bookmark our rev-grabbing spot with a continue: 
			var cont       = revData.cont == null ? null : revData.cont; 
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
							// Determine the articles birthday: 
				var bdayObj    = new Date(revData.revs[0].timestamp); 
				var bday       = bdayObj.getTime(); 
				var D          = new Date(); 
				var now        = D.getTime(); 
				// And its age: 
				var articleAge = now - bday; 
				// DOING IT DIFFERENTLY! START AT NOW AND WORK BACKWARDS, ONE WEEK AT A TIME. EVERY 4TH WEEK IS A MAP FRAME. 
				// Take this opportunity to make time vectors and labels: 
				var lineEnds = [], mapEnds = []; 
				// Fill up the arrays:
				var niter = 0;  
				var tNow = now;

				// We need to make a timestep : 
				var timeStep = this.getTimeStep(bday,now); 
				while(tNow > bday){
					lineEnds.push(tNow); 
					if(niter % 4 == 0){
						mapEnds.push(tNow); 
					}
					tNow = tNow - timeStep; 
					niter += 1; 
				}

				lineEnds = lineEnds.reverse(); 
				mapEnds = mapEnds.reverse(); 
				// Begin to make the labeles for slider: 
				var bdayStr = bdayObj.toGMTString().slice(8,16); 
				var labels  = this.state.labels; 
				labels[0]   = bdayStr; 

				// try and pull some page views: 
				// let pageViews = await pageviews.getPerArticlePageviews({
				//   project: 'en.wikipedia',
				//   start: bdayObj,
				//   end: D,
				//   article:'Dud',
				// })
				// let parsedViews = await pageViews.json(); 

				this.setState({
					bday:bday,
					articleAge:articleAge,
					cleared:false,
					lineEnds:lineEnds,
					mapEnds:mapEnds,
					labels:labels,
					fetching:true, 
					title:revData.title,
					pageurl:revData.url,
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
			var framesToMake = this.getNumberOfFrames(lastTime); 

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
      var lineFrames = this.getLineFrames(accRevs,framesToMake.lineFrames); 
			// Make/update frames: 
			var frames = this.framifyData(revData.revs,framesToMake.mapFrames,newVandals); 
			// we update labels again: 
			var labels = this.state.labels; 
			if(frames.frameData.length != this.state.mapEnds.length){
				var labels = this.state.labels; 
				// get percent loaded: 
				var pct = Math.round((lineFrames[0].x.length/this.state.lineEnds.length)*100).toString(); 
				labels[this.state.lineEnds.length*3-1] = pct + "% loaded..."
			}
			// Make a title: 
			// title string: 
			var annotations = [
		  	{
		  		text: 'dude', 
		  		font:{family:'courier',size:100,color:'white',weight:400}, 
		  		y:0,
		  		x:0,
		  		showarrow:false,
		  		bgcolor:'black',
		  		visible:false,
		  	}
			]; 
			var layout = this.state.layout; 
			layout.datarevision += 1; 
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
				lineData:lineFrames,
			});			
		}
		catch(error){
			console.log('Error in rev puller: ', error); 
		}
	}

	// For getting timestep (we can move the function later to an external file to keep things neat). 
	getTimeStep(start,end){
		// THESE ARE APPROX!
		let tSpan   = end-start; 
		let dayMs   = 8.64e+7; 
		let weekMs  = dayMs *7; 
		let monthMs = weekMs * 4; 
		let yearMs  = monthMs * 12; 
		// Is it a month or less?
		if(tSpan<=monthMs){
			var tDiff = dayMs; 
		}
		// Between one and two months?
		else if(tSpan > monthMs && tSpan <= monthMs*2){
			var tDiff = dayMs * 2; 
		}
		// Between two and three months?
		else if(tSpan > monthMs*2 && tSpan <= monthMs*3){
			var tDiff = dayMs * 3; 
		}
		// Between three and four months?
		else if(tSpan > monthMs*3 && tSpan <= monthMs*4){
			var tDiff = dayMs * 4; 
		}
		// Between four and five months?
		else if(tSpan > monthMs*4 && tSpan <= monthMs*5){
			var tDiff = dayMs * 5; 
		}
		// Between 5 months and three years? 
		else if(tSpan > monthMs*5 && tSpan <= yearMs*3){
			var tDiff = weekMs;  
		}
		// Between three and five years? 
		else if(tSpan > yearMs*3 && tSpan <= yearMs*5){
			var tDiff = weekMs * 2;  
		}
		// 5+ years... 
		else{
			var tDiff = monthMs; 
		}
		return tDiff
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
		let lineFrames = this.state.lineEnds.findIndex( x => x>lastTime) - this.state.lineData[0].x.length + 1; 
		let mapFrames  = this.state.mapEnds.findIndex( x => x>lastTime) - this.state.frameData.length + 1; 
		return {mapFrames:mapFrames,lineFrames:lineFrames}
	}

	// Assembling data for our line chart: (want edits,contributors,size!)
	getLineFrames(revs,framesToMake){
		// Establish some vars to make frames: 
		var lineData  = this.state.lineData; 
		var startI    = this.state.lineData[0].x.length; 
		var maxI      = framesToMake + this.state.lineData[0].x.length; 
		var frameWeek = (this.state.lineEnds[1]-this.state.lineEnds[0])/6.048e8; // 6.048e8 milliseconds in a week!
		// Iterate and add frames:  
		if(framesToMake > 0){
			for(let i = startI; i < maxI; i++){
				var startTime = i == 0 ? this.state.articleAge : this.state.lineEnds[i-1]; 
				var endTime   = this.state.lineEnds[i]; 
				// Determine how many revs are between these point. 
				var loppedRevs = revs.filter(
					(x) => {
						var timeObject = new Date(x.timestamp); 
						var msTime     = timeObject.getTime(); 
						if(msTime < endTime ){
							return true; 
						}
						else{
							return false; 
						}
					}
				); 
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
				// What about size? 
				lineData[1].x.push(i); 
				lineData[1].y.push(loppedRevs[loppedRevs.length-1].size/1000); 
				// // what about edit count: 
				lineData[2].x.push(i); 
				lineData[2].y.push(loppedRevs.map(x => x.user).filter(this.removeDuplicates).length); 
				// What about unique contributors: 
			}
		}
		else if(lineData[0].x.length > 0){
			var i = lineData[0].x.length-1; 
			var startTime = this.state.lineEnds[i-1]; 
			var endTime = this.state.lineEnds[i]; 
			var loppedRevs = revs.filter(
				(x) => {
					var timeObject = new Date(x.timestamp); 
					var msTime     = timeObject.getTime(); 
					if(msTime < endTime ){
						return true; 
					}
					else{
						return false; 
					}
				}
			); 
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
			lineData[0].y[i] = filteredRevs.length/frameWeek; 
			lineData[1].y[i] = loppedRevs[loppedRevs.length-1].size/1000; 
			lineData[2].y[i] = loppedRevs.map(x => x.user).filter(this.removeDuplicates).length;  
		}
		// Okay, we've finished interating, lets update the state; 
		return lineData
	}

	// Function to place data into frames as dictated by the incoming data: 
	framifyData(revArray,framesToMake,vandalList){
		try{
			// Getthe 'maxTimes'. This might be unnecessary...  
			let times     = revArray.map( (x) => {return x.timesArray.length}); 
			let maxTimes  = Math.max(...times);
			var oldFrames = this.state.frameData; 
			// We have frames to add! 
			if(framesToMake > 0){
				var newFrames = []; 
				for(let i = oldFrames.length; i < oldFrames.length + framesToMake; i++){
					console.log(i);
					var dd = new Date(this.state.mapEnds[i]); 
					var filteredData = revArray.filter( (x) => {
						var tIndex = x.timesArray.findIndex( t => t <= this.state.mapEnds[i]); 
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
			// We want to update the last frame: 
			else if(framesToMake == 0 && oldFrames.length > 0){
				console.log(oldFrames);
				let i = oldFrames.length-1;
				console.log(i);
				var filteredData = revArray.filter( (x) => {
					var tIndex = x.timesArray.findIndex( t => t <= this.state.mapEnds[i]); 
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
				var newFrame = this.getFrameData([filteredData],maxTimes); 
				oldFrames.splice(oldFrames.length-1,1,newFrame[0]); 
				return{frameData:oldFrames,maxTimes:maxTimes}; 
			}
			else{
				return {frameData:[],maxTimes:maxTimes}; 
			}
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
		    var fullText        = []; 
		    x.forEach(
		    	(y,index) => {
		    		if(y.vandal == false){
					    var markerSize = Math.log((y.timesArray.length) * Math.E) * 4;  
					    var editStr = y.timesArray.length == 1 ? ' Edit': ' Edits' 
				      var markerText = '<b>' + y.timesArray.length.toString() + editStr + '</b><br>'; 
				      if(y.totalDiff && y.totalDiff >= 0){
				      	markerText = markerText + '<b style="color:#4AC948;">' + Math.abs(y.totalDiff).toString() + ' bytes added</b><br>'; 
				      }
				      else if(y.totalDiff && y.totalDiff < 0){
				      	markerText = markerText + '<b style="color:red;">' + Math.abs(y.totalDiff).toString() + ' bytes deleted</b><br>'; 
				      } 
				      else if(y.totalDiff == 0){
				      	markerText = markerText + '<b style="color:#4AC948;">' + Math.abs(y.totalDiff).toString() + ' bytes added</b><br>'; 
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
				      fullText.push(markerText); 	
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
				      fullText.push(markerText); 			    	
				    }
			  	}
		    )
		    var dataContainer = [{
		      type: 'scattergeo',
		      mode: "markers",
		      lat: lats,
		      lon: lons,
		      hoverinfo: 'text',
		      hoverlabel:{font:{family:'Courier New',size:14},bgcolor:markerColors,align:'center'},
		      text: textArray,
		      textfont:{family:['Courier New',],size:14, color:'white'},
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
		      fullText:fullText,
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
			else if(this.state.tstep != null && Math.ceil(this.state.tstep/12) <= this.state.frameData.length){
				var tstep = this.state.tstep + 1; 
			}
			else if(this.state.tstep != null && this.state.tstep >= this.state.lineEnds.length * 3){
				console.log(this.state.tstep,'clearing')
				this.props.clearInterval(this.state.anim); 
				this.setState({anim:null});	
				var tstep = this.state.tstep; 
			}
			else{
				console.log('stuck')
				console.log(this.state.tstep,this.state.lineEnds.length,this.state.frameData.length)
				var tstep = this.state.tstep; 
			}
			// We do things with the current tstep: 
			if(tstep != this.state.tstep){
				if(tstep % 12 == 0){
					// We update current frame: 
					var currentFrame = tstep/12; 
					// var lineData     = this.state.lineData[lineFrame]; 
					// Play thte sounds: 
					if(currentFrame > this.state.frameData.length-1){
						this.props.clearInterval(this.state.anim); 
						this.setState({anim:null});							
					}
					else{
						var lineFrame = Math.round(tstep/4); 
						var data = this.state.frameData[currentFrame];
						this.loopSounds(currentFrame); 
						// update the layout: 
						var layout = this.state.layout; 
						layout.datarevision += 1; 
						// update the data: 
						this.setState({
							data:data,
							tstep:tstep,
							sliderPosition:tstep,
							layout:layout,
							selectedMarkers:[], 
						}); 						
					}

				}
				else if(tstep % 4 == 0){
					var lineFrame    = Math.round(tstep/4); 
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
			console.log('clearning',this.state.tstep)
			this.props.clearInterval(this.state.anim); 
			this.setState({anim:null});		
		}
	}

	async onPlay(){
		// Loop through frames. Updating this.state.data! 

		// Making sure we have frames, and that we want to shift from pause to play: 
		if(this.state.frameData.length > 0 && this.state.anim == null){
			// Animate:
			this.setState({anim:this.props.setInterval(this.animate, 5)}); 	
		}	
		// Else, we are playing, and we seek tp pause: 
		else if(this.state.anim != null){
			this.props.clearInterval(this.state.anim);
			this.setState({anim:null}); 
		}
	}

	// Seems obvious what this one does; 
	onPause(){
		this.props.clearInterval(this.state.anim); 
		this.setState({anim:null}); 
	}

	// Sound on/off?
	onMute(){
		var muted = !this.state.muted; 
		this.setState({muted:muted}); 
	}

	// Resetting the slider position to root: 
	onRewind(){
		var data = this.state.frameData[0]
		var layout = this.state.layout; 
		layout.datarevision += 1; 
		if(this.state.anim != null){
			var tstep = 0; 
			this.props.clearInterval(this.state.anim);
			this.setState({anim:null,tstep:0,data:data,sliderPosition:0,layout:layout,}); 
		}
		else{
			this.setState({tstep:0,data:data,sliderPosition:0,layout:layout,}); 
		}
	}


	async sliderChangeHandler(val){
		// handling slider changes... 
		await this.onPause(); 
		if(val != this.state.sliderPosition){
			// The first condition satisifies when the user moves the slider when there are frames, 
			// and an animation is not in progress: 
			if(this.state.frameData.length > 0){
				var roundedVal = Math.floor(val/12); 
				if(roundedVal >= this.state.frameData.length){
					roundedVal = this.state.frameData.length-1; 
				}
				var data   = this.state.frameData[roundedVal]; 
				var layout = Object.assign({},this.state.layout); 
				layout.datarevision = layout.datarevision + 1; 
				await this.setState({data:data,sliderPosition:val,anim:null,tstep:val,layout:layout,selectedMarkers:[],}); 
				this.loopSounds(roundedVal); 
			}
			// What if the slider 
			else if(this.state.frameData.length == 0){
				this.setState({sliderPosition:0,})
			}
		}
	}

	// A function to toogle marker labels on/of. 
	markerToggle(object){
		// We have marker text to show: 
		this.onPause(); 
		// We can use this function see what else a given user/ip has edited: 
		// if(object.points){
		// 	var data            = object.points[0].data; 
		// 	var layout          = this.state.layout; 
		// 	var selectedMarkers = this.state.selectedMarkers; 
		// 	data.text[object.points[0].pointIndex] = data.fullText[object.points[0].pointIndex]; 
		// 	data.text[selectedMarkers[0]] = ''; 
		// 	selectedMarkers[0] = object.points[0].pointIndex
		// 	layout.datarevision += 1; 
		// 	this.setState({data:[data],layout:layout,selectedMarkers:selectedMarkers}); 
		// }
		// // We have nothing to show and a marker to clear:
		// else if(this.state.selectedMarkers.length > 0){
		// 	var data            = this.state.data; 
		// 	var layout          = this.state.layout; 
		// 	var selectedMarkers = this.state.selectedMarkers; 
		// 	data[0].text[selectedMarkers[0]] = '';
		// 	layout.datarevision += 1; 
		// 	this.setState({data:data,layout:layout,selectedMarkers:[]})
		// }
	}

	// This function keeps the map from disappering. 
	async mapScaler(figure){
		var layout     = Object.assign({},this.state.layout); 
		var updateData = false; 
		var update     = false; 
		layout.datarevision = layout.datarevision + 1; 
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
			await this.setState({layout:layout}); 
		}
		// Update layout and data (i.e. resize the markers). THIS IS PROBLEMATIC. IF THE USER IS ALREADY ZOOMED IN, AND A BUNCH OF EDITS GET ADDED, 
		// they could be stuck with really BIG mrkers! 
		else if(update === true && updateData === true){ 
			// How big is our data> ( if we have more than 2500 markers, we dont' update the size. )
			var frameData = this.state.frameData.slice();
			var sizes     = frameData.map( x => x.length);
			var data      = this.state.data.slice();
			var maxSizes  = Math.max(...sizes);  
			// Updating too many markers is too damn slow.  
			if(maxSizes <= 2500){
				var markerScale = layout.geo.projection.scale <= 35 ? layout.geo.projection.scale : 25; 
				for(let f in frameData){
					frameData[f][0].marker.size = frameData[f][0].baseSizes.map( (x) => {return x*Math.E**((markerScale-1)/10)});
				}
				// And make sure to update the current frame!
				if(data && data[0].marker && data[0].marker.size && data[0].baseSizes){
					data[0].marker.size = data[0].baseSizes.map((x) => {return x*Math.E**((markerScale-1)/10)});
				}
				await this.setState({layout:layout,frameData:frameData,data:data});
			}
			// Update the markers so users don't get stuck with big markers AND tons of data. 
			else if(maxSizes <= 2500 && data[0].marker.size != data[0].baseSizes){
				for(let f in frameData){
					for(let p in frameData[f][0].marker.size){
						frameData[f][0].marker.size[p] = frameData[f][0].baseSizes[p];
						if(f == 0){
							 data[0].marker.size[p] = data[0].baseSizes[p]
						} 
					}
				}
				await this.setState({layout:layout,frameData:frameData,data:data});			
			}
			else{
				await this.setState({layout:layout});
			} 
		}
	}

	toggleTrace(trace){
		console.log(trace)
		var lineData = this.state.lineData; 
		if(trace == 'revs'){
			var traceVis = [true,false,false]; 
		}
		else if(trace == 'size'){
			var traceVis = [false,true,false];
		}
		else if(trace == 'contributors'){
			// update the stat row style (font color, bgcolor):
			var traceVis = [false,false,true];
		}
		console.log(lineData);
		lineData[0].visible = traceVis[0];
		lineData[1].visible = traceVis[1];  
		lineData[2].visible = traceVis[2];
		this.setState({traceVis:traceVis,lineData:lineData}); 
	}

	stepTrend(direction){
		// Update trendingIndex and initiate a clear. 
		if(direction == 'left'){
			var trending = this.state.trendingIndex - 1; 
			trending = trending == -1 ? this.state.trending.length-1 : trending; 
		}
		else{
			var trending = this.state.trendingIndex + 1; 
			trending = trending == this.state.trending.length ? 0 : trending; 
		}

		this.setState({trendingIndex:trending})
	}
	// The title bar will be able to accomodate multiple title, and accomodate trending topic scanninng. 
	renderTitleBar(){ 
		if(this.props.trending == false){
			return(
				<div style = {titleRowStyle}>
				  <a style = {titleStyle} href={this.props.pageurl} target="_blank">{this.state.title}</a>
				</div>
			)
		}
		else if(this.props.trending == true && this.state.trending != []){
			let index  = this.state.trendingIndex + 1; 
			if(window.innerWidth < 700){
				var string = `Trending Topic #${index}:\n`; 
				var style = mobileTitleStyle; 
				var fontStyle = mobileTitleFont; 
			}
			else{
				var string = `Trending Topic #${index}:\n`;
				var style = titleRowStyle; 
				var fontStyle = titleStyle; 
			}
			
			return(
				<div style = {style}>
					<FontAwesomeIcon
						icon='arrow-circle-left'
						style = {arrowButtonStyle}
						onClick = { () => this.stepTrend('left')}
					/>
					<div style = {fontStyle}>
						{string}
				  	<a style = {fontStyle} href={this.state.pageurl} target="_blank">{this.state.trending[this.state.trendingIndex]}</a>
			  	</div>
			  	<FontAwesomeIcon
						icon='arrow-circle-right'
						style = {arrowButtonStyle}
						onClick = { () => this.stepTrend('right')}
					/>
				</div>
			)			
		}
		else{
			return(null)
		}
	}

	renderStatRow(){
		if(this.state.frameData.length > 0){
			return(
				<StatRow
					toggleTrace = {this.toggleTrace}
					revArray    = {this.state.revArray}
					currentSize = {this.state.currentSize}
					uniqueEditors = {this.state.uniqueEditors}
					traceVis = {this.state.traceVis}
				/>
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
	      	onRewind       = {this.onRewind}
	      	onMute         = {this.onMute}
	      	onSliderChange = {this.sliderChangeHandler}
	      	sliderVal      = {this.state.sliderPosition}
	      	playing        = {this.state.anim}
	      	style          = {{width:"100%",zIndex:99}}
	      	labels         = {this.state.labels}
	      	max            = {this.state.lineEnds.length * 3 - 1}
	      />
			)
		}
		else{
			return(null); 
		}
	}

	renderMap(){
		if(this.state.width<700){
			var mstyle = this.state.mapPlotContainerMobile; 
		}
		else{
			var mstyle = this.state.mapPlotContainer; 
		}
		return(
			<div style = {mstyle}>
	      <Plot
	        data          = {this.state.data}
	        layout        = {this.state.layout}
	        config        = {{displayModeBar: false}}
	        style         = {{width:"100%", height:mstyle.height}}
          onInitialized = {(figure) => this.setState(figure)}
          onRelayout    = {this.mapScaler}
          onClick       = {this.markerToggle}
	      />
      </div>
		)
	}

	render(){
		var layout = this.state.layout; 
		var frames = this.state.frameData; 
		var data   = this.state.data; 
		console.log(this.state.frameData,this.state.mapEnds);
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
		      <TimePlot 
		      	lineData = {this.state.lineData} 
		      	pageid   = {this.props.pageid}
		      	traceVis = {this.state.traceVis}
		      />
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



