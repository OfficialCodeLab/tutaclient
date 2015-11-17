//Type your code here

var model = {};

var locationData = [{lat:"-26.076", lon:"28.0008",name: "Plumber 1", desc: "Person 1", image: "plumber.png"},
                    {lat:"-26.065", lon:"28.0026",name: "Plumber 2", desc: "Person 1", image: "plumber.png"},
                    {lat:"-26.055", lon:"28.0006",name: "Plumber 3", desc: "Person 1", image: "plumber.png"}];

var driverData = [];

function init(callback) {
  
  	frmSplash.rtDebug.text = "<span>Initializing Services...</span>";

  	// create new service model
  	model = new ustuck.services();

  	// temporary variables
  	model.user = {};
	model.user.location = {};
  
  	// initialise model and specify init success function
  	model.init(getCurrentPosition(callback));
  	frmSplash.rtDebug.text = "<span>Retrieving Geocode...</span>";
}

var mylocationData = {};
/**
* Retrieves the current position of the app user
**/
function getCurrentPosition(callback) {
  	frmSplash.rtDebug.text = "<span>Retrieving position...</span>";

	kony.location.getCurrentPosition(
    	function success(position) {
          
          var nologinrequired = true;
          if(kony.store.getItem("user") != null) {
            model.user = JSON.parse(kony.store.getItem("user"));
            nologinrequired = true;
          }
          //frmsplash action initapp ->frm map show
          
          model.user.location = { lat: position.coords.latitude , long: position.coords.longitude, time: position.timestamp };
		  
          geoCode(position.coords.latitude,position.coords.longitude,callback);
        },
      
      	function error(error) {
          if(error.code == 105) {
            // location services have been disabled	
            showLocationError();
          }
        },
      
      	{ timeout: 15000 }
    );  
}

function showLocationError() {
  /*
	frmSplash["flexLocationError"].animate(
  		kony.ui.createAnimation({"100":{"left":"0dp","stepConfig":{"timingFunction":kony.anim.EASE}}}),
  		{"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":0.5},
   		{"animationEnd" : function(){}});*/
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRadians) === "undefined") {
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  };
}

if (typeof(Number.prototype.toDegrees) === "undefined") {
  Number.prototype.toDegrees = function() {
    return this * 180 / Math.PI;
  };
}

Number.prototype.toRad = function() {
   return this * Math.PI / 180;
};

Number.prototype.toDec = function() {
   return this * 180 / Math.PI;
};

function distance(lat1,lon1,lat2,lon2) {
  var R = 6371000; // metres
  var o1 = lat1.toRadians();
  var o2 = lat2.toRadians();
  var dO = (lat2-lat1).toRadians();
  var dA = (lon2-lon1).toRadians();

  var a = Math.sin(dO/2) * Math.sin(dO/2) +
          Math.cos(o1) * Math.cos(o2) *
          Math.sin(dA/2) * Math.sin(dA/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

function bearing(lat1,lng1,lat2,lng2) {
  		lat1 = lat1 * 1.0;
  		lat2 = lat2 * 1.0;	
        var dLon = (lng2-lng1);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
        var brng = Math.atan2(y, x).toDegrees();
  		if(brng < 0) {return 360 + brng; } else {
        return 360 - ((brng + 360) % 360);}
}


function findAddress(address, callback) {
  var url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + address.replace(/\s+/g,"+").replace(/`+/g,"");

  var request = new kony.net.HttpRequest();
  
  request.timeout = 30000;
  
  request.onReadyStateChange = function() {
  	if(request.readyState == constants.HTTP_READY_STATE_DONE) {
      var response = request.response;
      //ssa.mobile.alert("RESPONSE", response1);
  	  //ssa.mobile.alert("test", JSON.stringify(response));
      if(response == null) {
        //callback(request1.getAllResponseHeaders());
        ssa.mobile.alert("HTTP ERROR!",JSON.stringify(request.getAllResponseHeaders()));
      } else {
        if(response != null) {
          if(response.results != null) {
              callback(response);
          }
        }
      }
    }
  }

  request.open(constants.HTTP_METHOD_GET, url, true, null, null);
  request.send();
}

function geoCode(lat,lng,callback) {
  //frmSplash.rtDebug.text = "<span>" + lat +"<br>"+ lng +"</span>";
  var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng;
  var request = new kony.net.HttpRequest();
  //ssa.mobile.alert("DEBUG",url);
  
  request.timeout = 10000;
  
  request.onReadyStateChange = function() {   
  	if(request.readyState == constants.HTTP_READY_STATE_DONE) {
      if(geocodeRecieved === false) {
        frmSplash.rtDebug.text = "<span>Loading Complete.</span>";
        frmSplash.flexLoading.isVisible = false;
        animateSplash();
        kony.timer.cancel("init");
        geocodeRecieved = true;
    }
      var response = request.response;
      if(response == null) {	
        //ssa.mobile.alert("HTTP ERROR!",JSON.stringify(request.getAllResponseHeaders()));
      } else {
        if(response != null) {
          if(response.results != null) {
              callback(response);
          }
        }
      }
    }
  }
  
  request.open(constants.HTTP_METHOD_GET, url, true, null, null);
  request.send();  
}

function geoCodeNew(lat,lng,callback) {
  var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng;
  var request = new kony.net.HttpRequest();

  request.timeout = 10000;
  
  request.onReadyStateChange = function() {
  	if(request.readyState == constants.HTTP_READY_STATE_DONE) {
      var response = request.response;
      if(response === null) {
        ssa.util.alert("HTTP ERROR!",JSON.stringify(request.getAllResponseHeaders()));
      } else {
        if(response !== null) {
          if(response.results !== null) {
              callback(response);
          }
        }
      }
    }
  };
  
  request.open(constants.HTTP_METHOD_GET, url, true, null, null);
  request.send();  
}

function setZoomLevelFromBounds(bounds) {
  	var GLOBE_WIDTH = 256; // a constant in Google's map projection
	var west = bounds.southwest.lng;
	var east = bounds.northeast.lng;
    var angle = east - west;
    if (angle < 0) {
      angle += 360;
    }

    return Math.floor(Math.log(kony.os.deviceInfo().screenWidth * 360 / angle / GLOBE_WIDTH) / Math.LN2);
}

function decodePoly(encoded) {

  	//ssa.mobile.alert(encoded);
  
    var poly = [];
    var index = 0;
    var len = encoded.length;
    var lat = 0;
    var lng = 0;

    while (index < len) {
        var b = 0;
        var shift = 0;
        var result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
          	//if(index < 10 ) ssa.mobile.alert(b);
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        var p = {
            "lat": lat / 100000.0,
            "lon": lng / 100000.0
        };
        poly.push(p);
    }

    return poly;
}

function decodeRoute(routes, count) {
  	var path = [];
  	
    for(var i =0; i < routes[count].legs.length; i++) {
    leg = routes[count].legs[i];
    for(var j =0; j < leg.steps.length; j ++) {
      var step = leg.steps[j];
      path = path.concat(decodePoly(step.polyline.points));
    	}
  	}
  	return path;
}

function renderDirections(object, directions, color, startpin, endpin) {
  //ssa.mobile.alert("RENDER", directions);
  
  var routes = directions.routes;
  var waypoints = directions.geocoded_waypoints;
  var mainRoute = routes[0];
  var bounds = mainRoute.bounds;
  var leg = mainRoute.legs[0];
  var overView = mainRoute.overview_polyline;
  var routePoints = decodeRoute(routes,0);

  var maplines = {
        id: "polyid1",
        startLocation:{lat: leg.start_location.lat, lon: leg.start_location.lng, name:"Pickup Location",desc:leg.start_address,image:startpin,meta:{color:"green",label:"C"}
                      },
        endLocation:{lat:  leg.end_location.lat, lon: leg.end_location.lng, name:"Destination", desc: leg.end_address,image:endpin,meta:{color:"red",label:"A"}
                      },
        locations: routePoints,
        polylineConfig:{lineColor:color, lineWidth:"4"}
            };
  //ssa.mobile.alert("RENDER", maplines);
  if(object.locationData.length > 0) object.clear();
  object.addPolyline(maplines);
  
  var newZoom = setZoomLevelFromBounds(bounds);
  var lat = (bounds.southwest.lat + bounds.northeast.lat)/2;
  var lng = (bounds.southwest.lng + bounds.northeast.lng)/2;
  
  object.navigateToLocation({ "lat" : lat, "lon": lng, name:"", desc: ""},false,false);
  //ssa.mobile.alert("ZOOM", "OLD = " + object.zoomLevel + " NEW = " + newZoom);
  //object.zoomLevel = newZoom-1;
}

//formatted_address.replace(/\s+/g,"+")

function getDirections(origin,destination,waypoints,callback) {
  var url = "http://maps.googleapis.com/maps/api/directions/json?origin=" + 
     origin.formatted_address.replace(/\s+/g,"+").replace(/`+/g,"") + "&destination=" + destination.formatted_address.replace(/\s+/g,"+").replace(/`+/g,"");
   //var url = "https://maps.googleapis.com/maps/api/directions/json?origin=Chicago,IL&destination=Los+Angeles,CA";
 // ssa.mobile.alert("URL", url);
  
  var request = new kony.net.HttpRequest();
  //ssa.mobile.alert("DEBUG",url);
  
  request.timeout = 10000;
  //ssa.mobile.alert("TEST", constants.HTTP_READY_STATE_DONE + "");
  
  request.onReadyStateChange = function() {
     //ssa.mobile.alert("TEST", JSON.stringify(request));
    if(request.readyState == constants.HTTP_READY_STATE_DONE) {
      var response = request.response;
      
      if(response.routes != null) {
        //ssa.mobile.alert("TEST", "TESTING");
        callback(response);
      }       
    }
  }
  
  request.open(constants.HTTP_METHOD_GET, url, true, null, null);
  request.send();  
}

function taxiRate(x){  
  switch (x){
    case x >=50:
      return 197,2+(x-50)*3,8;
      
    case x >=35:
      return 116+(x-20)*4,7;
      
    case x >=20:
      return 94,5+(x-15)*5,8;
      
    default:
      return x*6,3;
  }  
}

function randomPoints(count, lat, lon, radius) {
	var points = [];
  	var params = [];
  	var radiusInDegrees = radius / 111300.0;
  
  	for(var c = 0; c < count; c++) {
    	var u = ssa.util.random(0,1,false);
      	var v = ssa.util.random(0,1,false);
      	var w = radiusInDegrees * Math.sqrt(u);
    	var t = 2 * Math.PI * v;
    	var x = w * Math.cos(t);
    	var y = w * Math.sin(t);
      	
      
      	var new_x = x / Math.cos(lat);
		
      	params.push({ cp: c, up: u, vp: v, wp: w, tp: t, xp: x, yp: y});
      
        var newlon = new_x + lon;
    	var newlat = y + lat;

      	points.push( { lat : newlat, lon: newlon});
    }
  
  	return points;
};