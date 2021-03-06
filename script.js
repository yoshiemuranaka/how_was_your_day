$(document).ready(function(){

    var data = []
    //CALLING GOOGLE SHEETS 
    $.ajax({ 
        url: 'http://spreadsheets.google.com/feeds/list/1pX221_XvKav8sTbd4mfcgU3CfsxNqbTXboHPXjP49Uw/1/public/basic?alt=json',
        type: 'get',
        dataType: "json",
        success: function(json){  
           
           //ITERATING THROUGH EACH ENTRY FROM GOOGLE SHEETS AND PUSHING INTO DATA ARRAY
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

        //RAPHAEL GOODIES ======================================================================
        //CONFIG
            //DECLARING VARIABLES
            var r = Raphael("holder");
            var newDataSet = filter(data);
            var paths = r.set()

            //CREATING RAPHAEL CANVAS AND & LOGIC TO DEFINE CUSTOM SEGMENT CREATING PATH ELEMENT FOR PIE SLICE
            r.customAttributes.segment = function (x, y, r, a1, a2, color) {
                var flag = (a2 - a1) > 180,
                a1 = (a1 % 360) * Math.PI / 180;
                a2 = (a2 % 360) * Math.PI / 180;
                return {
                    path: [["M", x, y], ["l", r * Math.cos(a1), r * Math.sin(a1)], ["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)], ["z"]],
                    fill: "#" + color
                };
            };

            //ITERATING THROUGH NEW DATA SET INTO RAPHAEL PATHES -- 1 RADIUS SO PIE SLICE IS NOT VISIBLE UNTIL ANIMATE FUNCTION CALLED
            var total = 0;
            for (var i = 0, ii = newDataSet.length; i < ii; i++) {
                total += newDataSet[i].value;
            }
            var start = 0;
            for (i = 0; i < ii; i++) {
                var val = 360 / total * newDataSet[i].value;
                (function (i, val) {
                    paths.push(r.path().attr({segment: [200, 200, 1, start, start + val, newDataSet[i].color], stroke: "#808080"})
                            .mouseover(function(){
                                expand(paths[i])
                            })
                            // .mouseout(function(){
                            //     doSomething(paths[i])
                            // })
                    );
                })(i, val);
                start += val;
            }
          

        //FUNCTIONS
            //EXTENDING THE RADIUS TO MAKE CONSUMED RAPHAEL PATH VALUES VILISBLE
            function animate(ms) {
                var start = 0,
                    val;
                for (i = 0; i < ii; i++) {
                    val = 360 / total * newDataSet[i].value;
                    paths[i].animate({segment: [200, 200, 150, start, start += val, newDataSet[i].color ]}, ms, "bounce");
                }
            }


            
            //DO SOMETHING WHEN HOVERING OVER THE PIE SLICE
            function expand(object) {
                console.log(newDataSet[object.id])
                var moodData = newDataSet[object.id]
                var mood = moodData.mood
                var value= moodData.value
                headerKey.text(200, 20, mood + " "+ value).attr({ 
                font: '100 20px "Helvetica Neue", Helvetica, Arial, sans-serif', 
                fill: "#808080",
                "font-size": 25,
                "font-weight": "bold",
                // "stroke": "#808080"
            });
                object.mouseout(function(){
                    headerKey.clear()
                })
            }

            // function doSomething(object){
            //     console.log("do something")
            // }

            //FILTERING THROUGH DATA ARRAY AND RETURNING NEW DATA SET TO BE USED FOR RAPHAEL OBJECTS
            function filter(data, start, end){
                
                //DECLARING HASH OBJECTS WITH DESIGNATED COLOR VALUE
                var newDataSet = []
                var  elated = {
                    "mood": ":D",
                    "color": "ff7373",
                    "value": 0,
                    "content": [] 
                }
                var happy = {
                    "mood": ":)",
                    "color": "fff6f7",
                    "value": 0,
                    "content": [] 
                }

                var indifferent = {
                    "mood": ":|",
                    "color": "dde6e8",
                    "value": 0,
                    "content": [] 
                }

                var sad = {
                    "mood": ":(",
                    "color": "b9cfd2",
                    "value": 0,
                    "content": [] 
                }

                 var down = {
                    "mood": ":*(",
                    "color": "0d5875",
                    "value": 0,
                    "content": [] 
                }

                //ITERATING THROUGH DATA AND PUSHING INTO APPROPRIATE HASH OBJECT
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

                //PUSHING ALL MOOD HASH OBJECTS INTO NEWDATASET ARRAY
                newDataSet.push(elated);
                newDataSet.push(happy);
                newDataSet.push(indifferent);
                newDataSet.push(sad);
                newDataSet.push(down);
                return newDataSet;
            }

            animate(1000)


        //KEY
            var key = Raphael("key");
            var colorCode = key.set()
            colorCode.attr({stroke: "#bfbfbf"})
            for (var i = 0, ii = newDataSet.length; i < ii; i++){
                var percent = newDataSet.indexOf(newDataSet[i])+1 / newDataSet.length
                colorCode.push(key.rect( 20, 80 * percent, 15, 15, 1).attr({fill: "#" + newDataSet[i].color}))
                colorCode.push(key.text( 55, 80 * percent + 6, newDataSet[i].mood).attr({ fill: "#808080", stroke: "none", "font-size": 15 }))
            }

        //CIRCLE BORDER
            var bg = r.circle(200, 200, 0).attr({stroke: "#bfbfbf", "stroke-width": 2});
            bg.animate({r: 151}, 1000, "bounce");

        //ADDITIONAL TEXT
            var header = Raphael("header")
            var headerKey = Raphael("headerKey")
            var today = new Date(); 

            header.text(200, 20, today).attr({
                font: '100 20px "Helvetica Neue", Helvetica, "Arial Unicode MS", Arial, sans-serif', 
                fill: "#808080"
            });

            header.text(200, 50, "Total Entries: " + data.length).attr({ 
                font: '100 20px "Helvetica Neue", Helvetica, Arial, sans-serif', 
                fill: "#808080"
            });

            var memberSince = data[0].date.split(" ")[0]
            $('#memberSince').text('Member since ' + memberSince)
            
        }//END SUCCESS
    });//END AJAX
    
})//END DOCUMENT.READY