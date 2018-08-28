/************************************************************
FUNCTION TO GRAB WIKIPEDIA REVISION INFO 
*************************************************************/

export default async function GetRevs(pageid,cont){
  // An output container: 
  var ipArray = []; 
  var revObj= {}; 
  var filteredRevs, processedRevs; 

  // We either have a continue or we don't: 
  try{
  	var queryUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=revisions&pageids=' + pageid + '&rvprop=ids%7Ctimestamp%7Cflags%7Ccomment%7Cuser%7Csize%7Cuserid&rvlimit=50&rvdir=newer'; 
  	if(cont && cont.rvcontinue){
  		// We have a continue: 
		  var encodedContinue = encodeURIComponent(cont.rvcontinue); 
      queryUrl = queryUrl + "&rvcontinue=" + encodedContinue; 
  	}
    var revResponse = await fetch(queryUrl); 
    // Get the response in json form: 
    var jsonified = await revResponse.json(); 
    revResponse = null; 
    // A contuation object, if available: 
    revObj.cont = jsonified.continue ? jsonified.continue : null; 
    // Access the revisions, which are hidden in an object: 
    var keys = Object.keys(jsonified.query.pages); 
    // If our pages object contains 'page data' we can go on!
    if(keys.length > 0 && keys[0] != "-1"){
      // The revisions exist as an array of objects: 
     	revObj.title = jsonified.query.pages[keys[0]].title;
     	var revLength = jsonified.query.pages[keys[0]].revisions; 
     	revObj.revsPulled = revLength; 
     	revObj.revs = jsonified.query.pages[keys[0]].revisions; 
     	// Do the rest of processing outside of this damn thing! 
    } 
    return revObj; 
  }
  catch(err){
    console.log(err,'ERROR')
    // alert("Could not map revisions for the requested page. Page is probably locked to IP revealing editors.")
    return revObj; 
  }
}
