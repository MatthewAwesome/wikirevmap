 // Some base structures for plotting: 

// The layout for our map: 
const baseMapLayout = {
  font:{family:'Courier New',size:18,color:'white'},
  geo:{
    showcoastlines: true,
    projection:{
      type: "miller", 
    }, 
    scope:'world',
    showland:true,
    showocean:true,
    oceancolor: 'rgb(0, 0, 0)',
    landcolor: '#111111',
    coastlinecolor: '#777777',
    coastlinewidth:1, 
    bgcolor:'black',
    margin:{l:0,r:0,t:0,b:0},
    lonaxis:{range:[-180,180]}, 
    lataxis:{range:[-60,90]},
  },
  margin:{l:0,r:0,t:0,b:0},
  plot_bgcolor:"black",
  paper_bgcolor:"#000",
  autosize:true,
  hoverlabel:{
    font:{family:['Courier New',], color:'black'}, 
    bgcolor:'white', 
    bordercolor:'white', 
  },
  height:window.innerHeight-260, 
};

// Layout for the temporal line chart: 
const baseLineLayout = {
  height: 80,
  width:window.innerWidth*0.6,
  plot_bgcolor:"black",
  paper_bgcolor:"#000",
  margin:{l:0,r:0,t:0,b:0},
  showlegend: false,
  xaxis : {
    fixedrange: true, 
    range: [0, 120]
  }, 
}; 

// Instantiate the data structure for our line data: 
var baseLineData = [
  {
    x:[], 
    y:[], 
    type: 'scatter',
    mode: 'lines',
    marker:{color:'lightgray'}, 
    hoverinfo: 'none',
    fillcolor:'darkgray',
    fill:'tozeroy', 
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
// And now some stuff for our line chart: 


export{baseMapLayout,baseLineLayout,baseLineData}; 

  // annotations:[
  // 	{
  // 		text:"TITLE", 
  // 		font:{family:'courier',size:18,color:'slategray',weight:400}, 
  // 		y:0.99,
  // 		showarrow:false,
  // 		bgcolor:'black',
  // 		visible:false,
  // 	}
  // ],