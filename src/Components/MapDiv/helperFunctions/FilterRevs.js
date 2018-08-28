import UserChecker from './UserChecker';
export default function FilterRevs(revArray){
    // Isolate IP users:  (We can probably get away with using the 'userid == 0' stuff); 
  revArray = revArray.map( (x) => {
    		x.timesArray = [x.timestamp]; 
    		if(x && x.user && x.user.indexOf('.') != -1 && x.user.indexOf('x') != -1){
    			x.user = x.user.replace(/x/g,'0'); 
    		}
    		return x
  		}
  	)
  	.filter(r => r.userid == 0).filter(UserChecker); 
  return revArray
}