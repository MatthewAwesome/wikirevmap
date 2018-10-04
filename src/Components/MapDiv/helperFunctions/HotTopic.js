// A function to get most edited pages. 
// Except Deaths page, that's just morbid. 

const regs = /\D\d{1,2}(?:\r\n|\n|\r\|\s\[\[)(.*?)(?:\]\])/g;
const pid  = '47192972'; 
export default async function HotTopics(){
	try{
		// Call the api: 
		var titles  = []; 
		let apiUrl  = `https://en.wikipedia.org/w/api.php?action=query&
									format=json&
									origin=*&
									prop=revisions&
									pageids=${pid}&
									rvprop=content&
									rvlimit=1`; 
		let fetched = await fetch(apiUrl); 
		    fetched = await fetched.json(); 
		    fetched.query.pages[pid].revisions[0]["*"].match(regs).forEach((x) => {
			var title = x.split('[[')[1].split('|')[0].replace(']]','').trim(); 
			if(title.indexOf('Deaths') == -1){
				titles.push(title); 
			}
		}); 
		return titles
	}
	catch(err){
		console.log('Error fetching trending data: ', err); 
		return null
	} 
}