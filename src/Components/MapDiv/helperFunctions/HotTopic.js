// A function to get a list of the 25 most visited pages on Wikipedia. 
// The list is updated weekely. 
// The top-25 list returned as an array of strings (titles).

/* 2023-08-25: Need to update this make changes. Wikipedia change the format of the page, 
 and this rendered my previous code useless.

 Said useless code has been commmented out. 
*/  

// const regs = /\D\d{1,2}(?:\r\n|\n|\r\|\s\[\[)(.*?)(?:\]\])/g;

// A regex to identify the articles comprising Wikipedia Top-25 list. 
// e.g. a pattern to match something like this: "|-\n| 3\n| [[<top25Link>]]"
const linkRegex = /\|\-\n\|\s?\d{1,2}\n\|\s(\'\')?\[\[(.*?)\]\]/g;
const pid  = '47192972'; 
export default async function HotTopics(){
	try{
		// A container for the titles. 
		var titles  = []; 
		// Call the wikipedia api a first time to parse the content of the top-25 page:
		let firstApiUrl  = `https://en.wikipedia.org/w/api.php?action=parse&
									format=json&
									origin=*&
									pageid=${pid}&
									prop=wikitext&
									formatversion=2`;
								
		// Now fetch the data by calling the api using the first url:
		let firstFetched = await fetch(firstApiUrl); 
		// Convert the response to json:
		firstFetched     = await firstFetched.json();
		// Access the wikitext property of the response:
		let wikitext     = firstFetched.parse.wikitext;
		// and format the wikitext as a url: 
		wikitext         = encodeURIComponent(wikitext);

		// Now we incorporate the wikitext into the second api call, using the expandtemplates action
		// to expand the wikitext. 
		let secondApiUrl = `https://en.wikipedia.org/w/api.php?action=expandtemplates&
									format=json&
									origin=*&
									text=${wikitext}&
									prop=wikitext&
									formatversion=2`;

		// Now fetch the data by calling the api using the second url:
		let secondFetched = await fetch(secondApiUrl);
		// Convert the response to json:
		secondFetched     = await secondFetched.json();
		// Access the wikitext property of the response:
		let wikitext2     = secondFetched.expandtemplates.wikitext;
		
		// Use a regex to parse the wikitext and extract pertinent information: 
		wikitext2.match(linkRegex).forEach((x) => {
			// split the string on the pipe character:
			var splitStr = x.split('|');
			// The title is the 4th element of the split array: 
			var title = splitStr[3].replace('[[','').replace(']]','').replace("''",'').trim();
			titles.push(title);
		})

		return titles
		
		// let apiUrl  = `https://en.wikipedia.org/w/api.php?action=query&
		// 							format=json&
		// 							origin=*&
		// 							prop=revisions&
		// 							pageids=${pid}&
		// 							rvprop=content&
		// 							rvlimit=1&
		// 							rvslots=*`; 
		// let fetched = await fetch(apiUrl); 
		//     fetched = await fetched.json(); 
		// 	console.log(fetched);
		// 	// lets see what is in the response: 
		// 	console.log(fetched.query.pages[pid].revisions[0].slots.main.content)
		//     fetched.query.pages[pid].revisions[0]["*"].match(regs).forEach((x) => {
		// 	var title = x.split('[[')[1].split('|')[0].replace(']]','').trim(); 
		// 	titles.push(title);
			
		// 	// if(title.indexOf('Deaths') == -1){
		// 	// 	titles.push(title); 
		// 	// }
		// }); 
		
		// return titles
	}
	catch(err){
		console.log('Error fetching trending data: ', err); 
		return null
	} 
}