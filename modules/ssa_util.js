/**
 * SSA Mobile namespace
 * @namespace ssa.mobile
 */
if (typeof(ssa) === "undefined") {
	ssa = {};
}

ssa.util = {};

ssa.util.getType = function (elem) {
  return Object.prototype.toString.call(elem);
};

ssa.util.alert = function (title,message) {
  
  var stringMessage = message;
  
  // the kony alert object does not automatically convert Object to string on android
  // platform. If the message param is not a string we should convert it to one
  if(ssa.util.getType(message) != '[object String]') {
    stringMessage = JSON.stringify(message);
  } 
  
  var basicConf = {message: stringMessage ,alertType: constants.
  ALERT_TYPE_INFO,alertTitle: title,yesLabel:"ok",
  noLabel: "no", alertHandler: null};
	
  //Defining pspConf parameter for alert
  var pspConf = {};

  //Alert definition
  var infoAlert = kony.ui.Alert(basicConf,pspConf); 
};

ssa.util.random = function(low,high,round) {
  var val = Math.random() * (high - low) + low;
  return round ? Math.round(val) : val;
};

ssa.util.radians = function(degrees) {
	return degrees * (Math.PI/180);
};


