/************************************************************
FUNCTION TO GRAB WIKIPEDIA REVISION INFO 
*************************************************************/

export default async function GetRevs(pullObj){
  // An output container: 
  var ipArray = []; 
  var revObj= {revs:null}; 
  var filteredRevs, processedRevs; 

  // We either have a continue or we don't: 
  try{
    if(pullObj.pageid){
  	 var queryUrl  = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=revisions%7Cinfo&pageids=${pullObj.pageid}&rvprop=ids%7Ctimestamp%7Cflags%7Ccomment%7Cuser%7Csize%7Cuserid&rvlimit=500&rvdir=newer&inprop=url`; 
  	}
    else{
      var title    = encodeURIComponent(pullObj.title); 
          title    = title.replace(/%20/g,'_'); 
      var queryUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=revisions%7Cinfo&titles=${title}&rvprop=ids%7Ctimestamp%7Cflags%7Ccomment%7Cuser%7Csize%7Cuserid&rvlimit=500&rvdir=newer&inprop=url`;    
    }
    if(pullObj.cont && pullObj.cont != null && pullObj.cont.rvcontinue){
  		// We have a continue: 
		  var encodedContinue = encodeURIComponent(pullObj.cont.rvcontinue); 
      queryUrl = queryUrl + `&rvcontinue=${encodedContinue}`; 
  	}
    // Get the response and put it in json form: 
    var revResponse = await fetch(queryUrl); 
    var jsonified   = await revResponse.json(); 
    // A contuation object, if available: 
    revObj.cont = jsonified.continue ? jsonified.continue : null; 
    // Access the revisions, which are hidden in an object: 
    var keys = Object.keys(jsonified.query.pages); 
    // If our pages object contains 'page data' we can go on!
    if(keys.length > 0 && keys[0] != "-1"){
      // The revisions exist as an array of objects: 
     	revObj.title      = jsonified.query.pages[keys[0]].title;
     	var revLength     = jsonified.query.pages[keys[0]].revisions.length; 
     	revObj.revsPulled = revLength; 
     	revObj.revs       = jsonified.query.pages[keys[0]].revisions; 
      // Getting the URL: 
      if(jsonified.query.pages[keys[0]].fullurl){
        revObj.url = jsonified.query.pages[keys[0]].fullurl
      }
     	// Do the rest of processing outside of this damn thing! 
    } 
    // Clear the revResponse and return our revObject. 
    revResponse = null; 
    return revObj; 
  }
  catch(err){
    if(revObj.revs == null){
      alert("Could not map revisions for the requested page. Page is probably locked to IP revealing editors.")
    }
    else if(typeof(revObj.revs) == 'object' && revObj.revs.length == 0){
      alert("Could not map revisions for the requested page. Page is probably locked to IP revealing editors.")
    }
    return revObj; 
  }
}
