import SearchWikipediaImage from './SearchWikipediaImage'; 

export default async function SearchWikipedia(searchString,n){
  if(!n){
    var n = 10; 
  }; 
  try{
	  // Encode the search string to add to the query URL: 
	  let searchURL = encodeURIComponent(searchString); 
	  // Construct the query string. (searching for articles here...)
	  let apiQueryUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchURL +"&format=json&origin=*&limit=" + n.toString() + '&namespace=0&redirects=resolve';   
	  // Fetch the data from wikipedia.
	  let response = await fetch(apiQueryUrl); 
	  // Get the title, url, and image url associated with all search objects.
	  let responseBody = await response.json(); 
	  var titlesArray = responseBody[1]; 
	  var urlArray = responseBody[3]; 
	  responseBody = null; 
	  response = null; 
	  var freqContributors; 
	  if(titlesArray.length > 0){
      if(n > titlesArray.length){
        n = titlesArray.length; 
      }; 
      // URI encode the title Array: 
      var encTitlesArray = titlesArray.map(
      	(title) => {
      		var newTitle = encodeURIComponent(title); 
      		newTitle = newTitle.replace(/%20/g,'_'); 
      		return newTitle
      	}
      )
      var imgResponse = await SearchWikipediaImage(encTitlesArray); 
      imgResponse = imgResponse.filter(
      	(obj) => {
      		if(titlesArray.includes(obj.title)){
      			return obj
      		}
      	}
      ); 
      // Now map it! 
      var searchResponse = titlesArray.map(
      	(title) => {
      		// get the index of the current title.. 
      		var goodIndex = imgResponse.findIndex(
      			(obj) => {
      				if(obj.title == title){
      					return obj
      				}
      			}
      		)
      		return imgResponse[goodIndex]
      	}
      )
      // Okay. We will grab the the reviewers who appear with greatest frequency: 
    } 
  	
    return searchResponse
    

  } 
  catch(error){
    console.error('Error wiki fetch,',error)
    return error
  }
}  
