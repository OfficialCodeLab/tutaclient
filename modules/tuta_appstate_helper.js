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
    try{
      currentAppState = tuta.appstate.getState();
    } catch (ex){
      tuta.util.alert("Appstate Helper", ex);
    }

    currentAppState = {
      user: JSON.parse(currentUser).userName,
      booking: "",
      stateNum: 1
    };

    //Store the object in case of crash
    tuta.appstate.setState(currentAppState);


    

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
      tuta.location.loadPositionInit();
      //tuta.forms.frmMap.show();

      	
      kony.timer.schedule("tempLoad", function(){
        try{
          tuta.awaitConfirm(currentAppState.booking);
        }
        catch (ex){
          tuta.util.alert("Error", ex);
        }
        
      }, 1, false);
      

    }
    else if(booking_state === 3){
      //Resume from en route
      tuta.location.loadPositionInit();


      application.service("userService").invokeOperation(
        "booking", {}, currentBooking,
        function(result) { 
          if (result.value[0].status ==="OnRoute")
          {
            tripOnRoute = true;
            frmMap.flexNoPanning.setVisibility(true);
            frmMap.flexProgress.setVisibility(false);
            try{
              kony.timer.cancel("taxiHailTimer");
            }
            catch (ex){

            }

            //Store the actual booking
            currentBookingObj = result.value[0];

            //Start the route
            tuta.renderRouteAndDriver(result.value[0]);
            tuta.fetchDriverInfo(result.value[0].providerId);
            yourBooking = currentBooking;

            //Show map center button
            try{
              tuta.forms.frmMap.flexMapCenter.setVisibility(false);
            }
            catch(ex){
              //tuta.util.alert("Info", "Unable to remove the map centering button.");
            }

          }
        },
        function(error) { //The second function will always run if there is an error.
          //tuta.util.alert("error",error);
        }
      );






    }
    else if(booking_state === 4){
      //Resume from in transit
      tuta.location.loadPositionInit();
      frmMap.flexNoPanning.setVisibility(true);
      frmMap.flexProgress.setVisibility(false);

      tuta.awaitDriverPickupConfirmation();

    }
    else{
      tuta.location.loadPositionInit();
    }
  //});
};
