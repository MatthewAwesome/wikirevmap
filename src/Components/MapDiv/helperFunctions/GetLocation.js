/************************************************************
IP-LOCATION GRABBER
(LOCAL FOR DEVELOPMENT...NEED TO CHANGE FOR DEPLOYMENT) 
*************************************************************/

// Setting baseURL depending on build environment: 
const devMode = process.env.NODE_ENV !== 'production'; 
const baseURL = devMode ?  "http://10.0.0.201:8080/json/":"https://agile-garden-37716.herokuapp.com/json/"; 

// Assembling the function for export: 
export default async function GetLocation(userObj){
  try{
    // Replacing x's with zeros. The x's jam up the server and trigger errors. 
    let reqURL = baseURL + encodeURIComponent(userObj.user.replace(/x/g,'0')); 
    // Fetch the IP. 
    let ipData = await fetch(reqURL); 
    // Parse the response into JSON format. 
    let ipJson = await ipData.json(); 
    // Clear ipData variable. 
    ipData = null; 
    // Do we have data, location data?
    if(typeof ipJson == 'object' && ipJson.longitude && ipJson.latitude){
      var keys = Object.keys(ipJson);  
      for(let k in keys){ userObj[keys[k]] = ipJson[keys[k]] }; 
      ipJson = null; 
  		return userObj
    }
    // Crap, we don't have data..  
    else{
      ipJson = null; 
    	return null 
    }
  }
  // Fuck, we have an error... 
  catch(err){
    console.log('Could not locate IP: ' + userObj.user + '\nDue to error: ' + err)
    ipJson = null; 
    return null; 
  }
}

