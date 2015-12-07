
function selectPickUpLocation() {
  searchMode = 1;
  tuta.animate.move(frmMap.flexAdd, 0.3, "70", "0%", null);
  kony.timer.schedule("focusPick", function(){frmMap.txtPick.setFocus(true);}, 0.4, false);
}

function selectDest(form) {
  var add = "";
  if(searchMode == 0)
    add = frmMap.txtDest.text;
  else
    add = frmMap.txtPick.text;

  findAddress(add, function(result) {
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
  tuta.animate.move(frmMap.flexAdd, 0.3, "70", "-100%", null);
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

      //updateConfirmForm();
      resetSearchBar();
      frmMap.flexAddressList.setVisibility(false);
      frmMap.flexAddressShadow.setVisibility(false);
      tuta.forms.frmConfirm.show();

      //REPLACE 30 WITH DISTANCE TO TRAVEL
      frmConfirm.lblCost = "R" + Math.round(taxiRate(30));
      frmConfirm.lblDuration = 30 + " MIN";

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
