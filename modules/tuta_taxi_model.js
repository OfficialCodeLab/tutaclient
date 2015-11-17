/**
 * TUTA Mobile namespace
 * @namespace tuta.mobile
 */
if (typeof(tuta) === "undefined") {
	tuta = {};
}

tuta.taxi = function(position) {
  	tuta.taxi.position = position;
};

tuta.taxi.prototype.generate = function(noAgents, noTasks) {
	tuta.taxi.tasks = tuta.location.randomPoints(noTasks,
    	tuta.taxi.position.coords.latitude,
      	tuta.taxi.position.coords.longitude,
      	8000,"pinb.png"
    );
  
  	//tuta.util.alert("TASKS", tuta.taxi.tasks );
  
  	tuta.taxi.agents = tuta.location.randomPoints( noAgents,
    	tuta.taxi.position.coords.latitude,
      	tuta.taxi.position.coords.longitude,
      	5000, "option3.png"
    );	
};

tuta.taxi.prototype.assignmentMatrix = function(){
  // create an assignment matrix
  var matrix = []; // each row represents an agent / each element in sub array customer

  for(var a = 0; a < tuta.taxi.assignment.length; a++) {
    var costs = [];
    var id = tuta.taxi.assignment[a].agent;
    var agent = tuta.taxi.agents[id];
    for(var t = 0; t < tuta.taxi.tasks.length; t++) {
      var task = tuta.taxi.tasks[t];
      costs.push(tuta.location.distance(agent.lat,agent.lon,task.lat,task.lon));
    }
    matrix.push( costs );
  }
  
  var m = new Munkres();
  var indices = m.compute(matrix);
  
  for(var i = 0; i < indices.length; i ++) {
    tuta.taxi.assignment[i].task = indices[i][1];
  }

  return matrix;
};

tuta.taxi.prototype.assignmentMatrixFromH = function(){
  // create an assignment matrix
  var matrix = []; // each row represents an agent / each element in sub array customer

  for(var a = 0; a < tuta.taxi.agents.length; a++) {
    var costs = [];
    var agent = tuta.taxi.agents[a];
    for(var t = 0; t < tuta.taxi.tasks.length; t++) {
      var task = tuta.taxi.tasks[t];
      costs.push(tuta.location.distance(agent.lat,agent.lon,task.lat,task.lon));
    }
    
    for(var k = tuta.taxi.tasks.length; k < tuta.taxi.agents.length; k++) {
      costs.push(0);
    }
    matrix.push( costs );
  }
  
  var m = new Munkres();
  var indices = m.compute(matrix);
  
  tuta.taxi.assignment = [];
  
  for(var i = 0; i < indices.length; i ++) {
    if(indices[i][1] < tuta.taxi.tasks.length) {
    	tuta.taxi.assignment.push( { task : indices[i][1], agent : i} );
    }
  }
  
  return indices;
};

tuta.taxi.prototype.assignmentMatrixFromDM = function(distanceMatrix){
  // create an assignment matrix
  var matrix = []; // each row represents an agent / each element in sub array customer

  for(var a = 0; a < distanceMatrix.length; a++) {
    var costs = [];
    for(var t = 0; t < distanceMatrix[a].elements.length; t++) {
      var cost = distanceMatrix[a].elements[t].distance.value * distanceMatrix[a].elements[t].duration.value; 
      costs.push(cost);
    }
    matrix.push( costs );
  }
  
  var m = new Munkres();
  var indices = m.compute(matrix);
  
  for(var i = 0; i < indices.length; i ++) {
    tuta.taxi.assignment[i].task = indices[i][1];
  }

  return matrix;
};



tuta.taxi.prototype.simpleAssign = function() {
  	tuta.taxi.assignment = [];
  	
  	tuta.taxi.availableAgents = [];
  	
  	tuta.taxi.availableAgents = tuta.taxi.availableAgents.concat(tuta.taxi.agents);
  	for(var p =0; p < tuta.taxi.availableAgents.length; p++) {
      tuta.taxi.availableAgents[p].id = p;
    }
  
	for(var t =0; t < tuta.taxi.tasks.length; t++ ) {
      var task = tuta.taxi.tasks[t];
      var cost = -1;
      var agentcandidate = -1;
      for(var a=0; a < tuta.taxi.availableAgents.length; a++) {
      	var agent = tuta.taxi.agents[a];

        var thiscost = tuta.location.distance(agent.lat,agent.lon,task.lat,task.lon);
        if(cost < 0) cost = thiscost;
        
        if(thiscost < cost) {
          cost = thiscost;
          agentcandidate = a;
          
        }
      }
      
      if(agentcandidate != -1) {
      	// assign task
      	tuta.taxi.assignment.push( { task : t, agent : tuta.taxi.availableAgents[agentcandidate].id});
  	  	tuta.taxi.availableAgents.splice(agentcandidate,1);
      }
    } 
  
  	return tuta.taxi.assignment;
};

tuta.taxi.prototype.distanceMatrixParams = function(start, count) {
  var params = {};
  params.origins = [];
  params.destinations = [];
  
  for(var j=start; j < start + count; j++) { 
  		params.origins.push(tuta.taxi.agents[tuta.taxi.assignment[j].agent]);
    	params.destinations.push(tuta.taxi.tasks[tuta.taxi.assignment[j].task]);
  }
  
  return params;
};

tuta.taxi.prototype.costsForAgents = function(callback) {
  	var matrix = [];
  	for(var i =0; i < tuta.tasks.agents.length; i++) {
      	tuta.taxi.costForAgent( function(costs,id) {
        	matrix[id] = costs;
          
          	// Are all results in?
          	if(matrix.length == tuta.taxi.agents.length) {
          		// check we have assignment for all rows
          		for(var c = 0; c < matrix.length; c++ ) {
                  if(matrix[c] === null) return;
                }
          
          		callback(matrix);
            }
          
        }, i);
    }
};

tuta.taxi.costForAgent = function(callback, agentId) {	
  	var params = {};
  	params.origins = [ tuta.taxi.agents[agentId] ];
  	params.destinations = []; 
  
  	for(var j=0; j < tuta.taxi.tasks.length; j++) { 
    	params.destinations.push(tuta.taxi.tasks[j]);
  	}
  
  	tuta.location.distanceMatrix(params.origins, params.destinations, function(distanceMatrix, id) {
    	var costs = [];
      	
      	// create cost row for agent
      	for(var t = 0; t < distanceMatrix[0].elements.length; t++) {
      		var cost = distanceMatrix[0].elements[t].distance.value * distanceMatrix[0].elements[t].duration.value; 
      		costs.push(cost);
    	}
      
      	// buffer cost row
      	for(var p = distanceMatrix[0].elements.length; p < tuta.taxi.agents.length; p++ ) {
          	costs.push(0);
        }
      
      	callback(costs,id);
    }, agentId);
}; 

tuta.taxi.prototype.render = function(object) {
	object.locationData = [ { lat: tuta.taxi.position.coords.latitude, lon: tuta.taxi.position.coords.longitude }];
  
  	for(var i=0; i < tuta.taxi.assignment.length; i++) { 
  		if(tuta.taxi.assignment[i].agent < 0) continue;
  		var start = tuta.taxi.agents[tuta.taxi.assignment[i].agent];
  		var end = tuta.taxi.tasks[tuta.taxi.assignment[i].task];
  
      	tuta.location.directionsFromCoordinates(start.lat, start.lon, end.lat, end.lon, function(directions, id) {
         	tuta.taxi.assignment[id].directions = directions;		
          	tuta.location.renderDirections(object,directions,"0xFF0000FF", "pinb.png", "option3.png",id); 
        }, i);
    }
};

tuta.taxi.prototype.startAnimationsForMap = function(object) {
 	tuta.taxi.map = object; 
  	
  	kony.timer.schedule("mainLoop", function() {
      tuta.taxi.updateTaxiLocations(object);
    }, 2, true);
};

tuta.taxi.updateTaxiLocations = function(object) {
	var locations = [];
  	for(var i =0; i < tuta.taxi.agents.length; i++) {
      tuta.taxi.agents[i].image = "pinb.png";
      locations.push(tuta.taxi.agents[i]);
    }
  
  	for(var i =0; i < tuta.taxi.tasks.length; i++) {
      tuta.taxi.tasks[i].image = "option3.png";
      locations.push(tuta.taxi.tasks[i]);
    }
  
  	var level = object.zoomLevel;
  	object.zoomLevel = level;
  	var center = object.getBounds().center;
  	var locationData = [];
  	locationData.push(center);
  	locationData = locationData.concat(locations);
  	object.locationData = locationData;
  	object.zoomLevel=level;
};




