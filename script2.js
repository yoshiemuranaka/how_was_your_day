$(document).ready(function(){

	var chart = {
		
		config: {
			el: 'chart',
			width: '400px',
			height: '400px',
		},

		init: function(){//CREATING RAPHAEL CANVAS AND LOGIC FOR PIE CHART; SETTING CANVAS AND PATHS OBJECT IN CONFIG
			
			var c = chart.config			
			var canvas = Raphael(c.el, c.width, c.height)
			var paths = canvas.set()
		  canvas.customAttributes.segment = function (x, y, r, a1, a2, color) {
        var flag = (a2 - a1) > 180,
        a1 = (a1 % 360) * Math.PI / 180;
        a2 = (a2 % 360) * Math.PI / 180;
        return {
            path: [["M", x, y], ["l", r * Math.cos(a1), r * Math.sin(a1)], ["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)], ["z"]],
            fill: "#" + color
        };
	    };

	    chart.config["canvas"] = canvas
	    chart.config["paths"] = paths
	    chart.getData()
		
		},

		getData: function(){

			var data = []
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
        	chart.filterData(data)
        }
      })

		},

		filterData: function(data){

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

      chart.config["data"] = newDataSet
      
      chart.createChart()
		},

		createChart: function(){
			var data = chart.config.data
			var paths = chart.config.paths
			var canvas = chart.config.canvas
			var total = 0;
      for (var i = 0, ii = data.length; i < ii; i++) {
          total += data[i].value;
      }
      var start = 0;
      for (i = 0; i < ii; i++) {
          var val = 360 / total * data[i].value;
          (function (i, val) {
              paths.push(canvas.path().attr({segment: [200, 200, 1, start, start + val, data[i].color], stroke: "#808080"})
                      .mouseover(function(){
                          chart.hoverState(paths[i])
                      })
                      // .mouseout(function(){
                      //     doSomething(paths[i])
                      // })
              );
          })(i, val);
          start += val;
      }
      
      chart.config["paths"] = paths
      chart.config["canvas"] = canvas
      chart.animateChart(1000, total, val)

		},

		animateChart: function(ms, total, val){
			var data = chart.config.data;
			var paths = chart.config.paths;
			var start = 0;
			var ii = data.length;

      for (i = 0; i < ii; i++) {
          val = 360 / total * data[i].value;
          paths[i].animate({segment: [200, 200, 150, start, start += val, data[i].color ]}, ms, "bounce");
      }

		},

		hoverState: function(object){
			console.log('hovering')
			//do something when hovering
		}

	}

	chart.init()

})