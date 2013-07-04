		
	var timeIndex 	= 0;
	var timeStepsArray;	
	var sq_width	= 20;
	var colour		= [];
	colour["NA"] 	= {r: 0, 	g: 0, 		b: 0};
	colour["0"] 	= {r: 255, 	g: 255, 	b: 0};
	colour["1"] 	= {r: 255, 	g: 255, 	b: 0};
	colour["2"] 	= {r: 200, 	g: 200, 	b: 100};
	colour["3"] 	= {r: 200, 	g: 200,		b: 100};
	colour["4"] 	= {r: 0, 	g: 0, 		b: 0};
	colour["5"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["6"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["7"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["8"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["9"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["10"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["11"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["12"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["13"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["14"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["15"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["16"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["17"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["18"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["19"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["20"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["21"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["22"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["23"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["24"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["25"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["26"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["27"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["28"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["29"] 	= {r: 200, 	g: 200, 	b: 200};
	colour["30"] 	= {r: 60, 	g: 60, 		b: 60};
	
    function capabilitiesData(data)
	{
		var items = [];
		
		frameworkDisplay();
		
		timeStepsArray 	= data["Resource"]["TimeSteps"];
		if(!timeStepsArray) 
		{
			alert("No Time Steps returned.")
			return;
		}
		
		items.push('<li>' + timeStepsArray + " :" + timeStepsArray["TS"][timeIndex] + " :" + timeIndex);
		
		getWeatherAtTime(timeIndex); 
	};
	
    function frameworkDisplay()
	{
		$('<div id="backNext"></div>').appendTo('body');
		$('<div id="displayTime"></div>').appendTo('body');
		$('<div id="displayDate"></div>').appendTo('body');
		
		$('<button><</button>').click(function () 
			{ 
				timeIndex --;
				if(timeIndex < 0) timeIndex = 0;
				getWeatherAtTime(timeIndex);
			}).appendTo('#backNext');
			
		$('<button>></button>').click(function () 
			{ 
				timeIndex ++;
				getWeatherAtTime(timeIndex);
			}).appendTo('#backNext');
	};
	
    function getWeatherAtTime(tI)
	{
		$("body").css('cursor','progress');
		var time 		= timeStepsArray["TS"][tI];
		time 			= time.substring(0,13) + "Z";
		
		var displayDate	= time.substring(0,10);
		var displayTime	= time.substring(11,13) + ":00";
		
		displayDate		= $.format.date(displayDate, "dd/MM/yyyy");
		
		if(!time) 
		{
			$('#displayTime').text("Time not returned.");
			return;
		}
		$('#displayTime').text(displayTime);
		$('#displayDate').text(displayDate);
		
		var script = document.createElement("script");
		script.setAttribute('type', "text/javascript");
		script.setAttribute('src', "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/all?res=3hourly&time=" + time + "&key=309f690c-af9b-441f-9248-5c8768602995&callback=plotData");
		$(script).appendTo('body');
		
	};
	
    function plotData(data)
	{
		$("body").css('cursor','wait');
		var locations	= data["SiteRep"]["DV"]["Location"];
		
		var c			= document.getElementById("weatherCanvas");
		var ctx			= c.getContext("2d");
		ctx.clearRect(0, 0, c.width, c.height);
		
		var locsInSquares		= [];
		for(var i = 0; i < (c.width / sq_width); i++)
		{
			locsInSquares.push([]);
			for(var j = 0; j < (c.height / sq_width); j++)
			{
				locsInSquares[i].push([]);
			};
		};
		
		$.each(locations, function(index, val) 
		{
			var loc_x		= formatLon(val["lon"]);
			var loc_y		= formatLat(val["lat"]);
			var Pp			= val["Period"]["Rep"]["Pp"];
			var type		= val["Period"]["Rep"]["W"];
			var temp		= val["Period"]["Rep"]["F"];
			var windspeed	= val["Period"]["Rep"]["S"];
			var direction	= val["Period"]["Rep"]["D"];
			var colour		= weatherColour(Pp, type, temp);
			//ctx.fillStyle	= colour;
			//ctx.fillRect(loc_x, loc_y, 2, 2);
			
			var x_sq		= Math.floor(loc_x / sq_width);
			var y_sq		= Math.floor(loc_y / sq_width);
			var loc_obj		= {x: loc_x, y: loc_y, colour: colour};
			locsInSquares[x_sq][y_sq].push(loc_obj);
		});
		
		for(var i = 0; i < c.width; i++)
		{
			for(var j = 0; j < c.height; j++)
			{
				var px			= {x: i, y: j};
				var px_col 		= determinePixelColour(px, locsInSquares);
				ctx.fillStyle	= px_col;
				ctx.fillRect(i, j, 1, 1);
			};
		};
		
		$("body").css('cursor','default');		
	};

    function formatLat(l)
	{
		l 		= lat2y(l);
		var ret	= ((l - 49) * -50) + 1200;
		if(ret < 0)
		{
			//alert(ret);
			ret = 0;
		};
		return ret;
	};
	
	function lat2y(a) 
	{ 
		return 180/Math.PI * Math.log(Math.tan(Math.PI/4+a*(Math.PI/180)/2)); 
	}
	
    function formatLon(l)
	{
		var ret	= (parseFloat(l) + 9) * 50;
		//alert(ret)
		return ret;
	};

    function weatherColour(Pp, type, temp)
	{
		if(typeof Pp === "undefined")	
		{ 
			Pp = 0; 
		};
		var c			= colour[type]
		var notB		= c.r - parseInt(parseInt(Pp) * 2.00);
		if(notB < 0) 	notB	= 0;
		if(notB > 255) 	notB	= 255;
		var colour_obj	= {r: notB, 	g: notB, 	b: c.b};
		return colour_obj;
	};
	
    function determinePixelColour(px, locsInSquares)
	{
		var px_square_x		= Math.floor(px.x / sq_width);
		var px_square_y		= Math.floor(px.y / sq_width);
		
		var nearbyLocs		= [];
		for(var i = -1; i < 2; i++)
		{
			var nearby_x	= px_square_x + i;
			if((nearby_x >= 0) && (nearby_x < locsInSquares.length))
			{
				for(var j = -1; j < 2; j++)
				{
					var nearby_y	= px_square_y + j;
					if((nearby_y >= 0) && (nearby_y < locsInSquares[nearby_x].length))
					{
						var sq	= locsInSquares[nearby_x][nearby_y];
						$.each(sq, function(index, val) 
						{
							nearbyLocs.push(sq[index]);
							var dist	= getDistance(px, sq[index]);
							nearbyLocs[nearbyLocs.length - 1].distance = dist;
						});
					};
				};
			};
		};
		if(nearbyLocs.length > 6) 
		{
			nearbyLocs = nearbyLocs.sort(sortDistance)
			function sortDistance(a,b){
				if (a.distance < b.distance)
					return -1;
				if (a.distance > b.distance)
					return 1;
				return 0;
			};
			nearbyLocs = nearbyLocs.slice(0, 6);
			//alert(nearbyLocs[0].distance + " : " + nearbyLocs[1].distance + " : " + nearbyLocs[2].distance + " : " + nearbyLocs[3].distance);
		};
		var ret	= averageColours(px, nearbyLocs);
		return ret;
	};
	
    function averageColours(px, nearbyLocs)
	{
		var col			= "#ffffff";
		if(typeof nearbyLocs === "undefined")	
		{ 
			alert("undefined");
			return col;
		};
		if(!nearbyLocs.length) 
		{
			return col;
		}
		var totR		= 0;
		var totG		= 0;
		var totB		= 0;
		var totDist		= 0;
		$.each(nearbyLocs, function(index, val) 
		{
			var c			= nearbyLocs[index].colour;
			if(getDistance(px, nearbyLocs[index]) == 0)
			{
				col				= hexColour(nearbyLocs[index].colour);
				return col;
			};
			var dist		= (1 / getDistance(px, nearbyLocs[index]));
			totR			+= (c.r * dist);
			totG			+= (c.g * dist);
			totB			+= (c.b * dist);
			totDist			+= dist;
		});
		var avR			= parseInt(totR / totDist);
		var avG			= parseInt(totG / totDist);
		var avB			= parseInt(totB / totDist);
		var avColour	= {r: avR, g: avG, b: avB};
		col				= hexColour(avColour);
		//alert(col + ": " + avColour + " : " + totR + " : " + totG + " : " + totB + " : " + avR + " : " + avG + " : " + avB + " : " + nearbyLocs.length);
		return col;
	};
	
    function getDistance(a, b)
	{
		var x_dist 	= a.x - b.x;
		var y_dist 	= a.y - b.y;
		var x_sqd	= Math.pow(x_dist, 2);
		var y_sqd	= Math.pow(y_dist, 2);
		var dist	= Math.sqrt(x_sqd + y_sqd);
		return dist;
	};
	
    function hexColour(colour)
	{
		var hexR 		= formatHex(colour.r);
		var hexG 		= formatHex(colour.g);
		var hexB 		= formatHex(colour.b);
	
		var col			= "#" + hexR + hexG + hexB;
		//alert(ret + ": " + colour.r + " : " + colour.g + " : " + colour.b);
		return col;
	};
	
    function formatHex(num)
	{
		num 				= parseInt(num);
		if(num > 255) { num = 255 	};
		if(num < 0  ) { num = 0 	};
		var hexString 		= num.toString(16);
		
		if(hexString.length == 1) 
		{
			hexString = "F" + hexString;
		};
		return hexString;
	};

/*	
    function weatherColour(Pp)
	{
		if(typeof Pp === "undefined")	
		{ 
			Pp = 0; 
		};
		var hexString 	= 200 - parseInt(parseInt(Pp) * 2.00);
		hexString 		= hexString.toString(16);
		if(hexString > 255) { hexString = 255 	};
		if(hexString < 0  )	{ hexString = 0 	};
		
		if(hexString.length == 1) 
		{
			hexString = "F" + hexString;
		};
	
		var ret			= "#" + hexString + hexString + "c8";
		return ret;
	};
*/
	
	
	
	
	
	
	
	
	
	
	
	
