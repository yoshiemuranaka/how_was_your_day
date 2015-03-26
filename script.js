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

	   	//RAPHAEL GOODIES
		//CREATING RAPHAEL OBJECT & LOGIC FOR CUSTOM SEGMENT CREATING PATH FOR PIE SLICE
        var r = Raphael("holder");

        r.customAttributes.segment = function (x, y, r, a1, a2, color) {
            var flag = (a2 - a1) > 180,
            a1 = (a1 % 360) * Math.PI / 180;
            a2 = (a2 % 360) * Math.PI / 180;
            return {
                path: [["M", x, y], ["l", r * Math.cos(a1), r * Math.sin(a1)], ["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)], ["z"]],
                fill: "#" + color
            };
        };
        //ANIMATING/EXTENDING THE RADIUS TO MAKE CONSUMED VALUES VILISBLE
        function animate(ms) {
            var start = 0,
                val;
            for (i = 0; i < ii; i++) {
                val = 360 / total * newDataSet[i].value;
                paths[i].animate({segment: [200, 200, 150, start, start += val, newDataSet[i].color ]}, ms, "bounce");
            }
        }

        console.log(data)

        //PARSING THROUGH DATA
            var  laugh = {
                "mood": ":D",
                "color": "df60b6",
                "value": 0,
                "content": [] 
            }
            var happy = {
                "mood": ":)",
                "color": "f9b233",
                "value": 0,
                "content": [] 
            }

            var indifferent = {
                "mood": ":|",
                "color": "cbbeb5",
                "value": 0,
                "content": [] 
            }

            var sad = {
                "mood": ":(",
                "color": "b2d8d",
                "value": 0,
                "content": [] 
            }

             var cry = {
                "mood": ":*(",
                "color": "31284c",
                "value": 0,
                "content": [] 
            }

        //FOR EACH ENTRY, PUT DATA INTO DESIGNATED MOOD HASH AND +=1 VALUE FOR EACH CORRESPONDING ENTRY
        for (var i = 0, ii = data.length; i < ii; i++){
        	if (data[i].mood == ":D"){
        		laugh.value += 1
        		laugh.content.push(data[i])
        	}else if (data[i].mood == ":)"){
                happy.value += 1
                happy.content.push(data[i])
            }else if (data[i].mood == ":|"){
                indifferent.value += 1
                indifferent.content.push(data[i])
            }else if (data[i].mood == ":("){
                sad.value += 1
                sad.content.push(data[i])
            }else{
            	cry.value += 1
            	cry.content.push(data[i])
            }
        }

        var newDataSet = []
        	newDataSet.push(laugh)
            newDataSet.push(happy)
            newDataSet.push(indifferent)
            newDataSet.push(sad)
            newDataSet.push(cry)

        var paths = r.set(),
            total,
            start;

        //ITERATING THROUGH DATA INTO PATH SEGMENTS ON RAPHAEL OBJECT -- 1 RADIUS SO PIE SLICE IS NOT VISIBLE UNTIL ANIMATE FUNCTION CALLED
        total = 0;
        for (var i = 0, ii = newDataSet.length; i < ii; i++) {
            total += newDataSet[i].value;
        }
        start = 0;
        for (i = 0; i < ii; i++) {
            var val = 360 / total * newDataSet[i].value;
            (function (i, val) {
                paths.push(r.path().attr({segment: [200, 200, 1, start, start + val, newDataSet[i].color], stroke: "#fff"}));
            })(i, val);
            start += val;
        }
        animate(1000);


		}
 	}); //END AJAX
})//END DOCUMENT.READY
