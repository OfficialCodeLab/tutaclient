if (typeof(tuta) === "undefined") {
  tuta = {};
}

tuta.appstate.helper = {};

tuta.appstate.helper.checkState = function(callback){
  //SET UP:
  //SET THE GLOBAL KEY TO USE HERE
  appstate_key = currentUser.userName;
      
  //tuta.appstate.clearState();
  
  //Retrieve the current state as an object
  var state_obj = tuta.appstate.getState();
  // Shallow copy the object to neccessary variable
  

  //If the object is stored in the store (IE there was a current app state)
  if(state_obj !== default_value){

    // CUSTOMIZE AFTER THIS LINE
    //======================================
    var current_state = state_obj.state_string;
    var current_booking = state_obj.bookingID;
    //tuta.util.alert("TEST", current_state + " ||| " + current_booking);

    //Use the current booking and state string to retrieve booking and callback
    //CUSTOMIZE IN HERE, for now we will only use the current booking as the identifier
    if(current_booking !== "NONE" && current_booking !== null){ 

      //Retrieve the current booking and set values
      tuta.retrieveBooking(current_booking, function(result){
        currentBooking = "" + current_booking;
        currentBookingObject = result.value[0];
        
		
        callback(currentBookingObject.status);
      });
    }
    else if (current_state !== "NONE" && current_state !== null){ //THIS WILL BE CALLED IF THERE IS NO BOOKING ID 
      //TODO: Handle other states
      callback(current_state);
    }
    else if (current_booking === undefined){
      tuta.appstate.clearState();
      callback(default_value);
    }
    //======================================
    // STOP CUSTOMIZING
  }  
  else{  //If there is no current state, handle what happens
      tuta.appstate.clearState();
    callback(default_value);
  }
};

tuta.appstate.helper.resumeFromState = function(){
  //tuta.appstate.helper.checkState(function(booking_state){
  //tuta.util.alert("Resuming from", tuta.appstate.getState());

  tuta.appstate.helper.checkState(function(result){


    //Store the object in case of crash
    //tuta.appstate.setState(currentAppState);
   tuta.util.alert("TEST", result);
	//RESULT:
    //   CURRENTBOOKING : WILL BE THE BOOKING ID (DONT NEED TO QUERY SERVER NOW)
    //   CURRENTBOOKINGOBJECT : WILL HAVE ALL THE BOOKING STUFF YOU NEED (USERID, STATUS, ETC)
    //   RESULT : WILL BE THE STATUS OF THE BOOKING (IN_TRANSIT/ON_ROUTE OR UNCONFIRMED)
    if (result == default_value){
      tuta.location.loadPositionInit();
      tuta.forms.frmMap.show();
    }
    else if (result === "Unconfirmed"){
      tuta.location.loadPositionInit();
      kony.timer.schedule("tempLoad", function(){
        ************************ SOMETHING IS GOING WRONG HERE, THE APP IS CRASHING ************************
        ************************ LOOK IN AWAIT CONFIRM IF SOMETHING ISNT BEING SET CORRECTLY ************************
        ************************ IT COULD BE THAT NO DESTINATION OR ANY OF THAT DATA HAS BEEN SET ************************
        try{
          //tuta.util.alert("Current App State Details: ", JSON.stringify(currentAppState));
          tuta.awaitConfirm(appState.bookingID);
        }
        catch (ex){
          tuta.util.alert("Error", ex);
        }

      }, 5, false);
    }/*
    else{

      kony.timer.schedule("tempLoad", function(){
        try{
          //tuta.util.alert("Current App State Details: ", JSON.stringify(currentAppState));
          tuta.awaitConfirm(currentBooking);
          
          //CURRENTLY CRASHES HERE SOMETHING GOES WRONG
        }
        catch (ex){
          tuta.util.alert("Error", ex);
        }

      }, 1, false);

      //Resume from en route
      tuta.location.loadPositionInit();


      application.service("userService").invokeOperation(
        "booking", {}, {id: currentBooking },
        function(result) { 
          tripOnRoute = true;
          frmMap.flexNoPanning.setVisibility(true);
          frmMap.flexProgress.setVisibility(false);
          try{
            kony.timer.cancel("taxiHailTimer");
          }
          catch (ex){

          }
          try {
            tuta.util.alert("Instant Booking", result.value[0]);
          }
          catch(ex){
            tuta.util.alert("Instant Booking Error", ex);
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


        },
        function(error) { //The second function will always run if there is an error.
          tuta.util.alert("error",error);
        }
      );





      //Resume from in transit
      tuta.location.loadPositionInit();
      frmMap.flexNoPanning.setVisibility(true);
      frmMap.flexProgress.setVisibility(false);

      tuta.awaitDriverPickupConfirmation();

    }*/

  });
  //});
};
