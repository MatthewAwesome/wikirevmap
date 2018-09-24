// A function to process IP-revs for mapping!

import GetLocation from './GetLocation'; 
import FilterRevs  from './FilterRevs'; 
import RemoveDuplicateIps from './RemoveDuplicateIps'; 

export default async function CheckAndAppend(newRevs,existingRevs){
  newRevs = FilterRevs(newRevs); 
	newRevs = RemoveDuplicateIps(newRevs); 
	// Here, existingRevs is empty. We build it up using newRevs and grabbing the location for each IP: 
	if(existingRevs.length == 0){
    await newRevs.reduce( 
  	async function (acc,currElement){
  		if(currElement.user != null){
  			currElement = await GetLocation(currElement); 
  			if(currElement != null){
  				existingRevs.push(currElement); 
  			}
		    return acc
  		}
  	},[]); 	
	}
	// We have some existing revs, so, we check and see if we already have its location. 
	else{
	  await newRevs.forEach( async (x) => {
			var checkIndex = await existingRevs.findIndex( (r) => {
				if(x.user == r.user){
					return true; 
				}
			}); 
			// User already existing, and is not a vandal: 
			if(checkIndex != -1 && existingRevs[checkIndex].totalDiff && x.totalDiff){
				existingRevs[checkIndex].timesArray = existingRevs[checkIndex].timesArray.concat(x.timesArray); 
				existingRevs[checkIndex].totalDiff  = existingRevs[checkIndex].totalDiff + x.totalDiff; 
			}
			else if(checkIndex != -1 && existingRevs[checkIndex].vandal  == true){
				existingRevs[checkIndex].timesArray = existingRevs[checkIndex].timesArray.concat(x.timesArray); 
			}
			// User exists, and is a vandal 
			else if(checkIndex == -1 && x.user != null){
	  		x = await GetLocation(x); 
	  		if(x != null){
	  			existingRevs.push(x); 
	  		}
			}
		})		
	}

	return existingRevs
}