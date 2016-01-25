if (typeof(tuta) === "undefined") {
  tuta = {};
}

tuta.map = {};

function selectPickUpLocation() {
  searchMode = 1;
  tuta.animate.move(frmMap.flexAdd, 0.3, frmMap.flexAdd.top, "0%", null);
  try{
    kony.timer.schedule("focusPick", function(){frmMap.txtPick.setFocus(true);}, 0.4, false);
  }
  catch(ex){}
}

function selectDest(form) {
  var add = "";
  if(searchMode == 0)
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
      frmMap.flexAddressList.setVisibility(true);
      frmMap.flexAddressShadow.setVisibility(true);
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
  frmMap.flexAddressList.setVisibility(false);
  frmMap.flexAddressShadow.setVisibility(false);
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
  tuta.animate.move(frmMap.flexAdd, 0.3, frmMap.flexAdd.top, "-100%", null);
}

function clearDestPick(){
  frmMap.txtDest.text = "";
  frmMap.txtPick.text = "";
  frmMap.flexAddressList.setVisibility(false);
  frmMap.flexAddressShadow.setVisibility(false);
  frmMap.flexChangeDest.setVisibility(true);
}


function onLocationSelected() {
  // Search mode 0 means we have a destination
  if(searchMode == 0) {
    destination = getSelectedAddress();
    //deselectAllOptions();
    frmConfirm.lblDestination.text = shortenText (destination.formatted_address.replace(/`+/g,""), GLOBAL_CONCAT_LENGTH);
    tuta.location.geoCode(currentPos.geometry.location.lat, currentPos.geometry.location.lng, function(success, error){
      frmConfirm.lblPickUpLocation.text = shortenText (success.results[0].formatted_address.replace(/`+/g,""), GLOBAL_CONCAT_LENGTH);

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

    });
  } else {
    pickupPoint = getSelectedAddress();
    frmMap.mapMain.navigateToLocation({ "lat" : pickupPoint.geometry.location.lat, "lon": pickupPoint.geometry.location.lng, name:"", desc: ""},false,false);
    resetSearchBar();
    //updateMap();
    searchMode = 0;

  }
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
    if(mapCenter.location.lat !== bounds.center.lat || mapCenter.location.lon !== bounds.center.lon){
      tuta.map.storeCenter(bounds);
      return true;
    }
  }
  catch(ex){}

  return false;
};

var timeStill = 0;
tuta.map.startMapListener = function (){
  try {
    kony.timer.cancel("MapListener");
  }
  catch(ex){

  }

  var hasMovedAway = false;
  var hasMovedBack = false;
  var hasLoaded = false;
  kony.timer.schedule("MapListener", function(){
    var bounds = frmMap.mapMain.getBounds();
    if(tuta.map.checkRadius(bounds)){
      //tuta.util.alert("MOVED");
      //if(!hasMovedAway){
        //frmMap.lblChangePick.text = "Change pickup location";
        hasLoaded = false;
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

      /*
      if(timeStill >= 6 && !hasMovedBack){
        tuta.animate.move(frmMap.flexHeader, 0.2, "0%", "", null);
        tuta.animate.move(frmMap.flexAdd, 0.2, "12%", frmMap.flexAdd.left, null);
        tuta.animate.moveBottomLeft(frmMap.flexNoOfPeople, 0.2, "0%", "", null);
        tuta.animate.moveBottomRight(frmMap.flexMapCenter, 0.2, "100dp", "-10dp", null);  
        hasMovedBack = true;
        hasMovedAway = false;
      } */    

      if(timeStill >= 2){
        timeStill = 0;
        if (hasLoaded === false){
          hasLoaded = true;
          var position = { 
            lat: mapCenter.location.lat,
            lng: mapCenter.location.lon
          };
          tuta.events.getNearestDrivers(position, function(drivers, position){
            tuta.events.calculateWaitTime(drivers, position, function(time){
              //tuta.util.alert("Wait Time", Math.round(time/60) + " mins");
              var mins = Math.round(time/60);
              if(mins > 40 || mins === 0){
                frmMap.lblChangePick.text = "No taxis available";
                frmMap.rtClosest.text = ""; 
              }
              else{
                frmMap.lblChangePick.text = "Change pickup location";
                frmMap.rtClosest.text = Math.round(time/60) + "<br>min";                
              }
            });
          });

        }

      }

    }
  }, 1, true);
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