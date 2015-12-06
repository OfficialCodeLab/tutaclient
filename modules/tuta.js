// global reference to app object
var application = null; 

//App state flags
var searchMode = 0;
var sliderDir = 2;
var journeyComplete = false;
var driverArrived = false;
var awaitingConfirmation = true;
var tripOnRoute = false;
var hailingTaxi = false; //Used to prevent multiple requests
var onJourney = 0;

//Location variables
var destination = null;
var pickupPoint = null;
var nearbyDrivers = [];
var initialLoad = true;
var finalroute = null;
var taxiRoute = null;
var country = null;

//Booking variables
var inputBooking;
var yourBooking;
var drivercell;

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


if (typeof(tuta) === "undefined") {
  tuta = {};
}

function initApp() {
  tuta.init();
}

/*
function sliderMove(){   
  if(frmConfirm.sliderBook.selectedValue > 65 && sliderDir === 2){
    showLater();    
  }
  else if (frmConfirm.sliderBook.selectedValue < 45 && sliderDir === 1){    
    showNow();
  }
  else if(sliderDir !== 0 )
  {      
  }  
}*/

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

    if(overview.active === 1){
      locationData.push(
        {lat: "" + overview.lat + "", 
         lon: "" + overview.lng + "", 
         name:"Map Middle", 
         desc: "", 
         image : ""});

      pickupicon = "pickupicon.png";
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
       image : "pickupicon.png"});
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

  frmMap.mapMain.locationData = locationData;
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
  tripOnRoute = false;
  onJourney = 0;
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

  frmMap.flexAdd.setVisibility(false);
  frmMap.flexChangeDest.setVisibility(false);
  frmMap.flexNoOfPeople.setVisibility(false);
  frmMap.flexProgress.setVisibility(true);
  onJourney = 1;
  //Kony timer – checks evert 5 seconds for the booking (if there is one) , 
  //take the result and check the status value of the key status – 
  //when it changes to CONFIRMED, then hide the flex container again
  inputBooking = { id : bookingID };
  try{
    kony.timer.cancel("taxiHailTimer");
  }
  catch(ex){

  }

  kony.timer.schedule("taxiHailTimer", function(){

    application.service("userService").invokeOperation(
      "booking", {}, inputBooking,
      function(result) { //This is the default function that runs if the query is succesful, if there is a result.
        if (result.value[0].status ==="OnRoute")
        {
          tripOnRoute = true;
          frmMap.flexNoPanning.setVisibility(true);
          frmMap.flexProgress.setVisibility(false);
          kony.timer.cancel("taxiHailTimer");
          tuta.renderRouteAndDriver(result.value[0]);
          tuta.fetchDriverInfo(result.value[0].providerId);
          yourBooking = bookingID;

        }
      },
      function(error) { //The second function will always run if there is an error.
        //tuta.util.alert("error",error);
      }
    );

  }, 3, true);
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
  tuta.animate.move(frmMap.imgSwipeLever, 0.3, "", "70%", null);
  kony.timer.schedule("swiperball", function(){
    awaitingConfirmation = false;

    frmMap["flexDarken"]["isVisible"] = false;
    frmMap.mapMain.removePolyline("polyid1");
    application.service("driverService").invokeOperation(
      "booking", {}, {id: yourBooking},
      function(result){
        tuta.location.directionsFromCoordinates(nearbyDrivers[0].location.lat, nearbyDrivers[0].location.lng, destination.geometry.location.lat, destination.geometry.location.lng, function(response){

          kony.timer.schedule("renderDirFinal", function(){
            renderDirections(frmMap.mapMain, response, "0x0036bba7","","dropofficon.png");
            updateMap();
            kony.timer.schedule("zoomIn", function(){
              //#ifdef android
              frmMap.mapMain.zoomLevel = 19;
              //#endif
              
              //#ifdef iphone
              frmMap.mapMain.zoomLevel = 21;
              //#endif
            }, 3, false);
          }, 1, false);
        });

      }, function(error){

      });
  }, 0.5, false);
};

tuta.driverBearing = function (driverID, callback){
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
};


tuta.renderRouteAndDriver = function (booking){
  
  var driver = booking.providerId;
  initialLoad = true;
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

};

tuta.fetchDriverInfo = function(driverID){
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
  var input = {
    id: driverID
  };

  //Query the server
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
};


tuta.awaitDriverPickupConfirmation = function(){

  try{
    kony.timer.cancel("taxiAwaitTimer");
  }
  catch(ex){

  }

  kony.timer.schedule("taxiAwaitTimer", function(){


    application.service("driverService").invokeOperation(
      "booking", {}, inputBooking,
      function(result) { 
        try{
          if (result.value[0].status==="InTransit"){
            tuta.awaitDriverDropOffConfirmation();
            overview.active = 0;   
            driverArrived = true;  
            kony.timer.cancel("taxiAwaitTimer");
            tuta.animate.moveBottomLeft(frmMap.flexCancel, 0, "105", "-100", null);
            tuta.animate.move(frmMap.flexArriving, 0, "65", "105%", null);
            tuta.animate.moveBottomRight(frmMap.flexPhone, 0, "105", "-100", null);
            tuta.animate.moveBottomLeft(frmMap.flexTimeToDest, 0.1, "105", "-5", null);
            tuta.renderFinalRoute();
          }
        }
        catch(ex){

        }
      },
      function(error) { 
        //tuta.util.alert("error",error);
      }
    );


  }, 3, true);

}

tuta.awaitDriverDropOffConfirmation = function(){

  try{
    kony.timer.cancel("tripCompleteAwaitTimer");
  }
  catch(ex){

  }

  kony.timer.schedule("tripCompleteAwaitTimer", function(){


    application.service("driverService").invokeOperation(
      "booking", {}, inputBooking,
      function(result) { 
        try{
          if (result.value[0].status==="Completed"){
            kony.timer.cancel("tripCompleteAwaitTimer");
            kony.timer.cancel("trackdriverloop");
            //frmMap.mapMain.zoomLevel = overview.zoom;
            tuta.animate.move(frmMap.flexOverlay2, 0, "0", "0", null);
            tuta.animate.moveBottomLeft(frmMap.flexTimeToDest, 0.1, "105", "-150", null);
            tuta.animate.moveBottomLeft(frmMap.flexDriverInfo, 0.1, "-110", "", null);
            journeyComplete = true;
          }
        }
        catch(ex){

        }
      },
      function(error) { 
        //tuta.util.alert("error",error);
      }
    );


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
          tuta.location.loadPositionInit();
          application.service("userService").invokeOperation(
            "login", {}, JSON.parse(input),
            function(result) {
              //tuta.location.loadPositionInit();
              tuta.forms.frmMap.show();
              //kony.timer.schedule("startwatch", function(){tuta.startWatchLocation();}, 2, false);
            },
            function(error) {
              // the service returns 403 (Not Authorised) if credentials are wrong
              // make IF statement to check for 403 error only
              input = kony.store.removeItem("user");
              tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0.2, "0%", "0", null);

            }
          );
        }
        catch (ex){
          tuta.util.alert("Error", ex);
        }
      }  
      else{
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
  }
  catch(ex){
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

  // initialize application
  application = new tuta.application(tuta.initCallback);

};