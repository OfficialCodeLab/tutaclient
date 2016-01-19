if (typeof(tuta) === "undefined") {
  tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
  tuta.forms = {};
}

tuta.forms.frmDebug = function() {
  // initialize controller 
  tuta.forms.frmDebug = new tuta.controller(frmDebug); 

  // Initialize form events	
  tuta.forms.frmDebug.onInit = function(form) {
  };  

  tuta.forms.frmDebug.onPreShow = function(form) {
    var self = this;

    this.control("btnBack").onClick = function (button) {tuta.forms.frmMap.show();};

    //Controls the flag for the map overlay
    this.control("btnTickPress1").onClick = function (button) {
      if (overlayEnabledFlag === true){
        overlayEnabledFlag = false;
        //tuta.util.alert("Notice","Overlay Disabled!");
        toggleImage(frmDebug.imgTickIcon);

        frmMap.flexChangeDest.setVisibility(false);

      }
      else{
        overlayEnabledFlag = true;
        //tuta.util.alert("Notice","Overlay Enabled!");
        toggleImage(frmDebug.imgTickIcon);
        frmMap.flexChangeDest.setVisibility(true);
      }
    };

    this.control("btnTickPress2").onClick = function (button) {    
      if (taxiScanFlag === true){
        taxiScanFlag = false;
        //Cancel Kony Timer
        //kony.timer.cancel("trackDemoDriver");
        toggleImage(frmDebug.imgTickIcon2);
      }
      else{
        taxiScanFlag = true;
        toggleImage(frmDebug.imgTickIcon2);
        /*kony.timer.schedule("trackDemoDriver", function(){
                  tuta.trackDriver("Courtney@codelab.io");
            }, 5, true);*/
      }
    };

    this.control("btnTickPress3").onClick = function (button){
      //toggleImage(frmDebug.imgTickIcon3);
      tuta.appstate.clearState();
      tuta.util.alert("Appstate", "Appstate has been cleared");
    };

    this.control("btnTickPress4").onClick = function (button){
      //toggleImage(frmDebug.imgTickIcon4);
      //tuta.util.alert("Current User Value", currentUser);
      try{
        tuta.util.alert("Resuming from", JSON.stringify(tuta.appstate.getState()) + "test");
      } catch (ex){
        tuta.util.alert("Error!", ex);
      }
      
    };

    //User info button
    this.control("btnTickPress5").onClick = function (button){

      var userTempQuery = JSON.parse(kony.store.getItem("user"));
      var currentUserEmail = JSON.stringify(userTempQuery.userName);
      // var userInfoResults = "";
      //

      //Store the user ID as variable 'input' for query
      var input = {
        id: currentUserEmail
      };


      application.service("userService").invokeOperation(
        "user", {}, input,
        function(result) { 
          
          var csFirstName = result.value[0].userInfo.firstName;
          var csLastName = result.value[0].userInfo.lastName;
          var csEmail = currentUserEmail;
          var csLong = result.value[0].location.lng;
          var csLat = result.value[0].location.lat;
          
          tuta.util.alert("User Information", "Name: " + csFirstName + " " + csLastName +
                         "\nEmail Address: " + csEmail +
                         "\nLattitude: " + csLat + 
          				 "\nLongitude: " + csLong);
          
          
        },
        function(error) {
          // the service returns 403 (Not Authorised) if credentials are wrong
          tuta.util.alert("Error " + error);

        }
      );

    };
    
    this.control("btnTickPress6").onClick = function (button){
      var csDemoDriver = "craig@ssa.co.za";
      tuta.trackDriver(csDemoDriver);
      updateMap();
      tuta.util.alert("Notification", "The map has been updated, and is currently tracking " + csDemoDriver + ".");
    };
    
    this.control("btnTickPress7").onClick = function (button) {
      tuta.util.alert("Button Clicked", "Functionality for this is still in developement");
    };

  };//END OF PRE-SHOW

  tuta.forms.frmDebug.onPostShow = function(form) {
    var self = this;
  };
};

