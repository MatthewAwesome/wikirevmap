/************************************************************
IP-LOCATION GRABBER
(LOCAL FOR DEVELOPMENT...NEED TO CHANGE FOR DEPLOYMENT) 
*************************************************************/

// Setting baseURL depending on build environment: 
const devMode = process.env.NODE_ENV !== 'production'; 
const baseURL = devMode ?  "http://10.0.0.201:8080/json/":"https://agile-garden-37716.herokuapp.com/json/"; 


// Assembling the function for export: 
export default async function GetLocation(userip,server){
  try{
    // Replacing x's with zeros. The x's jam up the server and trigger errors. 
    userip = userip.replace(/x/g,'0'); 
    // baseURL is configured above, and depends if we are local or build for web: 
    let reqURL = baseURL + encodeURIComponent(userip); 
    // Fetch the IP. 
    let ipData = await fetch(reqURL); 
    // Parse the response into JSON format. 
    let ipJson = await ipData.json(); 
    // Clear ipData variable. 
    ipData = null; 
    // Do we have data?
    if(typeof ipJson == 'object' && ipJson.longitude && ipJson.latitude){
  		return ipJson
  		ipJson = null; 
    }
    // Crap, we don't have data..  
    else{
    	return null 
    	ipJson = null; 
    }
  }
  // Fuck, we have an error... 
  catch(err){
    console.log('Could not locate IP: ' + userip + '\nDue to error: ' + err)
    return null; 
    ipJson = null; 
  }
}

