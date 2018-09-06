
export default function RemoveDuplicateIps(arr){
  var u = [];
  var reducedArray = arr.reduce( (a, b) => {
      // We only push unique elements to u! 
      if (a.user !== b.user){
      	// Add a timestamp array to b! 
        var time_ms = new Date(b.timestamp)
      	b.timesArray = [time_ms.getTime()];  
		    // And push it to [u]. 
        u.push(b);
      } 
      // Duplicate entries need updating, too! 
      else if(a.user == b.user){
        var index = u.findIndex( x => x.user == b.user ); 
        if(index != -1){
          // tack on the most recent time stamp to the appropriate element in [u]. 
        	var tStampIndex = u[index].timesArray.indexOf(b.timestamp); 
        	if(tStampIndex == -1){
            var time_ms = new Date(b.timestamp)
        		u[index].timesArray.push(time_ms.getTime());
        	}
        }
      }
      return b;
  }, []);
  // Return unique array, u[...]. 
  return u; 
}