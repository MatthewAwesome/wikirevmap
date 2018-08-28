import GetLocation from './GetLocation'; 

export default async function CheckAndAppend(newRevs,existingRevs){
	await newRevs.forEach( async (x) => {
		var checkIndex = existingRevs.findIndex( r => r.user == x.user); 
		// A unique user: 
		if(checkIndex != -1){
			console.log('duplicate')
			// make the time string into a time number: 
			existingRevs[checkIndex].timesArray = existingRevs[checkIndex].timesArray.concat(x.timesArray); 
		}
		else{
			// We have a new one!

  		let locationData = await GetLocation(x.user); 
			if(locationData != null){
    		// Go through the fields of location object and add them to {b}. 
    		var keys = Object.keys(locationData);  
      	for(let k = 0; k < keys.length; k++){
	      	x[keys[k]] = locationData[keys[k]]; 
	      }	
    	}
    	locationData = null; 
			existingRevs.push(x); 
		}
	})
	return existingRevs
}