/************************************************************
IP-LOCATION GRABBER
(LOCAL FOR DEVELOPMENT...NEED TO CHANGE FOR DEPLOYMENT) 
*************************************************************/

// Changed to make it happen one by one: 
export default async function GetLocation(userip,server){
  // Okay, now we go through revs and add the ip data: 
  // query the heroku server! 
  // console.log(userip);
  userip = userip.replace(/x/g,'0'); 
  var baseURL = "https://agile-garden-37716.herokuapp.com/json/"; 
  var reqURL = baseURL + encodeURIComponent(userip); 
  try{
    let ipData = await fetch(reqURL); 
    let ipJson = await ipData.json(); 
    ipData = null; 
    if(typeof ipJson == 'object' && ipJson.longitude && ipJson.latitude){
  		return ipJson
  		ipJson = null; 
    }
    else{
    	return null 
    	ipJson = null; 
    }
  }
  catch(err){
    console.log('Could not locate IP: ' + userip + '\nDue to error: ' + err)
    console.log(ipData); console.log(ipJson);
    return null; 
    ipJson = null; 
  }
}

