import GetLocation from './GetLocation'; 

export default async function CheckAndAppend(newRevs,existingRevs){
	if(existingRevs.length == 0){
    await newRevs.reduce( 
  	async function (acc,currElement){
  		if(currElement.user != null){
  			let locationData = await GetLocation(currElement.user); 
  			if(locationData != null){
      		// Go through the fields of location object and add them to {b}. 
      		var keys = Object.keys(locationData);  
	      	for(let k = 0; k < keys.length; k++){
		      	currElement[keys[k]] = locationData[keys[k]]; 
		      }	
		      existingRevs.push(currElement); 
		      return acc
      	}
  		}
  	},[]); 	
	}
	else{
	  await newRevs.forEach( async (x) => {
			var checkIndex = await existingRevs.findIndex( r => r.user == x.user); 
			// A unique user: 
			if(checkIndex != -1){
				// make the time string into a time number: 
				existingRevs[checkIndex].timesArray = existingRevs[checkIndex].timesArray.concat(x.timesArray); 
			}
			else if(x.user != null){
				// We have a new one!
	  		var locationData = await GetLocation(x.user); 
				if(locationData != null){
	    		// Go through the fields of location object and add them to {b}. 
	    		var keys = Object.keys(locationData);  
	      	for(let k = 0; k < keys.length; k++){
		      	x[keys[k]] = locationData[keys[k]]; 
		      }	
		      existingRevs.push(x); 
	    	}
	    	locationData = null; 
			}
		})		
	}
	return existingRevs
}