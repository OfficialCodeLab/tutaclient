if (typeof(tuta) === "undefined") {
  tuta = {};
}

tuta.map = {};

tuta.map.onLocationSelected = function (form) {
  if(confirmSearchMode === 0) // 0 means we are selecting dest
    destination = tuta.map.getSelectedAddress(form);
  else
    pickupPoint = tuta.map.getSelectedAddress(form);
};

tuta.map.getSelectedAddress = function(form) {
  // hide address list
  var selectedItem = form.segAddressList.selectedItems[0];
  tuta.animate.move(form.flexAddressList, 0, 5, "100%", null);

  return selectedItem;
};


//Handles entering addresses on the map form.
tuta.map.selectDest = function(form) {
  var add = "";
  if(searchModeConf === 0)
    add = form.txtDest.text;
  else
    add = form.txtPick.text;

  form.flexFindingDest.setVisibility(true);

  tuta.location.addressList(add, function(result) {
    form.flexFindingDest.setVisibility(false);
    if (result.status === "ZERO_RESULTS") {
      //form.txtDest.text = "";
    } else {
      tuta.animate.move(form.flexAddressList, 0, 5, "12.5%", null);
      form.segAddressList.widgetDataMap = {
        lblAddress: "formatted_address"
      };
      form.segAddressList.setData(result.results);

      //form.txtDest.text = "";
    }
  });
};

function selectPickUpLocation() {
  searchMode = 1;
  tuta.animate.move(frmMap.flexAdd, 0.3, frmMap.flexAdd.top, "0%", null);
  try{
    kony.timer.cancel("focusPick");
  }
  catch(ex){}

  try{
    kony.timer.schedule("focusPick", function(){frmMap.txtPick.setFocus(true);}, 0.6, false);
  }
  catch(ex){}
}

function selectDest(form) {
  var add = "";
  if(searchMode === 0)
    add = frmMap.txtDest.text;
  else
    add = frmMap.txtPick.text;

  tuta.location.addressList(add, function(result) {
    //ssa.mobile.alert("RES", JSON.stringify(result));
    frmMap.flexFindingDest.setVisibility(false);
    if(result.status === "ZERO_RESULTS")
    {
      popNoResults.show();
      frmMap.txtDest.text = "";
      frmMap.txtPick.text = "";
    }
    else{
      tuta.animate.move(frmMap.flexAddressMain, 0, "12%", "0%", null);
      //frmMap.flexAddressShadow.setVisibility(true);
      frmMap.segAddressList.widgetDataMap = { lblAddress : "formatted_address"};  
      frmMap.segAddressList.setData(result.results);
      frmMap.txtDest.text = "";
      frmMap.txtPick.text = "";
    }
  });
}

function getSelectedAddress() {
  // hide address list
  var selectedItem = frmMap.segAddressList.selectedItems[0];
  tuta.animate.move(frmMap.flexAddressMain, 0, "12%", "100%", null);
  kony.timer.schedule("showMarker", function(){frmMap["flexChangeDest"]["isVisible"] = true;}, 0.3, false);

  return selectedItem;
}

function shortenText (str, len){
  var newStr = "";
  if(str.length > len)
    newStr = str.substring(0, (len-1)) + "...";

  return newStr;
}

function loadTripHistory(selected){
  frmSelectedTrip.lblPickup.text = shortenText ("32 Woodlands Drive, 2191, South Africa", GLOBAL_CONCAT_LENGTH);
  frmSelectedTrip.lblDropoff.text = shortenText( "21 Ebury Ave Bryanston, 2191, South Africa", GLOBAL_CONCAT_LENGTH);
}

function resetSearchBar() {
  frmMap.txtPick.text = "";
  frmMap.txtDest.text = "";
  frmMap.Image066d5e18d311e4b.setVisibility(false);
  frmMap.CopyImage0943e5358a1de41.setVisibility(false);
  tuta.animate.move(frmMap.flexAdd, 0.3, frmMap.flexAdd.top, "-100%", null);
}

function clearDestPick(){
  frmMap.txtDest.text = "";
  frmMap.txtPick.text = "";
  frmMap.Image066d5e18d311e4b.setVisibility(false);
  frmMap.CopyImage0943e5358a1de41.setVisibility(false);
  tuta.animate.move(frmMap.flexAddressMain, 0, "12%", "100%", null);
  frmMap.flexChangeDest.setVisibility(true);
}


function onLocationSelected() {
  // Search mode 0 means we have a destination
  if(searchMode === 0) {
    destination = getSelectedAddress();
    //deselectAllOptions();
    frmConfirm.lblDestination.text = shortenText (destination.formatted_address.replace(/`+/g,""), GLOBAL_CONCAT_LENGTH);
    tuta.animate.move(frmMap.flexAddressMain, 0, "12%", "100%", null);
    var bounds = frmMap.mapMain.getBounds();
    tuta.location.geoCode(bounds.center.lat, bounds.center.lon, function(success, error){
      pickupPoint = success.results[0];
      frmConfirm.lblPickUpLocation.text = shortenText (success.results[0].formatted_address.replace(/`+/g,""), GLOBAL_CONCAT_LENGTH);
      tuta.forms.frmConfirm.show();  
      tuta.map.calculateTripDetails(true);
    });
  } else {
    pickupPoint = getSelectedAddress();
    setPickupPoint(pickupPoint);
    searchMode = 0;

  }
}

function reselectPickupCheck(){
  if(reselectingPickup){
    reselectingPickup = false;
    frmMap["flexChangeDest"]["isVisible"] = false;
    frmMap["flexFindingDest"]["isVisible"] = true;
    try{
      kony.timer.cancel("showNewLocation");
    } catch(ex){}

    kony.timer.schedule("showNewLocation", function(){
      frmConfirm.lblPickUpLocation.text = shortenText (pickupPoint.formatted_address.replace(/`+/g,""), GLOBAL_CONCAT_LENGTH);
      frmMap["flexChangeDest"]["isVisible"] = true;
      frmMap["flexFindingDest"]["isVisible"] = false;
      tuta.forms.frmConfirm.show();  
      tuta.map.calculatePickupTime(pickupPoint.geometry.location.lat, pickupPoint.geometry.location.lng, function(){
        if(pickupTime !== null)
          frmConfirm.lblPickupTime.text = "PICKUP TIME IS IN APPROXIMATELY " + pickupTime + " MINS";    
        else
          frmConfirm.lblPickupTime.text = "NO DRIVERS NEARBY";
      });
      //TODO : call method to calculate new duration and cost

    }, 2, false);
  }
}
function setPickupPoint(pickupPoint) {
  resetSearchBar();

  try{
    kony.timer.cancel("waitForMapUpdate");
  } catch (ex){

  }

  var loc = {lat:pickupPoint.geometry.location.lat,lng:pickupPoint.geometry.location.lng};
  tuta.map.navigateTo(loc);
}  

function hideSearchBar() {
  frmMap.flexAddress.setVisibility(false);
  frmMap.flexShadow.setVisibility(false);
  frmMap.flexNoOfPeople.setVisibility(false);
}

function showSearchBar() {
  frmMap.flexAddress.setVisibility(true);
  frmMap.flexShadow.setVisibility(true);
  frmMap.flexNoOfPeople.setVisibility(true); 
}

function estimateTripCost (locationA, locationB, callback){
  //var dist = tuta.location.distance(locationA.lat, locationA.lng, locationB.lat, locationB.lng);
  var matrixDist = tuta.location.distanceMatrix(locationA, locationB, function(response){
    var dist = response[0].elements[0].distance.value;
    var averageCost = (dist/1000)*GLOBAL_FEE_KM + GLOBAL_BASE_RATE;
    var minCost = Math.round(averageCost-(averageCost*GLOBAL_FEE_DEVIATION));
    var maxCost = Math.round(averageCost+(averageCost*GLOBAL_FEE_DEVIATION));
    callback(minCost, maxCost); 
  }, 1);  
}


var mapCenter = {
  location: 
  {
    lat: 0.0, 
    lon: 0.0
  }
};


tuta.map.storeCenter = function (bounds){
  try{
    mapCenter.location.lat = bounds.center.lat;
    mapCenter.location.lon = bounds.center.lon; 
  } 
  catch(ex){}
};


// Checks if the point in current bounds is far enough away from the old center
// Returns true if test is pasased, else false
tuta.map.checkRadius = function (bounds){
  try{
    /*TODO FUTURE:
      - USE LATSPAN TO DETERMINE THE MAX RADIUS
      - LATSPAN IS IN THE BOUNDS OBJECT
      */
    var distance = tuta.location.distance(mapCenter.location.lat, mapCenter.location.lon, bounds.center.lat, bounds.center.lon);
    if(distance >= GLOBAL_MAX_RADIUS){
      tuta.map.storeCenter(bounds);
      return true;
    }
  }
  catch(ex){}

  return false;
};

var timeStill = 0;
var hasStartedLoading = true;
var hasMovedBack = false;
var hasLoaded = false;
var initialTaxiLoad = true;
tuta.map.startMapListener = function (){
  try {
    kony.timer.cancel("MapListener");
  }
  catch(ex){

  }
  hasLoaded = false;
  kony.timer.schedule("MapListener", function(){
    var bounds = frmMap.mapMain.getBounds();
    if(tuta.map.checkRadius(bounds)){
      //tuta.util.alert("MOVED");
      //if(!hasMovedAway){
      //frmMap.lblChangePick.text = "Change pickup location";
      hasLoaded = false;
      hasStartedLoading = true;
      //tuta.animate.move(frmMap.flexHeader, 0.2, "-8%", "", null);
      //tuta.animate.move(frmMap.flexAdd, 0.2, "1%", frmMap.flexAdd.left, null);
      //tuta.animate.moveBottomLeft(frmMap.flexNoOfPeople, 0.2, "-12%", "", null);
      //tuta.animate.moveBottomRight(frmMap.flexMapCenter, 0.2, "100dp", "-75dp", null);
      //hasMovedAway = true;   
      // hasMovedBack = false;
      // }
      timeStill = 0;


      //TODO: Calculate time from nearest driver
    }
    else{
      //tuta.util.alert("DIDN'T MOVE");
      timeStill++;
      if(hasStartedLoading){
        tuta.events.startLoadingCircle();
        hasStartedLoading = false;
        frmMap.rtClosest.text = ""; 
      }

      /*
        if(timeStill >= 6 && !hasMovedBack){
          tuta.animate.move(frmMap.flexHeader, 0.2, "0%", "", null);
          tuta.animate.move(frmMap.flexAdd, 0.2, "12%", frmMap.flexAdd.left, null);
          tuta.animate.moveBottomLeft(frmMap.flexNoOfPeople, 0.2, "0%", "", null);
          tuta.animate.moveBottomRight(frmMap.flexMapCenter, 0.2, "100dp", "-10dp", null);  
          hasMovedBack = true;
          hasMovedAway = false;
        } */    

      if(timeStill >= 4){
        timeStill = 0;
        if (hasLoaded === false){
          hasLoaded = true;
          var position = { 
            lat: mapCenter.location.lat,
            lng: mapCenter.location.lon
          };
          tuta.events.getNearestDrivers(position, function(drivers, position){
            tuta.events.calculateWaitTime(drivers, position, function(time){
              if(initialTaxiLoad)
              {
                initialTaxiLoad = false;
                tuta.animate.move(frmMap.flexAdd, 0.15, "12%", "-100%", null);
              }
              //tuta.util.alert("Wait Time", Math.round(time/60) + " mins");
              var mins = Math.round(time/60);
              if(mins > 40 || mins === 0){
                frmMap.lblChangePick.text = "No taxis available";
                pickupTime = null;
                frmMap.rtClosest.text = ""; 
                tuta.events.stopLoadingCircle();
              }
              else{
                tuta.events.stopLoadingCircle();
                frmMap.lblChangePick.text = "Change pickup location";
                pickupTime = Math.round(time/60);
                frmMap.rtClosest.text = pickupTime + "<br>min";                
              }
            });
          });

        }

      }

    }
  }, 0.5, true);
};
tuta.map.stopMapListener = function (){
  try {
    kony.timer.cancel("MapListener");
  } catch(ex){
    console.log(ex);
  }

  try {
    kony.timer.cancel("updateMapBounds");
  } catch(ex){

  }
};

tuta.map.calculatePickupTime = function (lat, lng, callback) {
  var position = { 
    lat: lat,
    lng: lng
  };
  tuta.events.getNearestDrivers(position, function(drivers, position){
    tuta.events.calculateWaitTime(drivers, position, function(time){
      var mins = Math.round(time/60);
      if(mins > 40 || mins === 0){
        pickupTime = null;
        callback();
      }
      else{
        pickupTime = Math.round(time/60); 
        callback();           
      }
    });
  });
};

tuta.map.calculateTripDetails = function(bool) {
  var tempTripDistance = 0;
  var tempTripTime = 0;
  var tempTripCost = 0;
  var locA;
  var locB;

  //Calculate the distance between the pickup position and destination location
  try {
    tuta.location.directionsFromCoordinates(pickupPoint.geometry.location.lat, pickupPoint.geometry.location.lng, destination.geometry.location.lat,destination.geometry.location.lng, function(response){
      routeObj.full_route = response;
      routeObj.distance_matrix = response.routes[0].legs[0].distance.value;
      routeObj.duration = response.routes[0].legs[0].duration.value;
      try{
        routeObj.duration_in_traffic = response.routes[0].legs[0].duration_in_traffic.value;
      } catch(e){
        routeObj.duration_in_traffic = null;
      }
      //TODO: Calculate time based on destination location, 1.2 mins per km
      if(routeObj.duration_in_traffic !== null)
        tempTripTime = Math.round(routeObj.duration_in_traffic/60);
      else
        tempTripTime = Math.round(routeObj.duration/60);

      if (tempTripTime < 2){
        frmConfirm.lblDuration.text = tempTripTime + " Minute";
      }
      else{
        frmConfirm.lblDuration.text = tempTripTime + " Minutes";
      }

      tempTripDistance = Math.round(routeObj.distance_matrix/1000);
      frmConfirm.lblTripDist.text = tempTripDistance + " KM";
      tempTripCost = Math.round(tempTripDistance * (GLOBAL_FEE_KM * 1.05) + GLOBAL_BASE_RATE);
      frmConfirm.lblCost.text = "R" + tempTripCost;
    });
  } catch (ex) {
    // This is an internet service exception handler
  }

  if(pickupTime !== null)
    frmConfirm.lblPickupTime.text = "PICKUP TIME IS IN APPROXIMATELY " + pickupTime + " MINS";    
  else
    frmConfirm.lblPickupTime.text = "NO DRIVERS NEARBY";    
  //frmConfirm.lblDuration = 30 + " MIN";
  /*
  locA = [{
    lat: pickupPoint.geometry.location.lat,
    lon: pickupPoint.geometry.location.lng
  }];

  locB = [{
    lat: destination.geometry.location.lat,
    lon: destination.geometry.location.lng          
  }];
  try{
    
    estimateTripCost(locA, locB, function(minCost, maxCost){
      frmConfirm.lblCost.text = "R" + (minCost + maxCost)/2;          
    });
  }
  catch(ex)
  {
    //tuta.util.alert("Distance", "Something went wrong calculating the distance.\n\n" + ex);
  }*/
};

//locationData = {lat:pickupPoint.geometry.location.lat,lon:pickupPoint.geometry.location.lng,name: "",desc: ""};
// LOCATION : { lat: <value>, lng: <value>}
tuta.map.navigateTo = function (location){
  tuta.stopUpdateMapFunction();
  try{
    kony.timer.cancel("startMapUpdaterNavigateTo");
  } catch(ex){}

  var zoomlvl = 18;
  //#ifdef android
  frmMap.mapMain.zoomLevel = zoomlvl;
  //#endif
  var locationData = {lat:location.lat,lon:location.lng,name: "",desc: ""};
  frmMap.mapMain.navigateToLocation(locationData, false, false);

  try{
    kony.timer.schedule("startMapUpdaterNavigateTo", function(){
      updateMap();
      tuta.startUpdateMapFunction();

      //#ifdef iphone
      try{
        kony.timer.schedule("startMapUpdaterNavigateTo", function(){
          frmMap.mapMain.zoomLevel = zoomlvl;
        }, 0.2, false);

      } catch(e){}
      //#endif
    }, 2, false);
  }
  catch(ex){

  }


};

/*
var tempTripDistance = 0;
    //Calculate the distance between the current position and destination location
    try{
      tempTripDistance = tuta.location.distance(currentPos.geometry.location.lat,currentPos.geometry.location.lng,destination.geometry.location.lat,destination.geometry.location.lng)/1000;
    }
    catch (ex){
      tuta.util.alert("Unable to calculate distance", ex);
    }


    //TODO: Calculate time based on destination location, 1.2 mins per km
    var tempTripTime = Math.round(tempTripDistance * 1.4) + 2;
    //TODO: Update the text field with the correct data
    if (tempTripTime < 2){
      frmConfirm.lblDuration.text = tempTripTime + " Minute";
    }
    else{
      frmConfirm.lblDuration.text = tempTripTime + " Minutes";
    }

    //updateConfirmForm();
    resetSearchBar();
    frmMap.flexAddressList.setVisibility(false);
    frmMap.flexAddressShadow.setVisibility(false);
    tuta.forms.frmConfirm.show();



    //REPLACE 30 WITH DISTANCE TO TRAVEL
    frmConfirm.lblCost = "R" + Math.round(taxiRate(30));
    //frmConfirm.lblDuration = 30 + " MIN";

    try{
      //Store co-ordinates for distance calculation
      var locA = [{
        lat: currentPos.geometry.location.lat,
        lon: currentPos.geometry.location.lng
      }];

      var locB = [{
        lat: destination.geometry.location.lat,
        lon: destination.geometry.location.lng          
      }];

      estimateTripCost(locA, locB, function(minCost, maxCost){
        frmConfirm.lblCost.text = "R" + minCost + " - R" + maxCost;          
      });
    }
    catch(ex)
    {
      tuta.util.alert("Distance", "Something went wrong calculating the distance.\n\n" + ex);
    }
*/