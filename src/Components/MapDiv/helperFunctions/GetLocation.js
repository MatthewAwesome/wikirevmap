/************************************************************
IP-LOCATION GRABBER
(LOCAL FOR DEVELOPMENT...NEED TO CHANGE FOR DEPLOYMENT) 
*************************************************************/

// Setting baseURL depending on build environment: 
const baseURL = process.env.NODE_ENV !== 'production' ?  "http://10.0.0.201:8080/json/":"https://agile-garden-37716.herokuapp.com/json/"; 

// Assembling the function for export: 
export default async function GetLocation(userObj){
  try{
    // Replacing x's with zeros. The x's jam up the server and trigger errors. 
    let reqURL = baseURL + encodeURIComponent(userObj.user.replace(/x/g,'0')); 
    // Fetch the IP. 
    let ipData = await fetch(reqURL); 
    // Parse the response into JSON format. 
    let ipJson = await ipData.json(); 
    // Do we have data, location data?
    if(ipJson && ipJson != null && typeof ipJson == 'object' && ipJson.longitude && ipJson.latitude){
      var keys = Object.keys(ipJson);  
      for(let k in keys){userObj[keys[k]] = ipJson[keys[k]]}; 
  		return userObj
    }
    // Crap, we don't have data..  
    else{
    	return null 
    }
  }
  // Fuck, we have an error... 
  catch(err){
    console.log('Could not locate IP: ' + userObj.user + '\nDue to error: ' + err)
    return null; 
  }
}

