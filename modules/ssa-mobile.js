//Type your code here
var ssa = new Object();
ssa.mobile = {};

ssa.mobile.alert = function(title, message) {
  var basicConf = {message: message ,alertType: constants.
  ALERT_TYPE_INFO,alertTitle: title,yesLabel:"ok",
  noLabel: "no", alertHandler: null};
	
  //Defining pspConf parameter for alert
  var pspConf = {};

  //Alert definition
  var infoAlert = kony.ui.Alert(basicConf,pspConf);  
}

ssa.mobile.odata = function(url,user,password) {
  this.url = url;
  this.user = user;
  this.password = password;
  
  // TODO call service to get $metadata
}

ssa.mobile.odata.prototype.call = function(collection,data,success,error) {
  
  var request = new kony.net.HttpRequest();
  
  request.timeout = 5000;
  
  request.onReadyStateChange = function() {
  	if(request.readyState == constants.HTTP_READY_STATE_DONE) {
      var response = request.response;
      if(response == null) {
        error(request.getAllResponseHeaders());
      } else {
        success(response.value);
      }
    }
  }
  
  var frmData = new kony.net.FormData();
  frmData.append("data",data);
 
  request.open(constants.HTTP_METHOD_POST, this.url + collection, true, this.user, this.password);
  request.send(frmData);
}

ssa.mobile.odata.prototype.read = function(collection,success,error) {
  var request = new kony.net.HttpRequest();
  frmSplash.rtDebug.text = "<span>Initializing SSA Mobile read function...</span>";
  
  request.timeout = 5000;
  
  request.onReadyStateChange = function() {
  	if(request.readyState == constants.HTTP_READY_STATE_DONE) {
      var response = request.response;
      if(response == null) {
        error(request.getAllResponseHeaders());
      } else {
      	success(response.value);
      }
    }
  }
  
  request.open(constants.HTTP_METHOD_GET, this.url + collection, true, this.user, this.password);
  request.send();
  
}

/*
ssa.mobile.odata.prototype.create = function(collection,data,success,error) {
  
  var request = new kony.net.HttpRequest();
  
  request.timeout = 5000;
  
  request.onReadyStateChange = function() {
  	if(request.readyState == constants.HTTP_READY_STATE_DONE) {
      var response = request.response;
      if(response == '') {
        error(response.getAllResponseHeaders());
      } else {
      	success(response);
      }
    }
  }
  
  request.open(constants.HTTP_METHOD_POST, this.url + collection, true, this.user, this.password);
  request.send(data);
}

ssa.mobile.odata.prototype.call = function(collection,data,success,error) {
  
  var request = new kony.net.HttpRequest();
  
  request.timeout = 5000;
  
  request.onReadyStateChange = function() {
  	if(request.readyState == constants.HTTP_READY_STATE_DONE) {
      var response = request.response;
      if(response == '') {
        error(response.getAllResponseHeaders());
      } else {
      	success(response);
      }
    }
  }
  
  request.open(constants.HTTP_METHOD_POST, this.url + collection, true, this.user, this.password);
  request.send(data);
}

ssa.mobile.odata.prototype.update = function(collection,data,success,error) {
  var request = new kony.net.HttpRequest();
  
  request.timeout = 5000;
  
  request.onReadyStateChange = function() {
  	if(request.readyState == constants.HTTP_READY_STATE_DONE) {
      var response = request.response;
      if(response == '') {
        error(response.getAllResponseHeaders());
      } else {
      	success(response);
      }
    }
  }
  
  request.open(constants.HTTP_METHOD_POST, this.url + collection, true, this.user, this.password);
  request.send(data);
}
*/
