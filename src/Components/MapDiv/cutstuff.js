	renderStatRow(){
		if(this.state.frameData.length > 0){
			return(
				<div style ={statRowStyle}>
					<div style ={{width:window.innerWidth/3,height:15,alignItems:'center',justifyContent:'center',display:'flex',flexDirection:'row',fontSize:12}}>
						SIZE
					</div>
					<div style ={{width:window.innerWidth/3,height:15,alignItems:'center',justifyContent:'center',display:'flex',fontSize:12}}>
						REV COUNT
					</div>
					<div style = {{width:window.innerWidth/3,height:15,alignItems:'center',justifyContent:'center',display:'flex',fontSize:12}}>
						UNIQUE CONTRIBUTORS
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
				<div>
	      <ControlBar
	      	onPlay         = {this.onPlay}
	      	onPause        = {this.onPause}
	      	onMute         = {this.onMute}
	      	onSliderChange = {this.sliderChangeHandler}
	      	sliderVal      = {this.state.sliderPosition}
	      	playing        = {this.state.anim}
	      	style          = {{width:this.state.width,height:100}}
	      	labels         = {this.state.labels}
	      />
	      </div>
			)
		}
		else{
			return(null); 
		}
	}

			    // <div style={{width:"100%",align:'center',display:'flex',flexDirection:'row',justifyContent:'center',height:120,overflowY:'hidden'}}>
		     //  <Plot
		     //    data={[
		     //      {
		     //        x: [1, 2, 3],
		     //        y: [10, 0, 10],
		     //        type: 'scatter',
		     //        mode: 'lines+points',
		     //        marker: {color: 'red'},
		     //      },
		     //    ]}
		     //    config = {{displayModeBar: false}}
		     //    layout ={{
		     //    	height: 120,
		     //    	width:window.innerWidth*0.6,
		     //    	plot_bgcolor:"black",
		     //    	paper_bgcolor:"#000",
		     //    	margin:{l:0,r:0,t:0,b:0},
		     //    }}
		     //    style  = {{width:"60%", height:120,overflow:'hidden'}}
		     //  />
		     //  </div>

