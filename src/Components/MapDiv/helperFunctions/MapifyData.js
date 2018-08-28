	mapifyData(){
		console.log(this.props.readyToPlot);
		if(this.props.readyToPlot == true){
			console.log('mapify')
		  // This function will operate upon props.data. 
	    // The raw data: 
	    var maxTimes = this.props.maxTimes; 
	    console.log(maxTimes)
	    var lats       = Unpack(this.props.data,'latitude') ;
	    var lons       = Unpack(this.props.data,'longitude'); 
	    var tstamps    = Unpack(this.props.data,'timesArray'); 
	    // Arrays and such: 
	    var markerSizes = []; 
	    var textArray = []; 
	    var markerColors = []; 
	    var markerOpacities = [];
	    var scale = 32; 

	    // Fill the arrays with IP data. 
	    for ( let i = 0 ; i < this.props.data.length; i++) {
	      var markerSize = Math.log(tstamps[i].length/maxTimes+1) * scale; 
	      var markerText = ""; 
	      if(this.props.data[i].city && this.props.data[i].city.length != 0){
	          markerText = markerText + this.props.data[i].city + ", "; 
	      }
	      if(this.props.data[i].region_name && this.props.data[i].region_name.length != 0){
	        markerText = markerText + this.props.data[i].region_name + ", "; 
	      }
	      if(this.props.data[i].country_name && this.props.data[i].country_name.length != 0){
	        markerText = markerText + this.props.data[i].country_name + "\n"; 
	      }
	      markerText = markerText + "Number of Edits: " + this.props.data[i].timesArray.length.toString();
	      textArray.push(markerText); 
	      markerSizes.push(markerSize); 
	      markerColors.push('coral');
	      markerOpacities.push(this.props.data[i].timesArray.length / maxTimes);  
	    }

	    // Populate a data array. 
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
	    this.setState({mapData:dataContainer}); 
  	}
	}
