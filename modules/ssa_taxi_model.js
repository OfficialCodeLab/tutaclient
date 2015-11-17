/**
 * SSA Mobile namespace
 * @namespace ssa.mobile
 */
if (typeof(ssa) === "undefined") {
	ssa = {};
}

ssa.taxi = function(position) {
  	ssa.taxi.position = position;
};

ssa.taxi.prototype.generate = function(noAgents, noTasks) {
	ssa.taxi.tasks = ssa.location.randomPoints(noTasks,
    	ssa.taxi.position.coords.latitude,
      	ssa.taxi.position.coords.longitude,
      	8000,"pinb.png"
    );
  
  	//ssa.util.alert("TASKS", ssa.taxi.tasks );
  
  	ssa.taxi.agents = ssa.location.randomPoints( noAgents,
    	ssa.taxi.position.coords.latitude,
      	ssa.taxi.position.coords.longitude,
      	5000, "option3.png"
    );	
};

ssa.taxi.prototype.assignmentMatrix = function(){
  // create an assignment matrix
  var matrix = []; // each row represents an agent / each element in sub array customer

  for(var a = 0; a < ssa.taxi.assignment.length; a++) {
    var costs = [];
    var id = ssa.taxi.assignment[a].agent;
    var agent = ssa.taxi.agents[id];
    for(var t = 0; t < ssa.taxi.tasks.length; t++) {
      var task = ssa.taxi.tasks[t];
      costs.push(ssa.location.distance(agent.lat,agent.lon,task.lat,task.lon));
    }
    matrix.push( costs );
  }
  
  var m = new Munkres();
  var indices = m.compute(matrix);
  
  for(var i = 0; i < indices.length; i ++) {
    ssa.taxi.assignment[i].task = indices[i][1];
  }

  return matrix;
};

ssa.taxi.prototype.assignmentMatrixFromH = function(){
  // create an assignment matrix
  var matrix = []; // each row represents an agent / each element in sub array customer

  for(var a = 0; a < ssa.taxi.agents.length; a++) {
    var costs = [];
    var agent = ssa.taxi.agents[a];
    for(var t = 0; t < ssa.taxi.tasks.length; t++) {
      var task = ssa.taxi.tasks[t];
      costs.push(ssa.location.distance(agent.lat,agent.lon,task.lat,task.lon));
    }
    
    for(var k = ssa.taxi.tasks.length; k < ssa.taxi.agents.length; k++) {
      costs.push(0);
    }
    matrix.push( costs );
  }
  
  var m = new Munkres();
  var indices = m.compute(matrix);
  
  ssa.taxi.assignment = [];
  
  for(var i = 0; i < indices.length; i ++) {
    if(indices[i][1] < ssa.taxi.tasks.length) {
    	ssa.taxi.assignment.push( { task : indices[i][1], agent : i} );
    }
  }
  
  return indices;
};

ssa.taxi.prototype.assignmentMatrixFromDM = function(distanceMatrix){
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
    ssa.taxi.assignment[i].task = indices[i][1];
  }

  return matrix;
};



ssa.taxi.prototype.simpleAssign = function() {
  	ssa.taxi.assignment = [];
  	
  	ssa.taxi.availableAgents = [];
  	
  	ssa.taxi.availableAgents = ssa.taxi.availableAgents.concat(ssa.taxi.agents);
  	for(var p =0; p < ssa.taxi.availableAgents.length; p++) {
      ssa.taxi.availableAgents[p].id = p;
    }
  
	for(var t =0; t < ssa.taxi.tasks.length; t++ ) {
      var task = ssa.taxi.tasks[t];
      var cost = -1;
      var agentcandidate = -1;
      for(var a=0; a < ssa.taxi.availableAgents.length; a++) {
      	var agent = ssa.taxi.agents[a];

        var thiscost = ssa.location.distance(agent.lat,agent.lon,task.lat,task.lon);
        if(cost < 0) cost = thiscost;
        
        if(thiscost < cost) {
          cost = thiscost;
          agentcandidate = a;
          
        }
      }
      
      if(agentcandidate != -1) {
      	// assign task
      	ssa.taxi.assignment.push( { task : t, agent : ssa.taxi.availableAgents[agentcandidate].id});
  	  	ssa.taxi.availableAgents.splice(agentcandidate,1);
      }
    } 
  
  	return ssa.taxi.assignment;
};

ssa.taxi.prototype.distanceMatrixParams = function(start, count) {
  var params = {};
  params.origins = [];
  params.destinations = [];
  
  for(var j=start; j < start + count; j++) { 
  		params.origins.push(ssa.taxi.agents[ssa.taxi.assignment[j].agent]);
    	params.destinations.push(ssa.taxi.tasks[ssa.taxi.assignment[j].task]);
  }
  
  return params;
};

ssa.taxi.prototype.costsForAgents = function(callback) {
  	var matrix = [];
  	for(var i =0; i < ssa.tasks.agents.length; i++) {
      	ssa.taxi.costForAgent( function(costs,id) {
        	matrix[id] = costs;
          
          	// Are all results in?
          	if(matrix.length == ssa.taxi.agents.length) {
          		// check we have assignment for all rows
          		for(var c = 0; c < matrix.length; c++ ) {
                  if(matrix[c] === null) return;
                }
          
          		callback(matrix);
            }
          
        }, i);
    }
};

ssa.taxi.costForAgent = function(callback, agentId) {	
  	var params = {};
  	params.origins = [ ssa.taxi.agents[agentId] ];
  	params.destinations = []; 
  
  	for(var j=0; j < ssa.taxi.tasks.length; j++) { 
    	params.destinations.push(ssa.taxi.tasks[j]);
  	}
  
  	ssa.location.distanceMatrix(params.origins, params.destinations, function(distanceMatrix, id) {
    	var costs = [];
      	
      	// create cost row for agent
      	for(var t = 0; t < distanceMatrix[0].elements.length; t++) {
      		var cost = distanceMatrix[0].elements[t].distance.value * distanceMatrix[0].elements[t].duration.value; 
      		costs.push(cost);
    	}
      
      	// buffer cost row
      	for(var p = distanceMatrix[0].elements.length; p < ssa.taxi.agents.length; p++ ) {
          	costs.push(0);
        }
      
      	callback(costs,id);
    }, agentId);
}; 

ssa.taxi.prototype.render = function(object) {
	object.locationData = [ { lat: ssa.taxi.position.coords.latitude, lon: ssa.taxi.position.coords.longitude }];
  
  	for(var i=0; i < ssa.taxi.assignment.length; i++) { 
  		if(ssa.taxi.assignment[i].agent < 0) continue;
  		var start = ssa.taxi.agents[ssa.taxi.assignment[i].agent];
  		var end = ssa.taxi.tasks[ssa.taxi.assignment[i].task];
  
      	ssa.location.directionsFromCoordinates(start.lat, start.lon, end.lat, end.lon, function(directions, id) {
         	ssa.taxi.assignment[id].directions = directions;		
          	ssa.location.renderDirections(object,directions,"0xFF0000FF", "pinb.png", "option3.png",id); 
        }, i);
    }
};

ssa.taxi.prototype.startAnimationsForMap = function(object) {
 	ssa.taxi.map = object; 
  	
  	kony.timer.schedule("mainLoop", function() {
      ssa.taxi.updateTaxiLocations(object);
    }, 2, true);
};

ssa.taxi.updateTaxiLocations = function(object) {
	var locations = [];
  	for(var i =0; i < ssa.taxi.agents.length; i++) {
      ssa.taxi.agents[i].image = "pinb.png";
      locations.push(ssa.taxi.agents[i]);
    }
  
  	for(var i =0; i < ssa.taxi.tasks.length; i++) {
      ssa.taxi.tasks[i].image = "option3.png";
      locations.push(ssa.taxi.tasks[i]);
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




