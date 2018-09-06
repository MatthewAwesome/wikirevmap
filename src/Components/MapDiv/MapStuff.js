    // Defining a default layout:

const baseLayout = {
  font:{family:'courier-new',size:18,color:'white'},
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

export{baseLayout}; 

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