
var RandomColor = require("random-color");

export default async function SearchWikipediaImage(titleArray) {
  try{
    // Get the image (or at least try!)
    var titleString = 'titles='; 
    var pageArray = []; 
    for(var i = 0; i < titleArray.length; i += 50){
    	var titlesJoined = titleArray.slice(i,i+50).join('%7C').replace(/%20/g,'_');
    	var queryString = titleString + titlesJoined; 
	    var imageURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&" + queryString + "&piprop=thumbnail&pilimit=50&pilicense=any&redirects=1"; 
	    var imageResponse = await fetch(imageURL);  
	    var parsedResponse = await imageResponse.json();
	    imageResponse = null; 
	    if(parsedResponse){
	      let responsePageObject = parsedResponse.query.pages; 
	      parsedResponse = null; 
	      var keys = Object.keys(responsePageObject); 
	      for(var k in keys){
	        var pageObject = {}; 
	        pageObject.title = responsePageObject[keys[k]].title;
	        pageObject.pageid = responsePageObject[keys[k]].pageid; 
	        if(responsePageObject[keys[k]].thumbnail){
	          // We can change the size if we want. 50px is the default.  max magnitude of either direction. 
	          pageObject.image =  responsePageObject[keys[k]].thumbnail.source; 
	        }
	        else{
	          pageObject.color = RandomColor({luminosity: 'dark', hue:'blue'}); 
	        }
	        pageArray.push(pageObject); 
	      }
	    } 
  	}
  	if(pageArray.length == titleArray.length){
    	return pageArray
    }
  }
  catch(error){
    console.log("Error searching for image ", error) 
  }
}