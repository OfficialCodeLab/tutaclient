/**
 * SSA Mobile namespace
 * @namespace ssa.mobile
 */
if (typeof(tuta) === "undefined") {
	tuta = {};
}

tuta.util = {};

tuta.util.getType = function (elem) {
  return Object.prototype.toString.call(elem);
};

tuta.util.alert = function (title,message) {
  
  var stringMessage = message;
  
  // the kony alert object does not automatically convert Object to string on android
  // platform. If the message param is not a string we should convert it to one
  if(tuta.util.getType(message) != '[object String]') {
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

tuta.util.random = function(low,high,round) {
  var val = Math.random() * (high - low) + low;
  return round ? Math.round(val) : val;
};

tuta.util.radians = function(degrees) {
	return degrees * (Math.PI/180);
};


tuta.util.arrayObjectIndexOf = function(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
};

/**
* The Quicksort implementation which takes an object instead of a simple type.
*/
tuta.util.quickSortObj = function (objArry, property) {
 
    var loeCollection = [];
    var gtCollection = [];
    
    if (objArry.length < 2) {
        return objArry;
    }
    
    var pivot = Math.floor(objArry.length / 2);
    var pivotVal = objArry[pivot][property];
    var pivotItem = objArry.splice(pivot, 1)[0];
    
    for (var i = 0; i < objArry.length; i++) {
     
        if (objArry[i][property] <= pivotVal) { loeCollection.push(objArry[i]); }
        else if (objArry[i][property] > pivotVal) { gtCollection.push(objArry[i]); }
    }
    
    return tuta.util.quickSortObj(loeCollection, property).concat(pivotItem, tuta.util.quickSortObj(gtCollection, property));
};