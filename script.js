$(document).ready(function(){

	var data = []
	//CALLING GOOGLE SHEETS	
	$.ajax({ 
		url: 'http://spreadsheets.google.com/feeds/list/1f49DfeQfb4zXttLTeSFVpbW-yc2hnYNiZ-cA3KBRCas/default/public/basic?alt=json',
		type: 'get',
		dataType: "json",
		success: function(json){  
		   //ITERATING THROUGH EACH ENTRY
		   for ( var i = 0; i < json.feed.entry.length; i++){
				//PARSING THROUGH JSON 	   
				var entry = json.feed.entry[i];

		    //PARSING CONTENT DATA TO ISOLATE MOOD & TEXT  
		    var mood = entry.content.$t.substring(34, 36)
		    var text = entry.content.$t.split(", tellmewhatyoudid.: ")[1]

	    	//PUSHING HASH INTO DATA ARRAY
	    	data.push({
	    		date: entry.title.$t,
	    		mood: mood,
	    		text: text
	    	})
	    }
	    
	    console.log(data)
	    //dom goodies go here

	  }
  }); //END AJAX


})
