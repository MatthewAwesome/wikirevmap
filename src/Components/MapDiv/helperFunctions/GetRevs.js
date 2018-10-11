/************************************************************
FUNCTION TO GRAB WIKIPEDIA REVISION INFO 
*************************************************************/

export default async function GetRevs(pullObj){
  // An output container: 
  var ipArray = []; 
  var revObj= {revs:null}; 
  var filteredRevs, processedRevs; 
  try{
    // Search gives pagedids. 
    if(pullObj.pageid){
      var startTime = pullObj.rvstart ? '&rvstart='+encodeURIComponent(pullObj.rvstart) : ''; 
  	 var queryUrl  = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=revisions%7Cinfo&pageids=${pullObj.pageid}&rvprop=ids%7Ctimestamp%7Cflags%7Ccomment%7Cuser%7Csize%7Cuserid&rvlimit=500${startTime}&rvdir=newer&inprop=url`; 
  	}
    // Trending topics are pulled using titles. 
    else{
      var title     = encodeURIComponent(pullObj.title); 
          title     = title.replace(/%20/g,'_'); 
      var startTime = pullObj.rvstart ? '&rvstart='+encodeURIComponent(pullObj.rvstart) : ''; 
      var queryUrl  = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=revisions%7Cinfo&titles=${title}&rvprop=ids%7Ctimestamp%7Cflags%7Ccomment%7Cuser%7Csize%7Cuserid&rvlimit=500${startTime}&rvdir=newer&inprop=url`;    
    }
    // Do we have a continue?
    if(pullObj.cont && pullObj.cont != null && pullObj.cont.rvcontinue){
		  var encodedContinue = encodeURIComponent(pullObj.cont.rvcontinue); 
      queryUrl = queryUrl + `&rvcontinue=${encodedContinue}`; 
  	}
    // Get the response and put it in json form: 
    let revResponse = await fetch(queryUrl); 
    let jsonified   = await revResponse.json(); 
    // A contuation object, if available: 
    revObj.cont = jsonified.continue ? jsonified.continue : null; 
    // Access the revisions, which are hidden in an object: 
    let keys = Object.keys(jsonified.query.pages); 
    // If our 'pages' object contains 'page data' we can go on!
    if(keys.length > 0 && keys[0] != "-1"){
      // The revisions exist as an array of objects: 
     	revObj.title      = jsonified.query.pages[keys[0]].title;
     	revObj.revsPulled = jsonified.query.pages[keys[0]].revisions.length;  
     	revObj.revs       = jsonified.query.pages[keys[0]].revisions; 
      // We might want the pages url! (need to reduce dependcy of this.prop if we really want to make multiple pages happen) 
      if(jsonified.query.pages[keys[0]].fullurl){
        revObj.url = jsonified.query.pages[keys[0]].fullurl
      }
    } 
    // Clear the revResponse and return our revObject. 
    revResponse = null; 
    return revObj; 
  }
  // Sometimes user interaction throws the error below. ****** NEED TO FIX *******
  catch(err){
    console.log(err);
    if(revObj.revs == null){
      alert("Apologies, could not map revisions for the requested article. Please try another article.")
    }
    else if(typeof(revObj.revs) == 'object' && revObj.revs.length == 0){
      alert("Apologies, could not map revisions for the requested article. Please try another article.")
    }
    return revObj; 
  }
}
