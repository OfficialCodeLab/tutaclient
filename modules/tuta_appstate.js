if (typeof(tuta) === "undefined") {
  tuta = {};
}

//The prefix to be used before the encoded key
var GLOBAL_ENCODING_PREFIX = "AS";

//CHANGE THIS IF YOU WANT TO USE A STANDARD KEY
var appstate_key = "";

//Likely to never be used. Change this if you want to standardize a response
var default_value = null;

tuta.appstate = {};


//Get the state in the kony store
// @Return
//    The state that is stored in the store will be returned
//    If there is nothing in the store, the default value will be returned as the response
tuta.appstate.getState = function(){  
  var state_str_key = tuta.appstate.getEncodedKey();
  var state_str = kony.store.getItem(state_str_key);
  if(state_str !== null && state_str !== undefined){
    var state_obj = JSON.parse(state_str);
    return JSON.parse(JSON.stringify(state_obj));
  }
  
  return default_value;
};

//Set the state in the kony store
// @Params
//    obj: The object to insert into the kony store (optional)
// @Default
//    The store will have the default value inserted as the value
tuta.appstate.setState = function(obj){
  var state_str_key = tuta.appstate.getEncodedKey();  
  var state_str = JSON.stringify(obj) || default_value;
  kony.store.setItem(state_str_key, state_str);
};

//Clear the kony store
tuta.appstate.clearState = function(){
  var state_str_key = tuta.appstate.getEncodedKey();
  kony.store.removeItem(state_str_key);
};

//Retrieve an encoded key to use in the store
// @Params
//    key: If a custom key is needed (optional)
// @Default
//    appstate_key will be used for the encoding
tuta.appstate.getEncodedKey = function(key){
  appstate_key = JSON.stringify(JSON.parse(currentUser).userName);
  return appstate_key;
  //tuta.util.alert("Appstate Key:", appstate_key);
  //return GLOBAL_ENCODING_PREFIX + Base64.encode(key) || GLOBAL_ENCODING_PREFIX + Base64.encode(appstate_key);
};

