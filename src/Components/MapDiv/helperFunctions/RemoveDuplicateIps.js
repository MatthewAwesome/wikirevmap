
export default function RemoveDuplicateIps(arr){
	// We are going to concatenate the
  var u = [];
  var maxTimeLength = 1; 
  var reducedArray = arr.reduce( (a, b) => {
      // We only push unique elements to it! 
      // a is our accumulator. We compare b against accumulated elements in [a]. 
      // b is the working element.
      if (a.user !== b.user){
      	// IP does not have a duplicate that we known of thus far:
      	// Add a timestamp array to b! 
        var time_ms = new Date(b.timestamp)
      	b.timesArray = [time_ms.getTime()];  
      	// Get location!
		     // and push {b} to the running array: 
		     u.push(b);
      	
      } 
      else if(a.user == b.user){
        // IP has a duplicate, need to handle accordingly: 
        var index = u.findIndex( x => x.user == b.user ); 
        if(index != -1){
        	// b will will have a timestamp val, add it to u's timeStamp array: 
        	// Check and see if we have tabulated the current time stamp yet: 
        	var tStampIndex = u[index].timesArray.indexOf(b.timestamp); 
        	if(tStampIndex == -1){
            var time_ms = new Date(b.timestamp)
            console.log('duplicate!')
        		u[index].timesArray.push(time_ms.getTime());
        	}
        }
      }
      return b;
  }, []);
  // Okay. Lets get the locations for users we seek: 
  return u
}