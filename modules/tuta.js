/*
    Tuta Client App

    Trip States:
    0. Idling (panning the map etc)
    1. Hailing a driver
    2. Driver on route (waiting for driver, centers on self)
    3. In transit (in car with driver)

*/


// global reference to app object
var application = null; 

//App state flags
var initialAppLoad = true;
var client_state = 0;
var searchMode = 0;
var bookNow = true;
var journeyComplete = false;
var driverArrived = false;
var awaitingConfirmation = true;
var tripOnRoute = false;
var hailingTaxi = false; //Used to prevent multiple requests
var onJourney = 0;
var driver;
var tripInTransitResume = false;
var tripInTransitResume2 = false;

//Location variables
var driversNear = [];
var destination = null;
var pickupPoint = null;
var nearbyDrivers = [];
var initialLoad = true;
var finalroute = null;
var taxiRoute = null;
var country = null;
var userbearing = 0;

//Booking variables
var inputBooking;
var yourBooking;
var drivercell;

//Current Variables
var currentUser = {};
var currentBooking;
var currentBookingObj = {};
var currentBookingObject = {};
var currentAppState = {};
var appState = {};
var reselectingPickup = false;

//Selector variables
var people = [];
var star = [];
var lastPersonClicked = 0;
var lastStarSelected = 0;

//Watch location variables
var watchID = null;
var initialized = 0;

//Updating Map variables
var lastbrng = 0;
var trackingZoom = 0;
var currentPin = "cabpin0.png";

//Calendar trackers
var days = {track:0, label:"d", values:[]};
var months = {track:0, label:"m", values:["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]};
var years = {track:0, label:"y", values:["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]};
//var hailState;
//var geocodeRecieved = false;
//var taxiPosition = null;
//var viaList = [];
//var finaldestination = null;
//var bookingConfirmedFlag = false;
//var overlayEnabledFlag = true;
//var taxiScanFlag = true;

var currentPos = 
    {
      geometry: {
        location: {
          lat: 0,
          lng: 0                 
        }

      },

      formatted_address: ""

    };

var timeformatted = 
    {
      month: "",
      day: "",
      year: "",
      hours: "",
      mins: "",
      meridian: ""
    };

//Global variables
var GLOBAL_GESTURE_FINGERS_1 = {fingers: 1};
var GLOBAL_CONCAT_LENGTH = 35;
var GLOBAL_BASE_RATE = 40;
var GLOBAL_MIN_DIST = 25;
var GLOBAL_FEE_KM = 12.5;
var GLOBAL_FEE_MINUTES = 12.5;
var GLOBAL_FEE_DEVIATION = 0.15; 
var GLOBAL_PROVIDER_EMAIL = "TUTA";
var GLOBAL_MAX_RADIUS = 300;

//Need to be initialized
var CURRENT_EST_FEE = 0;


if (typeof(tuta) === "undefined") {
  tuta = {};
}

function initApp() {
  tuta.init();
}

/*=========================================================
      _   _           _       _       
     | | | |_ __   __| | __ _| |_ ___ 
     | | | | '_ \ / _` |/ _` | __/ _ \
     | |_| | |_) | (_| | (_| | ||  __/
      \___/| .__/ \__,_|\__,_|\__\___|
      __  _|_|                        
     |  \/  | __ _ _ __               
     | |\/| |/ _` | '_ \              
     | |  | | (_| | |_) |             
     |_|  |_|\__,_| .__/              
                  |_|                 
    =========================================================*/   
//UPDATEMAPFUNCTION
var oldbounds;
var newbounds = null;
function updateMap() {

  try{
    var pickupicon = "";
    var locationData = [];

    var bounds = frmMap.mapMain.getBounds();
    //#ifdef iphone
    frmMap.mapMain.locationData = [];
    bounds = frmMap.mapMain.getBounds();
    if(frmMap.mapMain.zoomLevel < 14)
      frmMap.mapMain.zoomLevel = frmMap.mapMain.zoomLevel;  
    //#endif

    if(driverArrived === false){
      pickupicon = "userpin" + tuta.bearing(userbearing) + ".png";

      if(overview.active === 1){
        locationData.push(
          {lat: "" + overview.lat + "", 
           lon: "" + overview.lng + "", 
           name:"Map Middle", 
           desc: "", 
           image : ""});

      }
      else if (bounds !== null && newbounds === null) {
        locationData.push(
          {lat: "" + bounds.center.lat + "", 
           lon: "" + bounds.center.lon + "", 
           name:"", 
           desc: "", 
           image : ""});     
      }

      //var count = 0;
      locationData.push(
        {lat: "" + currentPos.geometry.location.lat + "", 
         lon: "" + currentPos.geometry.location.lng + "", 
         name:"Pickup Location", 
         desc: "", 
         image : pickupicon});
    }

    if(nearbyDrivers.length > 0){
      tuta.driverBearing(nearbyDrivers[0].id, function(response){
        currentPin = response;
      });
      locationData.push(
        {lat: "" + nearbyDrivers[0].location.lat + "", 
         lon: "" + nearbyDrivers[0].location.lng + "", 
         name: nearbyDrivers[0].id, 
         desc: "", 
         image : currentPin});
    }

    if(client_state === 0) {
      for (var i = 0; i < driversNear.length; i++){
        var brng = "cabpin" + tuta.bearing(driversNear[i].location.bearing) + ".png";
        locationData.push(
          {
            lat: "" + driversNear[i].location.lat + "", 
            lon: "" + driversNear[i].location.lng + "", 
            name: driversNear[i].id, 
            desc: "", 
            image : brng
          });
      }
    }

    if(pickupPoint !== null) {
      locationData.push({
        lat: "" + pickupPoint.geometry.location.lat + "", 
        lon: "" + pickupPoint.geometry.location.lng + "", 
        name: "Pickup Location", 
        desc: "", 
        image : "pickupicon3.png" //CHANGE PICKUP ICON
      });
    }

    frmMap.mapMain.locationData = locationData;


  }
  catch(ex){
    //tuta.util.alert("UPDATE MAP ERROR", ex);

  }
  //frmMap.mapMain.navigateTo(0,false);
}

/*=========================================================*/ 

tuta.resetMap = function (){
  frmMap.flexNoPanning.setVisibility(false);
  nearbyDrivers = [];
  journeyComplete = false;
  awaitingConfirmation = true;
  driverArrived = false;
  frmMap.flexAdd.setVisibility(true);
  frmMap.flexChangeDest.setVisibility(true);
  frmMap.flexNoOfPeople.setVisibility(true);
  frmMap.mapMain.clear();
  initialLoad = true;
  trackingZoom = 0;
  client_state = 0;
  tripOnRoute = false;
  onJourney = 0;
  pickupPoint = null;
  try{
    frmMap.flexMapCenter.setVisibility(true);
  } catch (ex){

  }
};

tuta.menuToggle = function (time, bool){
  if(bool === true){
    frmMap.imgChsO.setVisibility(false);
    frmMap.flexDarken.setVisibility(false);
    kony.timer.schedule("chsC", function(){
      frmMap.imgChsC.setVisibility(true);
      frmMap["btnChs"]["height"] = "55dp";
    }, time, false);      
  }
  else{
    frmMap.imgChsC.setVisibility(false);
    frmMap.flexDarken.setVisibility(true);
    kony.timer.schedule("chsO", function(){
      frmMap.imgChsO.setVisibility(true);
      frmMap["btnChs"]["height"] = "100%";
    }, time, false);  
  }         
};

tuta.awaitConfirm = function(bookingID) {

  //TRY THE ENTIRE METHOD
  frmMap.flexAdd.setVisibility(false);
  frmMap.flexChangeDest.setVisibility(false);
  frmMap.flexNoOfPeople.setVisibility(false);
  frmMap.flexProgress.setVisibility(true);
  onJourney = 1;
  currentBooking = bookingID;
  yourBooking = bookingID;

  //Kony timer – checks evert 5 seconds for the booking (if there is one) , 
  //take the result and check the status value of the key status – 
  //when it changes to CONFIRMED, then hide the flex container again

  /*
    TODO-CODELAB
    ============
    Name: APPHOOK_1
    Reason: App states need to hook in here.
    - Set the app state to HAILING (2)
    - Store the current booking, app state and user in the kony store




  //Create an object for storage
  appState = {
    state_string: "HAILING",
    bookingID: currentBooking
  };*/

  //tuta.util.alert("Current Appstate to be stored", JSON.stringify(currentAppState));

  //Store the object in case of crash
  //tuta.appstate.setState(appState);


  inputBooking = { id : bookingID };
  //tuta.util.alert("Input Booking: " + bookingID);
  try{
    kony.timer.cancel("taxiHailTimer");
  }
  catch(ex){

  }

  kony.timer.schedule("taxiHailTimer", function(){
    //tuta.util.alert("Test 3", "Starting hailtimer");


    //Try make the booking
    try {
      application.service("userService").invokeOperation(
        "booking", {}, inputBooking,
        function(result) { 
          if (result.value[0].status ==="OnRoute")
          {
            //tuta.util.alert("Test 4", "There is a result");
            tripOnRoute = true;
            frmMap.flexNoPanning.setVisibility(true);
            frmMap.flexProgress.setVisibility(false);
            kony.timer.cancel("taxiHailTimer");

            //Store the actual booking
            currentBookingObj = result.value[0];

            //Start the route
            tuta.renderRouteAndDriver(result.value[0]);
            tuta.fetchDriverInfo(result.value[0].providerId);

            //Hide map center button
            try{
              frmMap.flexMapCenter.setVisibility(false);
            }
            catch(ex){
              //tuta.util.alert("Info", "Unable to remove the map centering button.");
            }

          }
          else if(result.value[0].status === "Cancelled"){
            if(result.value[0].providerId ==="NODRIVER"){
              kony.timer.cancel("taxiHailTimer");
              tuta.resetMap();
              frmMap.flexNoPanning.setVisibility(true);
              frmMap.flexProgress.setVisibility(false);
              tuta.animate.move(frmMap.flexNoDriversNear, 0, "", "10%", null);
            }
          }
        },
        function(error) { //The second function will always run if there is an error.
          //tuta.util.alert("Test 4", error);
        }
      );
    } catch (ex){
      //tuta.util.alert("The ultimate EXCEPTION :D", ex);
    }





  }, 3, true);




};

//Retrieves completed bookings that are
//assigned to the driver based
tuta.retrieveBookingsHistory = function(callback) {
  var input = {
    userid: currentUser.userName
  };

  try {
    application.service("driverService").invokeOperation(
      "bookingHistory", {}, input,
      function(results) {
        try {
          callback(results);
        } catch (ex) {

        }
      },
      function(error) {
        callback(null, error);
      });
  }
  catch(ex){

  }
};

tuta.cancelBooking = function(bookingID) {
  var input = {
    id: bookingID
  };
  try{
    application.service("driverService").invokeOperation(
      "cancelBooking", {}, input,
      function(results) {
        //tuta.util.alert("TEST", JSON.stringify(results));
        currentBooking = null;

      },
      function(error) {
        //tuta.util.alert("ERROR", error);
      });
  }
  catch (ex){

  }
};

tuta.renderFinalRoute = function(){

  try{
    tuta.animate.move(frmMap.imgSwipeLever, 0.3, "", "70%", null);
  } catch (ex){

  }

  //tuta.util.alert("Nearby Drivers", JSON.stringify(nearbyDrivers[0]));
  //tuta.util.alert("NearbyDrivers before route draw", nearbyDrivers[0]);
  //frmMap.mapMain.clear();
  //tuta.util.alert("Destination", destination.geometry.location.lat);
  kony.timer.schedule("swiperball", function(){
    awaitingConfirmation = false;

    frmMap["flexDarken"]["isVisible"] = false;
    try{
      frmMap.mapMain.removePolyline("polyid1");
    }catch (ex){

    }


    try {
      application.service("driverService").invokeOperation(
        "booking", {}, {id: yourBooking},
        function(result){
          //tuta.util.alert("Results", "Booking ID: " + yourBooking + "\nBooking Results: \n\n" + JSON.stringify(result));

          tuta.location.directionsFromCoordinates(nearbyDrivers[0].location.lat, nearbyDrivers[0].location.lng, destination.geometry.location.lat, destination.geometry.location.lng, function(response){

            kony.timer.schedule("renderDirFinal", function(){
              renderDirections(frmMap.mapMain, response, "0x0036bba7","","dropofficon.png");
              //tuta.util.alert("TEST 3", JSON.stringify(response));
              updateMap();
              kony.timer.schedule("zoomIn", function(){
                //#ifdef android
                frmMap.mapMain.zoomLevel = 18;
                //#endif

                //#ifdef iphone
                frmMap.mapMain.zoomLevel = 21;
                //#endif
              }, 3, false);
            }, 1, false);
          });




        }, function(error){
          //tuta.util.alert("Booking error", error);
        });
    } catch (ex) {
      // This is an internet service exception handler
    }
  }, 0.5, false);
};

tuta.driverBearing = function (driverID, callback){
  try {
    application.service("driverService").invokeOperation(
      "user", {}, {id : driverID},
      function(result){
        try{
          var brng = 0;
          brng = Math.abs(Math.round(result.value[0].location.direction / 15)) * 15; 

          if(brng >= 360)
            brng = 0;

          if(brng !== null && brng === brng){
            lastbrng = brng;
            callback("cabpin" + brng + ".png");
          }
          else
            callback("cabpin" + lastbrng + ".png");
        }
        catch (ex){
          callback("cabpin" + lastbrng + ".png");
        }

      }, function (error){
        tuta.util.alert("ERROR", error);
        callback("cabpin" + lastbrng + ".png");
      });
  } catch (ex) {
    // This is an internet service exception handler
  }
};

tuta.bearing = function (bearing){

  var brng = Math.abs(Math.round(bearing / 15)) * 15; 

  if(brng >= 360)
    brng = 0;

  if(brng !== null && brng === brng)
    return brng;

  return 0;

};

tuta.renderRouteAndDriver = function (booking){

  driver = booking.providerId;
  initialLoad = true;

  /*
    TODO-CODELAB
    ============
    Name: APPHOOK_2
    Reason: App states need to hook in here.
    - Set the app state to EN_ROUTE (3)
    - Store the current booking, app state and user in the kony store


  appState = {
    state_string: "EN_ROUTE",
    bookingID: currentBooking
  };

  //Store the object in case of crash
  tuta.appstate.setState(appState);*/
  try {
    application.service("driverService").invokeOperation(
      "user", {}, {id : driver},
      function(result) { 

        tuta.location.directionsFromCoordinates(result.value[0].location.lat, result.value[0].location.lng, booking.location.lat, booking.location.lng, function(response){

          kony.timer.schedule("renderDir", function(){
            renderDirections(frmMap.mapMain, response, "0x0036bba7","","");
            updateMap();
          }, 2, false);
        });

      },
      function(error) {
        //tuta.util.alert("Error " + error);
      }
    );
  } catch (ex) {
    // This is an internet service exception handler
  }

};

tuta.fetchDriverInfo = function(driverID){
  try {
    application.service("driverService").invokeOperation(
      "user", {}, {id: driverID}, 
      function(result){
        drivercell = result.value[0].userInfo.mobileNumber;
        frmMap.lblDriverName.text = result.value[0].userInfo.firstName + " " + result.value[0].userInfo.lastName;
        application.service("driverService").invokeOperation(
          "assignedVehicle", {}, {userId: driverID}, 
          function(res){
            frmMap.lblCar.text = res.value[0].make + " " + res.value[0].model;
            frmMap.lblReg.text = res.value[0].VRN + "";
            application.service("driverService").invokeOperation(
              "rating", {}, {userId: driverID}, 
              function(r){
                frmMap.lblRating.text = r.averageRating + "";
                tuta.animate.moveBottomLeft(frmMap.flexDriverInfo, 0.3, "0", "0", null);
                tuta.animate.moveBottomLeft(frmMap.flexCancel, 0.3, "105", "-5", null);
                tuta.animate.moveBottomRight(frmMap.flexPhone, 0.3, "105", "-5", null);
                tuta.trackDriverLoop(driverID);
              }, 
              function(e){}  
            );
          }, 
          function(err){}  
        );
      }, 
      function(error){}  
    );
  } catch (ex) {
    // This is an internet service exception handler
  }

};

tuta.fetchUser = function(id, callback){
  try {
    application.service("driverService").invokeOperation(
      "user", {}, {id: id}, 
      function(result){
        callback(result.value[0]);
      }, 
      function(error){}  
    );
  } catch (ex) {
    // This is an internet service exception handler
  }
};

tuta.updateBookingHistoryRating = function(bookingID, rating, callback){

  var input = { id: bookingID, user : "customer", rating : rating.toString() };

  try {
    application.service("manageService").invokeOperation(
      "bookingHistoryUpdateRating", {}, input,
      function(result) {
        callback();
      },
      function(error) {
        // the service returns 403 (Not Authorised) if credentials are wrong
      }
    );
  } catch (ex) {
    // This is an internet service exception handler
  }

};

tuta.awaitBookingHistoryCreation = function (bookingID, callback){
  var input = {id : bookingID};

  try{
    kony.timer.cancel("awaitBHC");
  } catch(ex){}

  kony.timer.schedule("awaitBHC", function(){
    application.service("driverService").invokeOperation(
      "bookingHistoryItem", {}, input,
      function(result) {
        callback();
      },
      function(error) {
        // the service returns 403 (Not Authorised) if credentials are wrong
      }
    );
  },2, true);
};

tuta.retrieveBooking = function(id, callback) {
  var input = {
    id: id,
  };

  try {
    application.service("driverService").invokeOperation(
      "booking", {}, input,
      function(results) {
        try {
          callback(results);
        } catch (ex) {

        }
      },
      function(error) {
        callback(null, error);
      });
  }
  catch(ex){

  }
};

tuta.startUpdateMapFunction = function(){
  try{
    kony.timer.cancel("updateMapSlow");
  }
  catch(ex){

  }
  kony.timer.schedule("updateMapSlow", function(){
    updateMap();
  }, 7, true);
};

tuta.stopUpdateMapFunction = function(){
  try{
    kony.timer.cancel("updateMapSlow");
  }
  catch(ex){

  }
}

tuta.userExists = function (response){
  try{
    if(response.value[0] !== [])
      return true;

  }
  catch(ex)
  {
    return false;
  }

  return false;
};

/*=========================================================
      ____       _                      
     |  _ \ _ __(_)_   _____ _ __       
     | | | | '__| \ \ / / _ \ '__|      
     | |_| | |  | |\ V /  __/ |         
     |____/|_|  |_| \_/ \___|_|         
     |_   _| __ __ _  ___| | _____ _ __ 
       | || '__/ _` |/ __| |/ / _ \ '__|
       | || | | (_| | (__|   <  __/ |   
       |_||_|  \__,_|\___|_|\_\___|_|   

    =========================================================*/  

tuta.trackDriverLoop = function (driverID){
  tuta.awaitDriverPickupConfirmation();
  try{
    kony.timer.cancel("trackdriverloop" + driverID);
  }
  catch(ex){

  }
  kony.timer.schedule("trackdriverloop" + driverID, function(){
    if(journeyComplete === false)
      tuta.trackDriver(driverID);
    else{
      kony.timer.cancel("trackdriverloop" + driverID);
      journeyComplete = true;      
    }

  }, 8, true);
};

tuta.trackDriver = function(driverID){

  //Store the driver ID as variable 'input' for query

  //tuta.util.alert("Input 1", "Driver ID sent through:\n" + driverID);

  var input = {
    id: driverID
  };

  //tuta.util.alert("Input 2", "Actual Input:\n" + JSON.stringify(input));

  //Query the server
  try {
    application.service("driverService").invokeOperation(
      "user", {}, input,
      function(result) { 


        nearbyDrivers = []; //clear the array of drivers

        driver = {
          id: result.value[0].id,
          location: {
            lat: result.value[0].location.lat,
            lng: result.value[0].location.lng
          }
        };



        nearbyDrivers[0] = driver;
        /*
        if (tripInTransitResume === true){
          tuta.renderFinalRoute();
          tripInTransitResume = false;
        }*/

        if(initialLoad === true){
          updateMap();
          initialLoad = false;
        }

        if(driverArrived === false && tripOnRoute === true){

          var lat1 = parseFloat(driver.location.lat);
          var lon1 = parseFloat(driver.location.lng);
          var lat2 = parseFloat(currentPos.geometry.location.lat);
          var lon2 = parseFloat(currentPos.geometry.location.lng);
          var distNow = tuta.location.distance(lat1, lon1, lat2, lon2);

          if(distNow < 500 && distNow > 200){
            tuta.animate.move(frmMap.flexArriving, 0.2, "65", "15%", null);
            tuta.animate.moveBottomLeft(frmMap.flexCancel, 0.1, "105", "-100", null);
          }
          else if (distNow <= 200){
            driverArrived = true;
            tuta.animate.moveBottomLeft(frmMap.flexCancel, 0, "105", "-100", null);
            tuta.animate.move(frmMap.flexArriving, 0, "65", "105%", null);
            tuta.animate.moveBottomRight(frmMap.flexPhone, 0, "105", "-100", null);
            frmMap.flexDarken.setVisibility(true);
            tuta.animate.move(frmMap.flexDriverArrived, 0, "", "10%", null);
          }        
        }
        else if (awaitingConfirmation === false)
        {
          var finallat1 = parseFloat(driver.location.lat);
          var finallon1 = parseFloat(driver.location.lng);
          var finallat2 = parseFloat(destination.geometry.location.lat);
          var finallon2 = parseFloat(destination.geometry.location.lng);
          var finaldistNow = tuta.location.distance(finallat1, finallon1, finallat2, finallon2);
          var etaNow = parseInt(Math.round(finaldistNow/1000));
          if(etaNow === 1)
            frmMap.lblMins.text = etaNow + " MIN";
          else
            frmMap.lblMins.text = etaNow + " MINS";

          //DEPRECIATED, checks if destination is near and then ends trip
          /* KEEP HERE FOR NOW
          if (finaldistNow <= 150){
            //ANIMATE IN NEARBY SLIDER

            frmMap.flexOverlay2.setVisibility(true);
            tuta.animate.moveBottomLeft(frmMap.flexTimeToDest, 0.1, "105", "-150", null);
            tuta.animate.moveBottomLeft(frmMap.flexDriverInfo, 0.1, "-110", "", null);
            journeyComplete = true;

          } */ 
        }
      },
      function(error) {
        //tuta.util.alert("Error " + error);
      }
    );
  } catch (ex) {
    // This is an internet service exception handler
  }
};


tuta.awaitDriverPickupConfirmation = function(){

  try{
    kony.timer.cancel("taxiAwaitTimer");
  }
  catch(ex){

  }


  kony.timer.schedule("taxiAwaitTimer", function(){

    try {
      application.service("driverService").invokeOperation(
        "booking", {}, {id : currentBooking},
        function(result) { 
          try{
            if (result.value[0].status==="InTransit"){

              /*
              TODO-CODELAB
              ============
              Name: APPHOOK_3
              Reason: App states need to hook in here.
              - Set the app state to IN_TRANSIT (4)
              - Store the current booking, app state and user in the kony store


              appState = {
                state_string: "INTRANSIT",
                bookingID: currentBooking
              };

              //Store the object in case of crash
              tuta.appstate.setState(appState);*/
              //tuta.util.alert("IN TRANSIT", "");
              tuta.awaitDriverDropOffConfirmation();
              overview.active = 0;   
              driverArrived = true;  
              kony.timer.cancel("taxiAwaitTimer");
              tuta.animate.moveBottomLeft(frmMap.flexCancel, 0, "105", "-100", null);
              tuta.animate.move(frmMap.flexArriving, 0, "65", "105%", null);
              tuta.animate.moveBottomRight(frmMap.flexPhone, 0, "105", "-100", null);
              tuta.animate.moveBottomLeft(frmMap.flexTimeToDest, 0.1, "105", "-5", null);
              tuta.animate.moveBottomLeft(frmMap.flexDriverInfo, 0.1, "0", "", null);
              if (tripInTransitResume === false){
                tuta.renderFinalRoute();
              }

            }
          }
          catch(ex){

          }
        },
        function(error) { 
          //tuta.util.alert("error",error);
        }
      );
    } catch (ex) {
      // This is an internet service exception handler
    }


  }, 3, true);

}

tuta.awaitDriverDropOffConfirmation = function(){

  try{
    kony.timer.cancel("tripCompleteAwaitTimer");
  }
  catch(ex){

  }

  kony.timer.schedule("tripCompleteAwaitTimer", function(){

    try {
      application.service("driverService").invokeOperation(
        "booking", {}, inputBooking,
        function(result) { 
          try{
            if (result.value[0].status==="Completed"){
              kony.timer.cancel("tripCompleteAwaitTimer");
              kony.timer.cancel("trackdriverloop");
              //tuta.util.alert("COMPLETE", "");


              /*
                TODO-CODELAB
                ============
                Name: APPHOOK_4
                Reason: App states need to hook in here.
                - Set the app state to IDLE (1)
                - Store the current booking, app state and user in the kony store


              var appState = {
                state_string: null,
                bookingID: null
              };

              //Store the object in case of crash
              tuta.appstate.clearState();*/

              //frmMap.mapMain.zoomLevel = overview.zoom;
              tuta.awaitBookingHistoryCreation(currentBooking, function(){
                tuta.animate.move(frmMap.flexOverlay2, 0, "0", "0", null);
                tuta.animate.moveBottomLeft(frmMap.flexTimeToDest, 0.1, "105", "-150", null);
                tuta.animate.moveBottomLeft(frmMap.flexDriverInfo, 0.1, "-110", "", null);
                journeyComplete = true;
              });
            }
          }
          catch(ex){

          }
        },
        function(error) { 
          //tuta.util.alert("error",error);
        }
      );
    } catch (ex) {
      // This is an internet service exception handler
    }

  }, 3, true);

}


/*=========================================================*/

tuta.initCallback = function(error) {
  setUpSwipes();
  application.login("techuser@ssa.co.za","T3chpassword", function(result,error) {
    if(error) ssa.util.alert("Login Error", error);  
    else
    {
      var input = null;

      input = kony.store.getItem("user");
      if (input !== null){
        try{
          application.service("userService").invokeOperation(
            "login", {}, JSON.parse(input),
            function(result) {
              currentUser.userName = JSON.parse(input).userName;
              initialAppLoad = false;

              tuta.appstate.helper.resumeFromState();
              //tuta.util.alert("Appstate Start", currentAppState);
              //tuta.location.loadPositionInit();

            },
            function(error) {
              // the service returns 403 (Not Authorised) if credentials are wrong
              // make IF statement to check for 403 error only
              input = kony.store.removeItem("user");
              initialAppLoad = false;

              tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0.2, "0%", "0", null);

            }
          );
        }
        catch (ex){
          tuta.util.alert("Error", ex);
        }
      }  
      else{
        initialAppLoad = false;
        tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0.2, "0%", "0", null);
      }
    }
  });
};

/*=========================================================
     __        __    _       _               
     \ \      / /_ _| |_ ___| |__            
      \ \ /\ / / _` | __/ __| '_ \           
       \ V  V / (_| | || (__| | | |          
      _ \_/\_/ \__,_|\__\___|_|_|_|          
     | |    ___   ___ __ _| |_(_) ___  _ __  
     | |   / _ \ / __/ _` | __| |/ _ \| '_ \ 
     | |__| (_) | (_| (_| | |_| | (_) | | | |
     |_____\___/ \___\__,_|\__|_|\___/|_| |_|

    =========================================================*/

//This is called evert time user's position changes
tuta.startWatchLocation = function(){
  tuta.startUpdateMapFunction();
  try{
    watchID = kony.store.getItem("watch");
    if(watchID === null){
      watchID = kony.location.watchPosition(
        function(position) {
          kony.store.removeItem("watch");
          kony.store.setItem("watch", watchID);
          currentPos.geometry.location.lat = position.coords.latitude;
          currentPos.geometry.location.lng =  position.coords.longitude;
          userbearing = position.coords.heading;
          //tuta.animate.rotate(frmMap.imgCurrentUser, 0.1, direction, null);
          try{
            tuta.location.updateLocationOnServer(position.coords.latitude, position.coords.longitude);
          }
          catch(ex){

          }
        },
        function (errorMsg) {
          //tuta.util.alert("ERROR", errorMsg);
        }, 

        { timeout: 35000, maximumAge: 5000, enableHighAccuracy : true }
      );


      initialized = 1;
    }
    else
    {
      kony.location.clearWatch(watchID);
      kony.store.removeItem("watch");
      watchID = null;
      tuta.startWatchLocation();
    }
  } catch (ex) {
    // This is an internet service exception handler
  }
};

/*===================================================================*/

// Should be called in the App init lifecycle event
// In Visualizer this should be call in the init event of the startup form
tuta.init = function() {
  // initialize form controllers
  new tuta.forms.frmSplash();
  new tuta.forms.frmAbout();
  new tuta.forms.frmConfirm();
  new tuta.forms.frmCreateAcc();
  new tuta.forms.frmHelp();
  new tuta.forms.frmLegal();
  new tuta.forms.frmMap();
  new tuta.forms.frmPayments();
  new tuta.forms.frmPromo();
  new tuta.forms.frmSelectedTrip();
  new tuta.forms.frmTrip();
  new tuta.forms.frmDebug();
  new tuta.forms.frmEditProfile();

  // initialize application
  application = new tuta.application(tuta.initCallback);

};