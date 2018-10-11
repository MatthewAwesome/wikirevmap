 // Some base structures for plotting: 

// The layout for our map: 

// Thinking we should add visibility buttons for markers, etc.
const baseMapLayout = {
  font:{family:'Courier New',size:18,color:'white'},
  geo:{
    showcoastlines: true,
    projection:{
      type: "miller", 
      rotation:{lat:0,lon:0},
      scale:1,
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
    center:{lat:0,lon:0}, 
  },
  margin:{l:0,r:0,t:0,b:0},
  plot_bgcolor:"black",
  paper_bgcolor:"#000",
  autosize:true,
  hoverlabel:{
    font:{family:['Courier New',],size:14, color:'black'}, 
    bgcolor:'white', 
    bordercolor:'white', 
  },
  height:window.innerHeight-300, 
  datarevision:0, 
  doubleClick:false,
  dragmode:false,
  annotations:[
   {
     text:"TITLE", 
     font:{family:'courier',size:18,color:'slategray',weight:400}, 
     lat:0,
     lon:0,
     showarrow:false,
     bgcolor:'black',
     visible:false,
   }
  ],
};

// color palette: 
// rgb(0, 255, 255)
// rgb(198, 0, 235)
// rgb(150, 255, 2)

// Layout for the temporal line chart: 
const baseLineLayout = {
  height: 80,
  width:window.innerWidth*0.48+200,
  plot_bgcolor:"transparent",
  paper_bgcolor:"transparent",
  margin:{l:100,r:100,t:5,b:2},
  showlegend: false,
  xaxis : {
    fixedrange: true, 
    range: [0, 12], 
    showgrid:false,
    zeroline: false,
    zerolinewidth:2,
    zerolinecolor:'lightgray',
    visible:true,
  }, 
  yaxis:{
    showgrid:false, 
    tickfont:{
      family: 'Courier New',
      size: 16,
      color: 'rgb(0, 255, 255)', 
      weight:800,
    },
    tickvals:[0,], 
    ticktext:['',],
    ticks:'outside',
    linewidth: 1,
    color:'lightgray',
    fixedrange: true,
    range:[0,], 
    visible:true,
    rangemode: 'nonnegative',
  },
  yaxis2:{
    showgrid:false, 
    tickfont:{
      family: 'Courier New',
      size: 16,
      color: 'rgb(255, 255, 235)', 
      weight:800,
    },
    anchor: 'x',
    tickvals:[0,], 
    ticktext:['',],
    ticks:'outside',
    linewidth: 1,
    color:'lightgray',
    overlaying: 'y',
    side: 'right', 
    range:[0,], 
    fixedrange: true,
    visible:false,
    rangemode: 'nonnegative',
  },
  yaxis3:{
    showgrid:false, 
    tickfont:{
      family: 'Courier New',
      size: 16,
      color: 'rgb(150, 255, 2)', 
      weight:800,
    },
    anchor: 'x',
    tickvals:[0,], 
    ticktext:['',],
    ticks:'outside',
    linewidth: 1,
    color:'lightgray',
    overlaying: 'y',
    side: 'right', 
    range:[0,], 
    fixedrange: true,
    visible:false,
    rangemode: 'nonnegative',
  },
  datarevision:0, 
  annotations: [
    {
      x: 0,
      y: 0,
      text: 'EDITS/WK        ',
      font:{family:'courier',size:14,color:'rgb(0,255,255)',weight:400}, 
      showarrow: false,
      visible:false,
    }, 
    {
      x:120, 
      y:0, 
      text: '<b style="color:rgb(255,0,235);">         SIZE,kB</b>',
      font:{family:'courier',size:14,color:'rgb(255, 0, 235)',weight:400}, 
      showarrow: false,
      visible:false,     
    },
    {
      x:120, 
      y:0, 
      text: '<b style="color:;rgb(150, 255, 2)">        EDITORS</b>',
      font:{family:'courier',size:14,color:'rgb(150, 255, 2)',weight:400}, 
      showarrow: false,
      visible:false,     
    }, 
    {
      x:120, 
      y:0, 
      text: '<b style="color:rgb(150, 255, 2);">        EDITORS</b><br><b style="color:rgb(255,0,235);">         (Size,kB)</b>',
      font:{family:'courier',size:14,color:'rgb(255, 0, 235)',weight:400}, 
      showarrow: false,
      visible:false,     
    },   
  ], 
}; 
// rgb(255, 123, 0)
const traceOne = {
  x:[], 
  y:[], 
  type: 'scatter',
  mode: 'lines',
  line:{color:'rgb(0, 255, 255)',width:2},
  hoverinfo: 'none',
  name: 'rev_v_time', 
  yaxis:'y1',
  visible:true,
}; 

const traceTwo = {
  x:[], 
  y:[], 
  type: 'scatter',
  mode: 'lines',
  line:{color:'rgb(255, 0, 235)',width:2}, 
  hoverinfo: 'none',
  name:'size_v_time', 
  yaxis: 'y2',
  visible:false,
}; 

const traceThree = {
  x:[], 
  y:[], 
  type: 'scatter',
  mode: 'lines',
  line:{color:'rgb(150, 255, 2)',width:2}, 
  hoverinfo: 'none', 
  name:'contribs', 
  visible:false,
  yaxis:'y3',
}




export{baseMapLayout,baseLineLayout,traceOne,traceTwo,traceThree,}; 

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