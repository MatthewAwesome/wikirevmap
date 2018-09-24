
// In this function we handle duplicate IPs. When a duplicate IP is encountered, the entries are merged such that 
// each IP corresponds to a single entry. 
export default function RemoveDuplicateIps(arr){
  var reducedArray = arr.reduce( (a, b) => {
      // We only push unique elements to u! Basically we ask: Does u contain
      var index = a.findIndex( x => x.user == b.user ); 
      if(index == -1){
      	// Add a timestamp array to b! 
        var time_ms = new Date(b.timestamp)
      	b.timesArray = [time_ms.getTime()];  
        if(b.diff != null){
          b.totalDiff = b.diff; 
        }
		    // And push it to [u]. 
        a.push(b);
      } 
      else{
        // tack on the most recent time stamp to the appropriate element in [u]. 
      	var tStampIndex = a[index].timesArray.indexOf(b.timestamp); 
      	if(tStampIndex == -1){
          var time_ms = new Date(b.timestamp)
      		a[index].timesArray.push(time_ms.getTime());
          if(a[index].totalDiff != null && b.diff != null){
            a[index].totalDiff = a[index].totalDiff + b.diff; 
          }
      	}
      }
      return a;
  }, []);
  // Return unique array, u[...]. 
  return reducedArray; 
}