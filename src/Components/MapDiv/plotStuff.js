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
  height:window.innerHeight-250, 
  datarevision:0, 
};

// Layout for the temporal line chart: 
const baseLineLayout = {
  height: 80,
  width:window.innerWidth*0.6+240,
  plot_bgcolor:"transparent",
  paper_bgcolor:"transparent",
  margin:{l:120,r:120,t:0,b:0},
  showlegend: false,
  xaxis : {
    fixedrange: true, 
    range: [0, 120], 
    showgrid:false, 
  }, 
  yaxis:{
    showgrid:false, 
    tickfont:{
      family: 'Courier New',
      size: 16,
      color: 'white'
    },
    tickvals:[0,], 
    ticktext:['',],
    ticks:'outside',
    linewidth: 2,
  },
  datarevision:0, 
  annotations: [
    {
      x: 0,
      y: 5,
      text: 'REVS/WEEK           ',
      font:{family:'courier',size:16,color:'white',weight:400}, 
      showarrow: false,
    }
  ], 
}; 

// Instantiate the data structure for our line data: 
const baseLineData = [
  {
    x:[], 
    y:[], 
    type: 'scatter',
    mode: 'lines',
    marker:{color:'lightgray'}, 
    hoverinfo: 'none',
    fillcolor:'rgba(128,128,128,0.6)',
    fill:'tozeroy', 
  }, 
  {
    x:[], 
    y:[], 
    type: 'scatter',
    mode: 'lines',
    marker:{color:'white'}, 
    hoverinfo: 'none',
    fillcolor:'rgba(128,128,128,0.6)', 
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