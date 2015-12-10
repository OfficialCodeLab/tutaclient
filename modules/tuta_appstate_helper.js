if (typeof(tuta) === "undefined") {
  tuta = {};
}

tuta.appstate.helper = {};

tuta.appstate.helper.checkState = function(callback){
  //SET UP:
  //SET THE GLOBAL KEY TO USE HERE
  appstate_key = currentUser.userName;
  
  //Retrieve the current state as an object
  var state_obj = tuta.appstate.getState();
  // Shallow copy the object to neccessary variable
  appState = JSON.parse(JSON.stringify(state_obj));
  
  //If the object is stored in the store (IE there was a current app state)
  if(state_obj === default_value){

    // CUSTOMIZE AFTER THIS LINE
    //======================================
    var current_state = state_obj.state_string;
    var current_booking = state_obj.bookingID;

    //Use the current booking and state string to retrieve booking and callback
    //CUSTOMIZE IN HERE, for now we will only use the current booking as the identifier
    if(current_booking !== "NONE" && current_booking !== null){ 
      
      //Retrieve the current booking and set values
      tuta.retrieveBooking(current_state, function(result){
        storedBookingID = current_booking;
        currentBooking = {
          userId: result.value[0].userId,
          providerId: result.value[0].providerId,
          address: {
            description: result.value[0].address.description
          },
          location: {
            lat: currentPos.geometry.location.lat + "",
            lng: currentPos.geometry.location.lng + ""
          },
          status: current_state
        };
        
        callback(current_state);
      });
    }
    else if (current_state !== "NONE" && current_state !== null){ //THIS WILL BE CALLED IF THERE IS NO BOOKING ID 
      //TODO: Handle other states
        callback(current_state);
    }
    //======================================
    // STOP CUSTOMIZING
  }  
  else{  //If there is no current state, handle what happens
    callback(default_value);
  }
};

tuta.appstate.helper.resumeFromState = function(){
  //tuta.appstate.helper.checkState(function(booking_state){
    //tuta.util.alert("Resuming from", tuta.appstate.getState());


    var booking_state = currentAppState.stateNum;
    if (booking_state === null){
      tuta.location.loadPositionInit();
    }
    else if(booking_state === 1){
      //Resume from idle
      tuta.location.loadPositionInit();
    }
    else if(booking_state === 2){
      //Resume from hailing
      tuta.loadPositionInit();
      //tuta.awaitConfirm(currentAppState.booking);

    }
    else if(booking_state === 3){
      //Resume from en route
      tuta.location.loadPositionInit();
    }
    else if(booking_state === 4){
      //Resume from in transit
      tuta.location.loadPositionInit();
    }
    else{
      tuta.location.loadPositionInit();
    }
  //});
};
