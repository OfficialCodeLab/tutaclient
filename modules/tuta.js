// setup inital events

var people = [];
var star = [];
var hailState;
var geocodeRecieved = false;
var trackingZoom = 0;
var lastbrng = 0;


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

var searchMode = 0;
/*
        These will hold geocoding data
    */
var destination = null;
var pickupPoint = null;
var taxiPosition = null;
var viaList = [];
var tripOnRoute = false;

//Carl's Varibles
var hailingTaxi = false; //Used to prevent multiple requests
var bookingConfirmedFlag = false;
var overlayEnabledFlag = true;
var taxiScanFlag = true;

var timeformatted = 
    {
      month: "",
      day: "",
      year: "",
      hours: "",
      mins: "",
      meridian: ""
    };

var GLOBAL_CONCAT_LENGTH = 35;

if (typeof(tuta) === "undefined") {
  tuta = {};
}

// global reference to your app object
var application = null; 

function initApp() {
  //ssa.util.alert("INIT");
  tuta.init();
}

var lastPersonClicked = 0;
function onPeopleSelect(eventobject, x , y) {
  var nopeople = eventobject.id.replace("btnPerson","");
  if(nopeople === lastPersonClicked && nopeople > 1)
  {
    nopeople--;
    lastPersonClicked = 0;
  }
  else
    lastPersonClicked = nopeople;

  for(var i = 0; i < nopeople; i++) {
    people[i].src = "personselected.png";
  }
  for(var j = nopeople; j < 6; j++) {
    people[j].src = "person.png";
  }
}

var lastStarSelected = 0;
function onStarSelect(eventobject, x , y) {
  var nostar = eventobject.id.replace("imgStar","");
  if(nostar === lastStarSelected && nostar > 1)
  {
    nostar--;
    lastStarSelected = 0;
  }
  else
    lastStarSelected = nostar;

  for(var i =0; i < nostar; i++) {
    star[i].src = "starselected.png";
  }
  for(var j = nostar; j < 5; j++) {
    star[j].src = "starunselected.png";
  }
}

function uMap()
{
  if(hailState == true) 
    updateMap();
}
/*
    var animationSelected = kony.ui.createAnimation({"100":{"anchorPoint":{"x":0.5,"y":0.5},"stepConfig":{"timingFunction":kony.anim.EASIN_IN_OUT},"width":"100dp","height":"100dp"}});
    var animationDeselect = kony.ui.createAnimation({"100":{"anchorPoint":{"x":0.5,"y":0.5},"stepConfig":{"timingFunction":kony.anim.EASIN_IN_OUT},"width":"80dp","height":"80dp"}});
    */


function fixHours(){ 
  var txt = parseInt(frmConfirm.txtTimeHrs.text, 10);
  if (txt == txt){ //Checking for NaN
    if(txt <= 0){
      txt = 12;
    }
    else if (txt > 12 && txt < 24){
      txt -= 12;
      frmConfirm.lblAmPm.text = "PM";
    }  
    else if (txt > 24){
      txt = 12;
      if(frmConfirm.lblAmPm.text == "AM")
        frmConfirm.lblAmPm.text = "PM";      
    }

  }
  else
  {        
    frmConfirm.txtTimeHrs.text = "";
    return;
  }

  //frmConfirm.txtTimeHrs.text = txt;

  frmConfirm.txtTimeHrs.text = Math.round(txt) + "";

  //frmConfirm.txtTimeHrs.onTextChange = fixHours;
}

function fixMins(){
  var txt = parseInt(frmConfirm.txtTimeMins.text, 10);

  if(txt == txt){ 
    if(txt >=60){
      txt = 0;
      frmConfirm.txtTimeMins.text = "00";
      var x = 1;
      x += parseInt(frmConfirm.txtTimeHrs.text, 10);
      frmConfirm.txtTimeHrs.text = Math.round(x) + "";      
    }
  }
  else
  {        
    frmConfirm.txtTimeMins.text = "";
    return;
  }
}

function fixMins2()
{
  var txt = parseInt(frmConfirm.txtTimeMins.text, 10);

  if(txt == txt){
    if(txt < 10){
      frmConfirm.txtTimeMins.text = "0" + Math.round(txt);
    }
  }
  else
    return;
}

function addOne(txt){
  var newVal = parseInt(txt, 10) + 1;
  return Math.round(newVal) + "";
}

function minusOne(txt, mins){
  var newVal = parseInt(txt, 10) - 1;
  if(newVal < 0 && mins === true)
  {
    frmConfirm.txtTimeHrs.text = minusOne(frmConfirm.txtTimeHrs.text, false); 
    fixHours();
    return 59;
  }
  else if (newVal <= 0 && mins === false){
    changeAmPm();
    return 12;
  }
  return Math.round(newVal) + "";
}

function changeAmPm(){
  if (frmConfirm.lblAmPm.text == "AM")
    frmConfirm.lblAmPm.text = "PM";
  else
    frmConfirm.lblAmPm.text = "AM";
}

function getMonth (month){
  return (months.track)+1;
}

function getHour (hour, meridian){
  if(meridian.toLowerCase() === "pm")
    return hour+12;

  return hour;

}

function setNewTime(){
  var newTime = frmConfirm.txtTimeHrs.text + ":" + frmConfirm.txtTimeMins.text + " " + frmConfirm.lblAmPm.text;
  // frmConfirm.lblTime.text = newTime;
  var newDate = frmConfirm.lblDay.text + " " + frmConfirm.lblMonth.text + " " + frmConfirm.lblYear.text;


  timeformatted.day = parseInt(frmConfirm.lblDay.text);
  timeformatted.month = getMonth(frmConfirm.lblMonth.text);
  timeformatted.year = parseInt(frmConfirm.lblYear.text);
  timeformatted.mins = parseInt(frmConfirm.txtTimeMins.text);
  timeformatted.meridian = (frmConfirm.lblAmPm.text).toLowerCase();
  timeformatted.hours = getHour(parseInt(frmConfirm.txtTimeHrs.text), timeformatted.meridian);


  frmConfirm.lblDateTimeNew.text = newDate + " - " + newTime;
  frmConfirm.flexDateTime.setVisibility(false);
}

function enableChangeTime(){
  frmConfirm.flexDetails2.height = 215;
  frmConfirm.lblTime.setVisibility(true);
  frmConfirm.btnSetTime.setVisibility(true);
}

function disableChangeTime(){
  frmConfirm.flexDetails2.height = 185;
  frmConfirm.lblTime.setVisibility(false);
  frmConfirm.btnSetTime.setVisibility(false);  
}

var days = {track:0, label:"d", values:[]};
var months = {track:0, label:"m", values:["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]};
var years = {track:0, label:"y", values:["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]};

function onMonthChange(bool){
  if(bool === 1)
    cyclicIncrement(months);
  else if (bool === 0)
    cyclicDecrement(months);

  setUpDays(frmConfirm.lblMonth.text);
  var selectedDay = parseInt(frmConfirm.lblDay.text, 10);
  if(selectedDay > days.values.length) {
    frmConfirm.lblDay.text = days.values[days.values.length-1];
    days.track = days.values.length-1;
  }
}

function onYearChange(bool){
  if(bool === 1)
    cyclicIncrement(years);
  else if (bool === 0)
    cyclicDecrement(years);

  setUpDays("Feb");
  var selectedDay = parseInt(frmConfirm.lblDay.text, 10);
  if(selectedDay > days.values.length) {
    frmConfirm.lblDay.text = days.values[days.values.length-1];
    days.track = days.values.length-1;
  }
}

function cyclicIncrement(obj){
  if(obj.values.length-1 === obj.track)
    obj.track = 0;
  else
    obj.track++;

  updateObj(obj);
}

function cyclicDecrement(obj){
  if(obj.track === 0)
    obj.track = obj.values.length -1;
  else
    obj.track--;  

  updateObj(obj);
}

function updateObj(obj){  
  switch (obj.label){
    case "d":
      frmConfirm.lblDay.text = obj.values[obj.track];
      break;

    case "m":
      frmConfirm.lblMonth.text = obj.values[obj.track];
      break;

    case "y":
      frmConfirm.lblYear.text = obj.values[obj.track];
      break;
  }
}

function setUpDays(month){
  if(month == "Apr" || month == "June" || month == "Sep" || month == "Nov") { //30
    pushPopNumbers(30);   
  }
  else if (month == "Feb") { //28 or 29
    var leap = parseInt(frmConfirm.lblYear.text, 10);
    if(leap % 4 === 0)
      pushPopNumbers(29);	
    else
      pushPopNumbers(28);      
  }
  else { //31
    pushPopNumbers(31);     
  }
}

function pushPopNumbers(x){
  if(days.values.length < x)
  {
    for(var i = 1; i <= x; i++){
      if(i >= 10)
        days.values[i-1] = "" + i;
      else
        days.values[i-1] = "0" + i; 
    }
  }
  else {
    while(days.values.length > x)
      days.values.pop();
  }    
}

var sliderDir = 2;
function sliderMove(){   
  if(frmConfirm.sliderBook.selectedValue > 65 && sliderDir === 2){
    showLater();    
    //frmConfirm.calTime.render();
  }
  else if (frmConfirm.sliderBook.selectedValue < 45 && sliderDir === 1){    
    showNow();
  }
  else if(sliderDir !== 0 )
  {
    //frmConfirm.imgNow.left = frmConfirm.sliderBook.selectedValue -10;       
  }  
}

function showNow(){
  if(sliderDir == 1){    
    sliderDir = 0;
    kony.timer.schedule("reset", function() {   
      frmConfirm.imgNow.src = "slidernow.png";
      sliderDir = 2;
      //frmConfirm["calTime"]["isVisible"] = false;
      frmConfirm.lblDateTime.setVisibility(true); 
      frmConfirm.lblTime.setVisibility(false);
      frmConfirm.btnSetTime.setVisibility(false);  
      //frmConfirm["flexDetails2"]["height"] = 185;
      frmConfirm.lblDateTimeNew.setVisibility(false);
      //frmConfirm.lblTime.setVisibility(false);
      // frmConfirm.btnSetTime.setVisibility(false); 
      //frmConfirm.flexDetails2.height = 185; 
      //disableChangeTime();      
    }, 0.25, false);
    animateMove(frmConfirm.imgNow, 0.25, "0", "-15", null);
  }
  /* sliderDir = 0;
        frmConfirm.sliderBook.setVisibility(false);       
        kony.timer.schedule("reset", function() { 
          frmConfirm.sliderBook.setVisibility(true);  
          sliderDir = 1;
        }, 1, false);
        frmConfirm.sliderBook.selectedValue = -10;  */  
}

function showLater(){
  if(sliderDir == 2){    
    sliderDir = 0;
    kony.timer.schedule("reset", function() {   
      frmConfirm.imgNow.src = "sliderlater.png";
      sliderDir = 1;
      //frmConfirm["calTime"]["isVisible"] = true;
      frmConfirm.lblDateTimeNew.setVisibility(true);
      frmConfirm.lblDateTime.setVisibility(false); /*
      frmConfirm.lblTime.setVisibility(true);
      frmConfirm.btnSetTime.setVisibility(true);  
      frmConfirm.flexDetails2.height = 215; */  
      //frmConfirm["lblTime"]["isVisible"] = true;
      frmConfirm.scrollToBeginning();
      kony.timer.schedule("showDateTime", function(){frmConfirm["flexDateTime"]["isVisible"] = true;
                                                     frmConfirm.btnSetTime.setVisibility(true);}, 0.3, false);  
      //frmConfirm["flexDetails2"]["height"] = 215; 
      //enableChangeTime();     
    }, 0.25, false);
    animateMove(frmConfirm.imgNow, 0.25, "0", "110", null);
  }
}

var setupTblSwipe = {fingers: 1};
function setUpSwipes(){ 

  frmConfirm.flexSlider.addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, setupTblSwipe,  function(widget, gestureInformationSwipe) {
    //ssa.mobile.alert("","" + gestureInformationSwipe.swipeDirection );
    if(gestureInformationSwipe.swipeDirection == 2) { 
      showLater(); 
    }
    else if (gestureInformationSwipe.swipeDirection == 1){
      showNow();
    }
  });

  frmMap.flexNoPanning.addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, setupTblSwipe,  function(widget, gestureInformationSwipe) {

  });

  frmMap.flexSwiper.addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, setupTblSwipe,  function(widget, gestureInformationSwipe) {
    if(gestureInformationSwipe.swipeDirection == 2) { //RIGHT
      //tuta.renderFinalRoute();
    }
  });

}

function selectPickUpLocation() {
  // this means we are searching for pickup location
  searchMode = 1;
  animateMove(frmMap.flexAdd, 0.3, "70", "0%", null);
  kony.timer.schedule("focusPick", function(){frmMap.txtPick.setFocus(true);}, 0.4, false);
  //frmMap.lblDest.text = "CHANGE PICKUP LOCATION";
  //frmMap.txtDest.placeholder = "Click to Set Pickup Location"
}



function cancelHailPrompt(){
  if(menuOpen === false)
    frmMap["flexOverlay1"]["isVisible"] = true;
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
  // hide address llist
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
  //frmMap.lblDest.text = "SET DESTINATION";
  //frmMap.txtDest.placeholder = "Click to Set a Destination";
  frmMap.txtPick.text = "";
  frmMap.txtDest.text = "";
  animateMove(frmMap.flexAdd, 0.3, "70", "-100%", null);
}


function getCabPinForBearing(startloc,endloc) {
  var brng = Math.abs(Math.round(bearing(startloc.lat, 
                                         startloc.lon, 
                                         endloc.lat,
                                         endloc.lon) / 15)) * 15; 

  if(brng >= 360)
    brng = 0;

  return "cabpin" + brng + ".png";
}

var finalroute = null;
var taxiRoute = null;
var finaldestination = null

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
    });
  } else {
    currentPos = getSelectedAddress();
    resetSearchBar();
    updateMap();
    searchMode = 0;
    //kony.timer.schedule("showMarker", function(){frmMap["flexChangeDest"]["isVisible"] = true;}, 0.5, false);

  }
}

function toggleImage(widget){
  //var widget = toggleImage;
  if (widget.isVisible === false)
  {
    widget["isVisible"] = true;
  }
  else{
    widget["isVisible"] = false;
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
var test = 0;
function hailTaxi(widget) {
  //kony.timer.cancel("swap");
  frmMap["flexChangeDest"]["isVisible"] = false;
  var tempState = true;
  frmMap.flexProgress.setVisibility(true);
  frmMap.show();
  hideSearchBar();
  renderDirections(frmMap.mapMain, finalroute, "0x0000FFFF","pickupicon.png","dropofficon.png");
  //frmMap.flexNoOfPeople.setVisibility(false);
  frmMap.flexAddress.setVisibility(false);
  frmMap.flexShadow.setVisibility(false);
  hailstate = tempState;


  kony.timer.schedule("fetchPerson", function(){
    animateTaxiOnRoute(0);
  },4,false );
}

var onRoute = false;
function animateTaxiOnRoute(dir) {
  //ssa.mobile.alert("TEST", "TEST");
  var currentIndex = 0;
  if(dir === 0)
    var routePoints = decodeRoute(taxiRoute.routes,0);
  else {
    var routePoints = decodeRoute(finalroute.routes,0);
    frmMap.btnCancelHailDriving.setVisibility(false);
    animateMove(frmMap.flexTimeToDest, 0.3, "", "-10dp",  null); 
    animateMove2(frmMap.flexPhone, 0.4, "105dp", "-100dp", null);
    animateMove(frmMap.flexCancel, 0.4, "", "-100dp",  null);  
  }

  kony.timer.schedule("onroute", function() { 
    animateMove2(frmMap.flexPhone, 0.4, "105dp", "-10dp", null);
    animateMove(frmMap.flexCancel, 0.4, "", "-10dp", null);
    onRoute = true;
    try{
      if(currentIndex >= routePoints.length - 2) {
        kony.timer.cancel("onroute");
        frmMap.mapMain.clear();
        if(dir === 0){
          onRoute = false;
          updateMap();
          renderDirections(frmMap.mapMain, finalroute, "0x0000FFFF","pickupicon.png","dropofficon.png");
          //animateMove2(frmMap.flexDriverInfo, 0.3, "0%", "0dp", function() {});
          kony.timer.schedule("dropPerson", function(){
            animateTaxiOnRoute(1);
          },2,false );
        }
        else{
          updateMap();
          animateMove(frmMap.flexTimeToDest, 0.3, "", "-150dp",  null); 
          animateMove2(frmMap.flexPhone, 0.4, "105dp", "-100dp", null);
          animateMove(frmMap.flexCancel, 0.4, "", "-100dp", null);  
          //animateMove2(frmMap.flexDriverInfo, 0.2, "-110dp", "", null);
          frmMap.flexDriverInfo.bottom = -110;
          frmMap.flexOverlay2.setVisibility(true);
        }
      } else {
        currentIndex++;

        var locdat = [{lat: "" + routePoints[currentIndex].lat + "", 
                       lon: "" + routePoints[currentIndex].lon + "", 
                       name:"John", 
                       desc: "MoziCab Taxi", 
                       image : getCabPinForBearing(routePoints[currentIndex],routePoints[currentIndex+1])}];

        frmMap.mapMain.locationData = locdat;
      }
    }
    catch(ex){
      if(dir === 0){
        kony.timer.schedule("dropPerson", function(){
          //This sometimes happens then the directions cannot be shown?
          frmMap.mapMain.clear();
          onRoute = false;
          updateMap();
          renderDirections(frmMap.mapMain, finalroute, "0x0000FFFF","pickupicon.png","dropofficon.png");
          animateTaxiOnRoute(1);
        },2,false );
      }
      else{
        updateMap();
        animateMove(frmMap.flexTimeToDest, 0.3, "", "-150dp",  null); 
        animateMove2(frmMap.flexPhone, 0.4, "105dp", "-100dp", null);
        animateMove(frmMap.flexCancel, 0.4, "", "-100dp", null);  
        //animateMove2(frmMap.flexDriverInfo, 0.2, "-110dp", "", null);
        frmMap.flexDriverInfo.bottom = -110;
        frmMap.flexOverlay2.setVisibility(true);
      }
    }
  },0.3,true);
}
function cancelHail() {
  frmMap.btnCancelHailDriving.setVisibility(false);
  hailState = false;
  destination = null;
  try{
    kony.timer.cancel("onroute");
  }
  catch(ex){

  }
  frmMap.mapMain.clear();
  animateMove2(frmMap.flexOptions, 0.3, "0", "", null);
  animateMove(frmMap.flexTimeToDest, 0.3, "", "-150dp",  null); 
  animateMove2(frmMap.flexPhone, 0.4, "105dp", "-100dp", null);
  animateMove(frmMap.flexCancel, 0.4, "", "-100dp", null);  
  //animateMove2(frmMap.flexDriverInfo, 0.2, "-110dp", "", null);
  frmMap.flexDriverInfo.bottom = -110;
  frmMap["flexChangeDest"]["isVisible"] = true;
  deselectAllOptions();
  showSearchBar();
  updateMap();

}


function animateMove(object, time, top, left, finish) {
  object.animate(
    kony.ui.createAnimation({"100":{"top":top, "left": left, stepConfig:{"timingFunction":kony.anim.EASE}}}),
    {"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
    {"animationEnd" : function(){ if(finish) { finish(); }}});
}

function animateMove2(object, time, bot, right, finish) {
  object.animate(
    kony.ui.createAnimation({"100":{"bottom":bot, "right":right, stepConfig:{"timingFunction":kony.anim.EASE}}}),
    {"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
    {"animationEnd" : function(){ if(finish) { finish(); }}});
}

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
var currentPin = "cabpin0.png";
function updateMap() {
  //frmMap.mapMain.zoomLevel = tuta.location.zoomLevelFromLatLng(currentPos.geometry.location.lat, currentPos.geometry.location.lng);

  var pickupicon = "";




  var locationData = [];

  if(driverArrived === false){

    if(overview.active === 1){
      locationData.push(
        {lat: "" + overview.lat + "", 
         lon: "" + overview.lng + "", 
         name:"Map Middle", 
         desc: "", 
         image : ""});    


      pickupicon = "pickupicon.png";
      frmMap.mapMain.zoomLevel = overview.zoom;
    }

    //var count = 0;
    locationData.push(
      {lat: "" + currentPos.geometry.location.lat + "", 
       lon: "" + currentPos.geometry.location.lng + "", 
       name:"Pickup Location", 
       desc: "", 
       image : pickupicon + ""});

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

    //count++;
  }

  if(trackingZoom !== 0){
    frmMap.mapMain.zoomLevel = trackingZoom;    
  }


  frmMap.mapMain.locationData = locationData;
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
};


var inputBooking;
tuta.awaitConfirm = function(bookingID) {

  frmMap.flexAdd.setVisibility(false);
  frmMap.flexChangeDest.setVisibility(false);
  frmMap.flexNoOfPeople.setVisibility(false);
  frmMap.flexProgress.setVisibility(true);
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
          //frmMap["flexProgress"]["isVisible"] = false;
          kony.timer.cancel("taxiHailTimer");
          //tuta.util.alert("success","Your booking has been confirmed!");
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

tuta.renderFinalRoute = function(){
  tuta.animate.move(frmMap.imgSwipeLever, 0.3, "", "70%", null);
  kony.timer.schedule("swiperball", function(){
    awaitingConfirmation = false;
    //tuta.animate.move(frmMap.flexDriverArrival, 0, "", "200%", null);

    frmMap["flexDarken"]["isVisible"] = false;
    frmMap.mapMain.removePolyline("polyid1");
    application.service("driverService").invokeOperation(
      "booking", {}, {id: yourBooking},
      function(result){
        //var finaldestination = result.value[0].address.description;

        //tuta.location.geoCode(nearbyDrivers[0].location.lat, nearbyDrivers[0].location.lng, function(s, e){
        //getDirections(s.results[0], destination, null, function(response){
        tuta.location.directionsFromCoordinates(nearbyDrivers[0].location.lat, nearbyDrivers[0].location.lng, destination.geometry.location.lat, destination.geometry.location.lng, function(response){

          kony.timer.schedule("renderDirFinal", function(){
            renderDirections(frmMap.mapMain, response, "0x0036bba7","","dropofficon.png");
            updateMap();
          }, 1, false);
        });
        //});

      }, function(error){

      });

    /*

      application.service("manageService").invokeOperation(
        "bookingUpdate", {}, {id: yourBooking, data: {status: "InTransit"}},
        function(result){

        }, function(error){

        });*/
    // NOW GET DIRECTIONS FROM DRIVER TO FINAL DESTINATION
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

var yourBooking;

tuta.renderRouteAndDriver = function (booking){
  //#ifdef iphone
  trackingZoom = 14;
  //#endif

  //#ifdef android
  trackingZoom = 12;
  //#endif
  var driver = booking.providerId;
  initialLoad = true;
  application.service("driverService").invokeOperation(
    "user", {}, {id : driver},
    function(result) { 
      //tuta.location.geoCode(result.value[0].location.lat, result.value[0].location.lng, function(success, error){
      //tuta.util.alert("PICKUP", JSON.stringify(success));
      // tuta.util.alert("SELF", JSON.stringify(currentPos));
      //tuta.location.geoCode(booking.location.lat, booking.location.lng, function(s, e){
      //getDirections(success.results[0],s.results[0],null,function(response) {
      tuta.location.directionsFromCoordinates(result.value[0].location.lat, result.value[0].location.lng, booking.location.lat, booking.location.lng, function(response){

        //tuta.util.alert("ROUTE", JSON.stringify(response));
        kony.timer.schedule("renderDir", function(){
          renderDirections(frmMap.mapMain, response, "0x0036bba7","","");
          updateMap();
          //tuta.util.alert("DISTANCE: ", tuta.location.distance(result.value[0].location.lat, result.value[0].location.lng, booking.location.lat, booking.location.lng));
        }, 2, false);
      });

      //});

      //});
    },
    function(error) {
      // the service returns 403 (Not Authorised) if credentials are wrong
      //tuta.util.alert("Error " + error);
    }
  );

};

tuta.fetchDriverInfo = function(driverID){
  application.service("driverService").invokeOperation(
    "user", {}, {id: driverID}, 
    function(result){
      frmMap.lblDriverName.text = result.value[0].userInfo.firstName + " " + result.value[0].userInfo.lastName;
      application.service("driverService").invokeOperation(
        "assignedVehicle", {}, {userId: driverID}, 
        function(res){
          //tuta.util.alert("TEST", JSON.stringify(res));
          frmMap.lblCar.text = res.value[0].make + " " + res.value[0].model;
          frmMap.lblReg.text = res.value[0].VRN + "";
          application.service("driverService").invokeOperation(
            "rating", {}, {userId: driverID}, 
            function(r){
              //tuta.util.alert("TEST", JSON.stringify(r));
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

var initialLoad = true;
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

var nearbyDrivers = [];

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
        /*
          if (finaldistNow <= 150){
            //ANIMATE IN NEARBY SLIDER

            frmMap.flexOverlay2.setVisibility(true);
            tuta.animate.moveBottomLeft(frmMap.flexTimeToDest, 0.1, "105", "-150", null);
            tuta.animate.moveBottomLeft(frmMap.flexDriverInfo, 0.1, "-110", "", null);
            journeyComplete = true;

          } */ 

      }



      //tuta.util.alert("LOCATIONS", driver.location.lat + " " + driver.location.lng + " " + currentPos.geometry.location.lat + " " + currentPos.geometry.location.lng);
      //var distNow = 0;


      //updateMap(); 
    },
    function(error) {
      // the service returns 403 (Not Authorised) if credentials are wrong
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
            frmMap.mapMain.zoomLevel = overview.zoom;
            tuta.animate.move(frmMap.flexOverlay2, 0, "0", "0", null);
            //frmMap.flexOverlay2.setVisibility(true);
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

var journeyComplete = false;
var driverArrived = false;
var awaitingConfirmation = true;

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
              //tuta.util.alert("LOGIN SUCCESS", result.value);
              tuta.forms.frmMap.show();
              kony.timer.schedule("startwatch", function(){tuta.startWatchLocation();}, 2, false);
              //tuta.forms.frm003CheckBox.show();
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
          //tuta.util.alert("Error", ex);
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

var watchID = null;
var initialized = 0;

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
          //tuta.location.geoCode(position.coords.latitude, position.coords.longitude, function(s, e){
          currentPos.geometry.location.lat = position.coords.latitude;
          currentPos.geometry.location.lng =  position.coords.longitude;
          //updateMap();
          try{
            tuta.location.updateLocationOnServer(position.coords.latitude, position.coords.longitude);
          }
          catch(ex){

          }
          //});
        },
        function (errorMsg) {
          //if(errorMsg.code !==3 )
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
    //tuta.util.alert("TEST", ex);
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
