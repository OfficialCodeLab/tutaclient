if (typeof(tuta) === "undefined") {
    tuta = {};
}

tuta.appstate.helper = {};


var current_state;
var current_booking;


tuta.appstate.helper.checkState = function(callback) {
    //SET UP:
    //SET THE GLOBAL KEY TO USE HERE
    appstate_key = currentUser.userName;

    tuta.appstate.clearState();

    //Retrieve the current state as an object
    var state_obj = tuta.appstate.getState();

    //tuta.util.alert("State object", JSON.stringify(state_obj));
    // Shallow copy the object to neccessary variable

    //If the object is stored in the store (IE there was a current app state)
    if (state_obj !== default_value) {

        // CUSTOMIZE AFTER THIS LINE
        //======================================
        current_state = state_obj.state_string;
        current_booking = state_obj.bookingID;

        //tuta.util.alert("TEST", current_state + " ||| " + current_booking);

        //Use the current booking and state string to retrieve booking and callback
        //CUSTOMIZE IN HERE, for now we will only use the current booking as the identifier
        if (current_booking !== "NONE" && current_booking !== null && current_booking !== undefined) {

            //Retrieve the current booking and set values
            tuta.retrieveBooking(current_booking, function(result) {
                currentBooking = "" + current_booking;
                currentBookingObject = result.value[0];
                currentBookingObj = result.value[0];

                //tuta.util.alert("Object Status before sending", currentBookingObject.status);
                callback(currentBookingObject.status);
            });
        } else if (current_state !== "NONE" && current_state !== null) { //THIS WILL BE CALLED IF THERE IS NO BOOKING ID 
            //TODO: Handle other states
            //tuta.util.alert("Object Status before sending", current_state);
            callback(current_state);
        } else if (current_booking === undefined) {
            //tuta.util.alert("Object Status before sending", current_state);
            tuta.appstate.clearState();
            callback(default_value);
        } else {
            //tuta.util.alert("Well this is awkward.", current_state);
        }
        //======================================
        // STOP CUSTOMIZING
    } else { //If there is no current state, handle what happens
        //tuta.util.alert("Object Status before sending", state_obj);
        tuta.appstate.clearState();
        callback(default_value);
    }
};

tuta.appstate.helper.resumeFromState = function() {
    //tuta.appstate.helper.checkState(function(booking_state){
    //tuta.util.alert("Resuming from", tuta.appstate.getState());
    //Trying to check the state
  
    try {
        tuta.appstate.helper.checkState(function(result) {


            //Store the object in case of crash
            //tuta.appstate.setState(currentAppState);


            //tuta.util.alert("Result pure object", result);


            //RESULT:
            //   CURRENTBOOKING : WILL BE THE BOOKING ID (DONT NEED TO QUERY SERVER NOW)
            //   CURRENTBOOKINGOBJECT : WILL HAVE ALL THE BOOKING STUFF YOU NEED (USERID, STATUS, ETC)
            //   RESULT : WILL BE THE STATUS OF THE BOOKING (IN_TRANSIT/ON_ROUTE OR UNCONFIRMED)
            if (result === default_value) {
                //tuta.util.alert("Resumin...", "resuming from default value.");
                tuta.location.loadPositionInit();
                tuta.forms.frmMap.show();
            } else if (result === null) {
                //tuta.util.alert("Resumin...", "resuming from null.");
                tuta.location.loadPositionInit();
                tuta.forms.frmMap.show();
            } else if (result === "HAILING" || result === "Unconfirmed") {
                //tuta.util.alert("Resumin...", "resuming from HAILING.");
                tuta.location.loadPositionInit();
                kony.timer.schedule("tempLoad", function() {


                    try {
                        //tuta.util.alert("Appstate: ", current_booking);
                    } catch (ex) {
                        tuta.util.alert("Unable to display current booking: ", ex);
                    }




                    try {
                        //tuta.util.alert("Current App State Details: ", JSON.stringify(currentAppState));

                        tuta.awaitConfirm(current_booking);
                    } catch (ex) {
                        tuta.util.alert("Error", ex);
                    }

                }, 5, false);
            } else if (result === "ONROUTE") {

                //tuta.util.alert("Resumin...", "resuming from ENROUTE.");
                //Resume from en route
                tuta.location.loadPositionInit();
                //tuta.forms.frmMap.show();

                //Try set all the variables needed for resume
                try {
                    frmMap.flexAdd.setVisibility(false);
                    frmMap.flexChangeDest.setVisibility(false);
                    frmMap.flexNoOfPeople.setVisibility(false);
                    frmMap.flexNoPanning.setVisibility(true);
                    frmMap.flexProgress.setVisibility(false);
                    journeyComplete = false;
                    //tuta.forms.frmMap.flexMapCenter.setVisibility(false);
                    tripOnRoute = true;
                    onJourney = 1;

                    //What to do on resume from app state
                    tuta.renderRouteAndDriver(currentBookingObject);
                    tuta.fetchDriverInfo(currentBookingObject.providerId);
                } catch (ex) {
                    tuta.util.alert("Something went wrong resuming from EN ROUTE", ex);
                }
                //Set variables

                //yourBooking = bookingID;
            } else if (result === "InTransit") {
                //Resume from in transit
                //tuta.util.alert("Resumin...", "resuming from in transit.");
                tuta.location.loadPositionInit();
                //tuta.forms.frmMap.show();

                try {
                    frmMap.flexAdd.setVisibility(false);
                    frmMap.flexChangeDest.setVisibility(false);
                    frmMap.flexNoOfPeople.setVisibility(false);
                    frmMap.flexNoPanning.setVisibility(false);
                    frmMap.flexProgress.setVisibility(false);
                    //tuta.forms.frmMap.flexMapCenter.setVisibility(false);
                    tripOnRoute = true;
                    onJourney = 1;
                    yourBooking = current_booking;
					
                    //What to do on resume from app state
                    driverArrived = true;
                    tripOnRoute = false;
                    distNow = 0;
                    awaitingConfirmation = false;
                    overview.active = 0;
                    journeyComplete = false;
                  	tripInTransitResume = true;
                    tripInTransitResume2 = true;
					
                  	tuta.fetchDriverInfo(currentBookingObject.providerId);
                  	//tuta.awaitDriverDropOffConfirmation ();
                  
                    //yourBooking = bookingID;
					
                  	findAddress(currentBookingObject.address.description, function(success, error) {
                      destination = success.results[0];
                      tuta.location.directionsFromCoordinates(currentPos.geometry.location.lat, currentPos.geometry.location.lng, destination.geometry.location.lat, destination.geometry.location.lng, function(response) {

                        kony.timer.schedule("renderDir", function() {
                          renderDirections(frmMap.mapMain, response, "0x0000FFFF", "", "");
                          updateMap();
                          tuta.updateDriverOnRoute();
                          //tuta.startWatchLocation();
                        }, 2, false);
                      });

                    });
                  
                    try {
                        kony.timer.cancel("taxiAwaitTimer");
                    } catch (ex) {

                    }

                    tuta.renderFinalRoute();

                } catch (ex2) {
                    tuta.util.alert("Something went wrong resuming from IN TRANSIT", ex2);
                  
                }
            } else {
                //tuta.util.alert("ERROR!", "Your booking is probably complete..\n" + result);
                tuta.location.loadPositionInit();
                tuta.forms.frmMap.show();
            }

        });
    } catch (ex) {
        tuta.util.alert("Checkstate error", ex);
    }

    //});
};