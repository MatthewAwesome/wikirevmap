import React, { Component } from 'react';
import LoadingComponent from './LoadingComponent'; 
import Plot from 'react-plotly.js';
import {mapDivStyle} from './styles'; 
import {baseLayout} from './MapStuff';
import CheckAndAppend from './helperFunctions/CheckAndAppend'; 
import GetRevs from './helperFunctions/GetRevs'; 
import GetLocation from './helperFunctions/GetLocation'; 
import RemoveDuplicateIps from './helperFunctions/RemoveDuplicateIps'; 
import FilterRevs from './helperFunctions/FilterRevs'; 
import Slider from 'react-rangeslider'; 
import ReactTimeout from 'react-timeout'; 
import 'react-rangeslider/lib/index.css'; 
import ControlBar from './ControlBar'; 

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
		// Some variables for potential use: 
    var D = new Date(); 

    // Initialize the state container: 
    this.state = { data: [{type: 'scattergeo'}], 
	    layout: baseLayout,
	    frameData: [],
	    config: {displayModeBar: false},
	    rawdata:[],
	    now:D.getTime(),
	    revPullComplete:false,
	    bday:null, 
	    revCount:0, 
	    maxTimes:1,
	    fetching:false, 
	    baseLayout:baseLayout, 
	    baseData:[{type: 'scattergeo'}],
	    cleared:true, 
	    width:window.innerWidth, 
	    currentFrame:0, 
	    sliderPosition:0,
	    muted:false, 
	    buffering:false, 
	    revArray:[], 
	    cont:null, 
	    articleAge:null, 
	    endPts:null, 
	    labels:{}, 
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
		this.GetMoreRevs         = this.GetMoreRevs.bind(this); 
		this.renderControlBar    = this.renderControlBar.bind(this); 
	}

  // To handle browser resize; 
  updateDimensions() {
    this.setState({width: window.innerWidth});
  }; 

  // Attached UpdateDimensions to our window: 
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }


  // componentDidUpdate is used to fetch and/or clear data for wiki_revs: 
	async componentDidUpdate(prevProps,prevState){

		// This ie executed when the user initial comes into the app.  
		if(prevProps.pageid != this.props.pageid && this.state.cleared == true){
			console.log('about to pull')
			// This call pulls the first rev batch: 
			await this.RevPuller();
		}

		// Do we need to clear existing data, users has requested a new page: 
		else if(prevProps.pageid != this.props.pageid && this.state.cleared == false){
			var D = new Date(); 
			await this.setState({
				frameData:[],
				data:this.state.baseData,
				layout:this.state.baseLayout,
				sliderSteps:[],
				now:D.getTime(),
				revPullComplete:false,
				bday:null,
				articleAge:null, 
				revCount:0,
				maxTimes:1,
				fetching:false, 
				cleared:true,
				cont:null, 
				endPts:null, 
				labels:{}, 
				currentFrame:0, 
				sliderPosition:0, 
				anim:null, 
			});  
		}

		// Fetching after the clear: 
		else if(prevState.cleared == false && this.state.cleared == true){
			console.log('pulling after clearing')
			await this.RevPuller(); 
		}

		// Fetching additional revs... 
		else if(prevState.cont != this.state.cont && this.state.cont != null){
			console.log('getting more')
			await this.RevPuller(); 
		}

		// Setting state signifying that we have pulled all the revs for a given page: 
		else if(prevState.cont != null && this.state.cont == null){
			// And we tack on end label: 
			var labels   = this.state.labels; 
			var tEnd     = new Date(this.state.endPts[61]); 
			labels[61] = tEnd.toGMTString().slice(8,16);
			// Get a middle pt. too, 
			var tMid     = new Date(this.state.endPts[31]); 
			labels[31] = tMid.toGMTString().slice(8,16); 
			this.setState({revPullComplete:true,labels:labels})
			console.log('complete\n',this.state.frameData.length)
		}

	}

	// Update when we receive new data: 
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

		else if(nextState && nextState.revArray != this.state.revArray){
			return true; 
		}


		// Tells us we have new frames and are ready to display accordingly: 
		else if(nextState && this.state.frameData.length && this.state.frameData.length != nextState.frames.length){
			return true; 
		}

		else if(nextState && this.state.cont != nextState.cont){
			return true; 
		}

		else if(nextState && nextState.fetching != this.state.fetching){
			return true;
		}

		else if(nextState && nextState.width != this.state.width){
			return true; 
		}

		else if(nextState && nextState.sliderPosition != this.state.sliderPosition){
			return true; 
		}

		// If all else fails, we don't update the thing: 
		else{
			return false; 
		}

	}

	async RevPuller(){
		try{

			// Take care of some basic stuff: 
			var revCount   = this.state.revCount; 
			var revData    = await GetRevs(this.props.pageid,this.state.cont); 
			var cont       = revData.cont == null ? null : revData.cont; 
			var bdayObj    = new Date(revData.revs[0].timestamp); 
			var bday       = bdayObj.getTime(); 
			var articleAge = this.state.now - bday; 
			revCount      += revData.revsPulled; 

			// Update state with article age and/or bday: 
			if(this.state.bday == null && this.state.articleAge == null){
				// Take this opportunity to make a vector of date end points: 
				var endPts = []; 
				for(let j = 0; j < 62; j++){
					var endpt = bday + ((j+1) * articleAge / 62); 
					endPts.push(endpt)
				}
				// Begin to make the labeles for slider: 
				var bdayStr = bdayObj.toGMTString().slice(8,16); 
				var labels = this.state.labels; 
				labels[0] = bdayStr; 
				this.setState({bday:bday,articleAge:articleAge,cleared:false,endPts:endPts,labels:labels,fetching:true}); 
			}
			
			// Right here, we are going to determine how many frames we can make with the pulled revs: 
			var lastTime = new Date(revData.revs[revData.revs.length-1].timestamp); 
			lastTime = lastTime.getTime(); 
			var framesToMake = this.getNumberOfFrames(lastTime,this.state.frameData); 
			
			// Clean up the revs // 
      revData.revs  = FilterRevs(revData.revs); 
      revData.revs  =  RemoveDuplicateIps(revData.revs); 
      revData.revs  = await CheckAndAppend(revData.revs,this.state.revArray);  
			
      // Update state accordingly: 
			if(framesToMake > 0){
				// Make the frames: 
				var frames = this.framifyData(revData.revs,framesToMake); 
				// we update labels again: 
				var labels = this.state.labels; 
				if(frames.frameData.length != this.state.endPts.length){
					var labels = this.state.labels; 
					// get percent loaded: 
					var pct = Math.round((frames.frameData.length/62)*100).toString(); 
					labels[61] = pct + "% loaded..."
				}
				// Make a title: 
				// title string: 
				console.log(this.props.pageurl)
				var annotations = [
			  	{
			  		text: revData.title, 
			  		font:{family:'courier',size:18,color:'white',weight:400}, 
			  		y:0.99,
			  		showarrow:false,
			  		bgcolor:'black',
			  		visible:true,
			  	}
  			]; 
  			var layout = this.state.layout; 
  			layout.annotations = annotations; 
				this.setState({
					revCount:revCount,
					revArray:revData.revs,
					frameData:frames.frameData,
					maxTimes:frames.maxTimes, 
					fetching:false,
					cont:cont,
					labels:labels, 
					layout:layout, 
				});			
			}
			else{
				this.setState({
					revCount:revCount,
					revArray:revData.revs,
					cont:cont
				});		
			}
		}
		catch(error){
			console.log('Error in search result handler: ', error); 
		}
	}

	async GetMoreRevs(){
		try{
			// Keep calling the api and updating the data container: 
			var revCount = this.state.revCount; 
			var rvArray = this.state.revArray;
			var revData = await GetRevs(this.props.pageid,this.state.cont); 
			revCount    += revData.revsPulled; 
			revData.revs = FilterRevs(revData.revs); 
			var noDups       = await RemoveDuplicateIps(revData.revs); 
			revData.revs = noDups; 
			var appendedRevs = await CheckAndAppend(revData.revs,rvArray);  
			var frames = this.framifyData(appendedRevs,this.state.frameData,this.state.articleAge,this.state.bday); 
			var cont = revData.cont == null ? null : revData.cont; 
			if(frames != null){
				await this.setState({
					revCount:revCount,
					revArray:appendedRevs,
					frameData:frames.frameData,
					maxTimes:frames.maxTimes, 
					cont:cont
				}); 				
			}
			else{
				await this.setState({
					revCount:revCount,
					revArray:appendedRevs, 
					cont:cont,
				}); 					
			}
		}
		catch(error){
			console.log('Error getting more revs: ', error); 
		}
	}


	getNumberOfFrames(lastTime){
		// The last timestamp in each timesArray should be the most recent. Put all the 
		var timePercent = (lastTime - this.state.bday) / this.state.articleAge; 
		var framesPossible = Math.floor(timePercent * 62); 
		var numberOfFrames = Math.floor(timePercent * 62) - this.state.frameData.length; 
		return numberOfFrames
	}

	// Function to place data into frames as dictated by the incoming data: 
	framifyData(revArray,framesToMake){
		try{
			// Getthe 'maxTimes'. This might be unnecessary... 
			var times = revArray.map( (x) => {
				return x.timesArray.length; 
			})
			var maxTimes = Math.max(...times);
			var newFrames = []; 
			var oldFrames = this.state.frameData; 
			// Filter data according to frame! 
			for(let i = oldFrames.length; i < oldFrames.length + framesToMake; i++){
				// Get max time. 
				// Filter revs accordingly: 
				var filteredData = revArray.filter( (x) => {
					var tIndex = x.timesArray.findIndex( t => t < this.state.endPts[i]); 
					if(tIndex != -1){
						return true
					}
					else{
						return false; 
					}
				}).map(
					(x) => {
						var last_t_index = x.timesArray.findIndex( t => t > this.state.endPts[i]);
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
				var lats       = this.Unpack(x,'latitude') ;
		    var lons       = this.Unpack(x,'longitude'); 
		    var tstamps    = this.Unpack(x,'timesArray'); 
	      // Arrays to house of plot info:  
		    var markerSizes     = []; 
		    var textArray       = []; 
		    var markerColors    = []; 
		    var markerOpacities = [];
		    var scale           = 30; 
		    x.forEach(
		    	(y,index) => {
				    var markerSize = Math.log(y.timesArray.length * Math.E) * 3;  
			      var markerText = ""; 
			      if(y.city && y.city.length != 0){
			          markerText = markerText + y.city + ", "; 
			      }
			      if(y.region_name && y.region_name.length != 0){
			        markerText = markerText + y.region_name + ", "; 
			      }
			      if(y.country_name && y.country_name.length != 0){
			        markerText = markerText + y.country_name + "\n"; 
			      }
			      markerText = markerText + "Number of Edits: " + y.timesArray.length.toString();
			      textArray.push(markerText); 
			      markerSizes.push(markerSize); 
			      markerColors.push('coral');
			      markerOpacities.push(y.timesArray.length / maxTimes); 	    		
		    	}
		    )
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
	loopSounds(){
		var frame = this.state.currentFrame;  
		var numEdits = this.state.frameData[frame][0].lat.length; 
		if(frame > 0){
			numEdits = numEdits - this.state.frameData[frame-1][0].lat.length; 
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
			this.loopSounds(); 
			var data = this.state.frameData[this.state.currentFrame]; 
			// Do we have another frame available?
			if(this.state.currentFrame < this.state.frameData.length-1){
				this.setState({currentFrame:this.state.currentFrame+1,data:data,sliderPosition:this.state.currentFrame+1}); 
			}
			else if(this.state.revPullComplete == true){
				this.props.clearInterval(this.state.anim); 
				this.setState({anim:null});
			}
		}
		else{
			this.props.clearInterval(this.state.anim); 
		}
	}

	async onPlay(){
		// Loop through frames. updating this.state.data! 
		var frames = this.state.frameData; 
		if(frames.length > 0 && this.state.anim == null){
			if(this.state.currentFrame == this.state.frameData.length-1){
				var currentFrame = 0; 
			}
			else{
				var currentFrame = this.state.currentFrame; 
			}
			this.setState({anim:this.props.setInterval(this.animate, 300),currentFrame:currentFrame}); 	
		}	
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
		if(val != this.state.sliderPosition){
			// The first condition satisifies when the user moves the slider when there are frames, 
			// and an animation is not in progress: 
			if(this.state.anim == null && this.state.frameData.length > 0){
				var roundedVal = Math.round(val); 
				if(roundedVal <= this.state.frameData.length-1){
					var data = this.state.frameData[roundedVal]; 
					this.setState({data:data,currentFrame:roundedVal,sliderPosition:val}); 
					this.loopSounds(); 
				}
				else{
					this.setState({sliderPosition:this.state.currentFrame+0.5})
				}
			}
			// What if the slider 
			else if(this.state.frameData.length == 0){
				this.setState({sliderPosition:0})
			}
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
	      	style          = {{width:window.innerWidth,height:100}}
	      	labels         = {this.state.labels}
	      />
			)
		}
		else{
			return(null); 
		}
	}

	// Define a render function for our class: 
	render(){

		var layout = this.state.layout; 
		var frames = this.state.frameData; 
		var data = this.state.data; 
		if(this.state.fetching == true){
			console.log('fetching render')
			return(
				<div style = {mapDivStyle}>
					<LoadingComponent/>
				</div>
			)
		}
		else if(this.state.fetching == false && this.state.data && this.state.layout && this.state.frameData){
			return(
				<div style = {mapDivStyle}>
		      <Plot
		        data={this.state.data}
		        layout           = {this.state.layout}
		        config           = {{displayModeBar: false}}
		        style            = {{width:window.innerWidth, height:window.innerHeight-150}}
		        useResizeHandler = {true}
	          onInitialized    = {(figure) => this.setState(figure)}
	          onRelayout       = {(figure) => {this.setState(figure)}}
		      >
		      </Plot>
		      {this.renderControlBar()}
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

export default ReactTimeout(MapDiv)



