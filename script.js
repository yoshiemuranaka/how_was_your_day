$(document).ready(function(){

	var data = []
	//CALLING GOOGLE SHEETS	
	$.ajax({ 
		url: 'http://spreadsheets.google.com/feeds/list/1pX221_XvKav8sTbd4mfcgU3CfsxNqbTXboHPXjP49Uw/1/public/basic?alt=json',
		type: 'get',
		dataType: "json",
		success: function(json){  
		   //ITERATING THROUGH EACH ENTRY
		   for ( var i = 0; i < json.feed.entry.length; i++){
				//PARSING THROUGH JSON 	   
				var entry = json.feed.entry[i];

			    //PARSING CONTENT DATA TO ISOLATE MOOD & TEXT  
			    var mood = entry.content.$t.substring(34, 36)
			    // var text = entry.content.$t.split(", tellmewhatyoudid.: ")[1]

		    	//PUSHING HASH INTO DATA ARRAY
		    	data.push({
		    		date: entry.title.$t,
		    		mood: mood,
		    		// text: text
		    	})
	    	}

    	   	//RAPHAEL GOODIES
    		//CREATING RAPHAEL OBJECT & LOGIC FOR CUSTOM SEGMENT CREATING PATH ELEMENTS FOR PIE SLICE
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

            //PARSING THROUGH DATA
            var  elated = {
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

             var down = {
                "mood": ":*(",
                "color": "31284c",
                "value": 0,
                "content": [] 
            }

            //FOR EACH ENTRY, PUT DATA INTO DESIGNATED MOOD HASH AND +=1 VALUE FOR EACH CORRESPONDING ENTRY
            for (var i = 0, ii = data.length; i < ii; i++){
            	if (data[i].mood == ":D"){
            		elated.value += 1
            		elated.content.push(data[i])
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
                	down.value += 1
                	down.content.push(data[i])
                }
            }

            var newDataSet = []
            	newDataSet.push(elated)
                newDataSet.push(happy)
                newDataSet.push(indifferent)
                newDataSet.push(sad)
                newDataSet.push(down)

            //KEY
            var key = Raphael("key");
            var colorCode = key.set()
            colorCode.attr({stroke: "#bfbfbf"})
            for (var i = 0, ii = newDataSet.length; i < ii; i++){
                var percent = newDataSet.indexOf(newDataSet[i])+1 / newDataSet.length
                colorCode.push(key.rect(80 * percent, 350, 15, 15, 1).attr({fill: "#" + newDataSet[i].color}))
                colorCode.push(key.text(80 * percent, 380, newDataSet[i].mood).attr({ fill: "#808080", stroke: "none", "font-size": 15 }))
            }

            //CIRCLE BORDER
            var paths = r.set(),
                total,
                start, 
                bg = r.circle(200, 200, 0).attr({stroke: "#bfbfbf", "stroke-width": 2});

            //ITERATING THROUGH DATA INTO PATH SEGMENTS ON RAPHAEL OBJECT -- 1 RADIUS SO PIE SLICE IS NOT VISIBLE UNTIL ANIMATE FUNCTION CALLED
            total = 0;
            for (var i = 0, ii = newDataSet.length; i < ii; i++) {
                total += newDataSet[i].value;
            }
            start = 0;
            for (i = 0; i < ii; i++) {
                var val = 360 / total * newDataSet[i].value;
                (function (i, val) {
                    paths.push(r.path().attr({segment: [200, 200, 1, start, start + val, newDataSet[i].color], stroke: "#808080"}).hover(function(){
                            //do some hover stuff
                            console.log('hey there')
                    		console.log($(this)[0][0].attributes.fill)
                    	})
                    );
                })(i, val);
                start += val;
            }
            
            bg.animate({r: 151}, 1000, "bounce");
            animate(1000);

            //ADDITIONAL TEXT
            var today = new Date(); 

            var t = r.text(200, 20, today).attr({font: '100 20px "Helvetica Neue", Helvetica, "Arial Unicode MS", Arial, sans-serif', fill: "#808080"});

            var memberSince = data[0].date.split(" ")[0]
            var copy = $('#copy').text('Member since ' + memberSince)
    		
		}//END SUCCESS
 	});//END AJAX
	
})//END DOCUMENT.READY
