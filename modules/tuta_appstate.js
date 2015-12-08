if (typeof(tuta) === "undefined") {
  tuta = {};
}

tuta.appstate = {};

//Loads the appstate into a struct, based on the user
tuta.appstate.loadState = function(){

}

//
tuta.appstate.resumeFromState = function(){

};






















































/*


//kony.store.setItem("watch", watchID);
                //kony.store.removeItem("watch");
                //kony.store.getItem("user");
                //kony.store.setItem("user", JSON.stringify(inputs <This is the json struct> ));

                ksAppState = kony.store.getItem("storedAppState");

                if (ksAppState.tripState == 1){
                  //User was idle, continue as normal
                  tuta.forms.frmMap.show();
                }
                else if (ksAppState.tripState == 2){
                  //User was hailing a driver. Continue to hail the driver.
                  inputBooking = ksAppState.storedBooking;
                  tuta.forms.frmMap.show();
                }
                else if (ksAppState.tripState == 3){
                  /*User was waiting for driver! 
                    1. Draw route
                    2. Track driver

                    Need to start all timers that wait for the driver
                    app to tell client app that customer is picked up*/
                    inputBooking = ksAppState.storedBooking;





                    tuta.forms.frmMap.show();
                }
                else if (ksAppState.tripState == 4){
                  /*User was in transit!
                  Track the user along the route,
                  run the relevant methods to draw the route,
                  run the timer that waits for the driver app
                  to drop the customer off.*/
                  inputBooking = ksAppState.storedBooking;




                  tuta.forms.frmMap.show();
                }
                else{
                  ksAppState.tripState = 1;


*/                  