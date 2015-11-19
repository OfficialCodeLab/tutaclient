// setup inital events

var people = [];
var star = [];
var hailState;
var geocodeRecieved = false;

var searchMode = 0;
/*
	These will hold geocoding data
*/
var destination = null;
var pickupPoint = null;
var taxiPosition = null;
var viaList = [];

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

var animationSelected = kony.ui.createAnimation({"100":{"anchorPoint":{"x":0.5,"y":0.5},"stepConfig":{"timingFunction":kony.anim.EASIN_IN_OUT},"width":"100dp","height":"100dp"}});
var animationDeselect = kony.ui.createAnimation({"100":{"anchorPoint":{"x":0.5,"y":0.5},"stepConfig":{"timingFunction":kony.anim.EASIN_IN_OUT},"width":"80dp","height":"80dp"}});

function initOld() {

  hailState = false;
  frmMap.btnPerson1.onTouchStart = onPeopleSelect;
  frmMap.btnPerson2.onTouchStart = onPeopleSelect;
  frmMap.btnPerson3.onTouchStart = onPeopleSelect;
  frmMap.btnPerson4.onTouchStart = onPeopleSelect;
  frmMap.btnPerson5.onTouchStart = onPeopleSelect;
  frmMap.btnPerson6.onTouchStart = onPeopleSelect;
  people.push(frmMap.imgPeople1);
  people.push(frmMap.imgPeople2);
  people.push(frmMap.imgPeople3);
  people.push(frmMap.imgPeople4);
  people.push(frmMap.imgPeople5);
  people.push(frmMap.imgPeople6);


  frmMap.imgStar1.onTouchStart = onStarSelect;
  frmMap.imgStar2.onTouchStart = onStarSelect;
  frmMap.imgStar3.onTouchStart = onStarSelect;
  frmMap.imgStar4.onTouchStart = onStarSelect;
  frmMap.imgStar5.onTouchStart = onStarSelect;
  star.push(frmMap.imgStar1);
  star.push(frmMap.imgStar2);
  star.push(frmMap.imgStar3);
  star.push(frmMap.imgStar4);
  star.push(frmMap.imgStar5);

  frmPayments.rtPay.text = "All Tuta transactions will happen directly with your cab driver. "
    + "This will be done with either cash or via credit,"
    + " cheque or debit card using the card machine on board.<br><br>"
    + "Future functionality will allow for you to upload and securely" 
    +" save your credit card information on the app." 
    +" Trip payments will happen automatically once you are at your destination."


  frmMap.preShow = function() {if(hailState == false) updateMap();};
  //Ext.device.Orientation.off();
  frmConfirm.btnSetTime.onClick = function() {
    frmConfirm.scrollToBeginning();
    kony.timer.schedule("showDateTime", function(){frmConfirm["flexDateTime"]["isVisible"] = true;}, 0.3, false);
  };
  frmConfirm.imgX.onTouchStart= function() {frmConfirm["flexDateTime"]["isVisible"] = false;};
  frmConfirm.imgTick.onTouchStart = setNewTime;
  frmConfirm.flexCancel1.onTouchStart = function() {frmConfirm["flexDateTime"]["isVisible"] = false;};
  frmConfirm.flexCancel2.onTouchStart = function() {frmConfirm["flexDateTime"]["isVisible"] = false;};

  frmMap.btnChs.onClick = animateMenu;
  frmMap.btnChsRight.onClick = animateMenu;

  frmConfirm.txtTimeHrs.onTextChange = fixHours;
  frmConfirm.txtTimeMins.onTextChange = fixMins;
  frmConfirm.txtTimeMins.onDone = fixMins2;

  frmConfirm.btnHrsPlus.onClick = function (){frmConfirm.txtTimeHrs.text = addOne(frmConfirm.txtTimeHrs.text); fixHours();};
  frmConfirm.btnHrsMinus.onClick = function (){frmConfirm.txtTimeHrs.text = minusOne(frmConfirm.txtTimeHrs.text, false); fixHours();};
  frmConfirm.btnMinsPlus.onClick = function (){frmConfirm.txtTimeMins.text = addOne(frmConfirm.txtTimeMins.text); fixMins(); fixMins2();};
  frmConfirm.btnMinsMinus.onClick = function (){frmConfirm.txtTimeMins.text = minusOne(frmConfirm.txtTimeMins.text, true); fixMins(); fixMins2();};
  frmConfirm.btnAmPmPlus.onClick = changeAmPm;
  frmConfirm.btnAmPmMinus.onClick = changeAmPm;

  frmConfirm.btnDayUp.onClick = function() {cyclicIncrement(days);};
  frmConfirm.btnDayDown.onClick = function() {cyclicDecrement(days);};
  frmConfirm.btnMonthUp.onClick = function() {onMonthChange(1);};
  frmConfirm.btnMonthDown.onClick = function() {onMonthChange(0);};
  frmConfirm.btnYearUp.onClick = function() {onYearChange(1);};
  frmConfirm.btnYearDown.onClick = function() {onYearChange(0);};
  // frmConfirm.btnMonthDown.onClick = onYearChange(0);

  frmConfirm.btnChangeDest.onClick = function(){
    frmMap.show();    
    frmMap.flexAddressList.setVisibility(false);
    frmMap.flexAddressShadow.setVisibility(false);
    frmMap.lblDest.text = "SET DESTINATION";
    frmMap.txtDest.placeholder = "Click to Set a Destination";
    frmMap.txtDest.text = "";
    frmMap.txtDest.setFocus(true);
    searchMode = 0;
  }

  frmConfirm.btnChangePickup.onClick = function(){
    frmMap.show();  
    selectPickUpLocation();  
  }

  setUpSwipes();

  //SET UP CHEESEBURGER MENU

  frmMap.btnPay.onClick = function (){frmPayments.show();};
  frmPayments.btnBack.onClick = function (){frmMap.show();};

  frmMap.btnPromo.onClick = function (){frmPromo.show();};
  frmPromo.btnBack.onClick = function (){frmMap.show();} ;

  frmMap.btnAbout.onClick = function (){frmAbout.show();};
  frmAbout.btnBack.onClick = function (){frmMap.show();};

  frmMap.btnLegal.onClick = function (){frmLegal.show();};
  frmLegal.btnBack.onClick = function (){frmMap.show();};  

  frmMap.btnHelp.onClick = function (){frmHelp.show();};
  frmHelp.btnBack.onClick = function (){frmMap.show();};  

  frmMap.btnHistory.onClick = function (){frmTrip.show();};
  frmTrip.btnBack.onClick = function (){frmMap.show();}; 

  frmMap.btnSignOut.onClick = function (){frmSplash.show();};

  //TODO: Map data according to which row is selected
  frmTrip.segTrips.onRowClick = function (){ loadTripHistory(""); frmSelectedTrip.show();};
  frmTrip.btnBack.onClick = function (){frmMap.show();}; 
  frmSelectedTrip.btnBack.onClick = function (){frmMap.show();}; 

  frmCreateAcc.btnConfirm.onClick = function (){frmMap.show();};

  //END SET UP CHEESEBURGER MENU

  //frmMap.textDest.onBeginEditing = function () {frmMap.flexOptions.setVisibility(false);};
  //frmMap.textDest.onEndEditing = function () {frmMap.flexOptions.setVisibility(true);};


  // frmMap.flexCheepest.onTouchEnd = selectOption;
  //frmMap.flexQuickest.onTouchEnd = selectOption;
  //frmMap.flexPremium.onTouchEnd = selectOption;

  frmConfirm.sliderBook.onSlide = sliderMove;

  //SET UP DAYS
  setUpDays("Apr");
  frmConfirm.lblDay.text = days.values[0];

  frmMap.btnDrop.onClick = selectPickUpLocation;
  frmMap.btnCancelHail.onClick = cancelHail;  
  frmMap.btnCancelHailNow.onClick = function () {frmMap.flexOverlay1.setVisibility(false); cancelHail();};
  frmMap.btnReturnToTrip.onClick = function () {frmMap.flexOverlay1.setVisibility(false);};
  frmMap.btnSubmitRating.onClick = function(){
    frmMap.flexOverlay2.setVisibility(false);
    //#ifdef iphone
    kony.timer.schedule("cancelHail", function() {  
      cancelHail();
    }, 0.3, false);
    //#endif

    //ifdef android
    cancelHail();
  };
  frmMap.btnCancelHailDriving.onTouchStart = cancelHailPrompt;
  frmMap.segAddressList.onRowClick = onLocationSelected;

  frmMap.txtDest.setFocus(false);

  frmMap.mapMain.onPinClick = function(map,location) {selectPickUpLocation();};
  frmMap.mapMain.onClick = function(map, location) {
    frmMap.flexAddressList.setVisibility(false);
    frmMap.flexAddressShadow.setVisibility(false);
    //kony.timer.schedule("showMarker", function(){frmMap["flexChangeDest"]["isVisible"] = true;}, 0.3, false);
    resetSearchBar();
    searchMode = 0;
  };


  frmMap.txtDest.onDone = function(widget) {
    if(frmMap.txtDest.text != null){
      frmMap.flexFindingDest.setVisibility(true);
      frmMap.flexChangeDest.setVisibility(false);
      //ssa.mobile.alert("Search", "Search Done");
      //frmMap.flexNoOfPeople.setVisibility(false);
      selectDest(frmMap);      
    }
  };

  frmMap.txtPick.onDone = function(widget){
    if(frmMap.txtPick.text != null){
      frmMap.flexFindingDest.setVisibility(true);
      frmMap.flexChangeDest.setVisibility(false);
      //ssa.mobile.alert("Search", "Search Done");
      //frmMap.flexNoOfPeople.setVisibility(false);
      selectDest(frmMap);      
    }
  };


  frmConfirm.btnCancelRequest.onClick = function(widget) { 
    destination = null; 
    frmMap.show(); 
    updateMap();
    frmMap.flexNoOfPeople.setVisibility(true);
  };
  frmConfirm.btnHailTaxi.onClick = hailTaxi;

  //frmMap.flexDestinations.onTouchStart = toggleDestinations;


  frmSelectedTrip.btnHelp.onClick = function (){frmHelp.show();};

  frmHelp.btnCancel.onClick = function (){frmMap.show();};
  frmHelp.btnSubmit.onClick = function (){
    frmMap.show();
    kony.timer.schedule("popRequestSent", function() {  
      popRequestSent.show();
    }, 0.5, false);

  };
  /*selectedPin = location;
    if(hailState) return;
    if(location.name == "Pickup Location") {
      selectPickUpLocation();
      openDestinations(); 
    } else {
      frmMap.txtDestination.setFocus(true);
    }*/


  var selectedPin = null;
  /*frmMap.mapMain.onSelection = function(map,location) {
    if(hailState) return;
    if(location.name == "Pickup Location") {
      selectPickUpLocation();
      openDestinations(); 
    } else {
      frmMap.txtDest.setFocus(true);
    }
  };*/

  //animateLogo(frmSplash.imgTaxi);

  frmSplash.rtDebug.text = "<span>Loading...<span>";
  kony.timer.schedule("firstinit", function () {

    init(function(response) {
      //ssa.mobile.alert("GEOCODE", response);
      pickupPoint = response.results[0];
      kony.timer.schedule("splash", function() {  
        var randomPos = randomPoints(1, pickupPoint.geometry.location.lat, pickupPoint.geometry.location.lng, 1000);
        geoCodeNew(randomPos[0].lat, randomPos[0].lon, function(success, error){
          taxiPosition = success.results[0]; 
        });  
      }, 2, false);

    });

  }, 0.1, false);


  kony.timer.schedule("init", function () {

    init(function(response) {
      //ssa.mobile.alert("GEOCODE", response);
      pickupPoint = response.results[0];
      kony.timer.schedule("splash2", function() { 
        var randomPos = randomPoints(1, pickupPoint.geometry.location.lat, pickupPoint.geometry.location.lng, 1000);
        geoCodeNew(randomPos[0].lat, randomPos[0].lon, function(success, error){
          taxiPosition = success.results[0]; 
        }); 
      }, 2, false);
    });
  }, 4, true);
}

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

function setNewTime(){
  var newTime = frmConfirm.txtTimeHrs.text + ":" + frmConfirm.txtTimeMins.text + " " + frmConfirm.lblAmPm.text;
  // frmConfirm.lblTime.text = newTime;
  var newDate = frmConfirm.lblDay.text + " " + frmConfirm.lblMonth.text + " " + frmConfirm.lblYear.text;
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

  //frmConfirm["calTime"]["isVisible"] = false;
  //frmConfirm.lblTime.setVisibility(false);
  // frmConfirm.btnSetTime.setVisibility(false); 

  frmConfirm.flexSlider.addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, setupTblSwipe,  function(widget, gestureInformationSwipe) {
    //ssa.mobile.alert("","" + gestureInformationSwipe.swipeDirection );
    if(gestureInformationSwipe.swipeDirection == 2) { 
      showLater(); 
    }
    else if (gestureInformationSwipe.swipeDirection == 1){
      showNow();
    }
  });

  //frmMap.flexSwipe.addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, setupTblSwipe,  function(widget, gestureInformationSwipe) {
  //ssa.mobile.alert("","" + gestureInformationSwipe.swipeDirection );
  // if (gestureInformationSwipe.swipeDirection == 1){
  //     animateMenu();
  //    }
  //  });
}

function selectPickUpLocation() {
  // this means we are searching for pickup location
  searchMode = 1;
  animateMove(frmMap.flexAdd, 0.3, "70", "0%", null);
  kony.timer.schedule("focusPick", function(){frmMap.txtPick.setFocus(true);}, 0.4, false);
  //frmMap.lblDest.text = "CHANGE PICKUP LOCATION";
  //frmMap.txtDest.placeholder = "Click to Set Pickup Location"
}

function onSearchComplete() {
  // result Mode = 0 CANCEL
  // = 1 FROM EXISTING ADDRESSES
  // = 2 FROM SEARCH



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

var currentPos;
function updateMap() {
  frmMap.mapMain.zoomLevel = tuta.location.zoomLevelFromLatLng(currentPos.geometry.location.lat, currentPos.geometry.location.lng);

  var pickupicon = "";
  if(frmMap.flexAddress.isVisible == false)
    pickupicon = "pickupicon.png";


  var locationData = [];
  locationData.push(
    {lat: "" + currentPos.geometry.location.lat + "", 
     lon: "" + currentPos.geometry.location.lng + "", 
     name:"Pickup Location", 
     desc: currentPos.formatted_address.replace(/`+/g,""), 
     image : pickupicon + ""});

  frmMap.mapMain.locationData = locationData;

  //frmMap.mapMain.zoomLevel = 10;
  //frmMap.mapMain.locationData
  // setZoomLevelFromBounds();
  /*
  var pickupicon = "";
  if(frmMap.flexAddress.isVisible == false)
  	pickupicon = "pickupicon.png";


  var locationData = [];
  locationData.push(
    {lat: "" + pickupPoint.geometry.location.lat + "", 
     lon: "" + pickupPoint.geometry.location.lng + "", 
     name:"Pickup Location", 
     desc: pickupPoint.formatted_address.replace(/`+/g,""), 
     image : pickupicon + ""});

  if(destination != null) {
    locationData.push(
      {lat: "" + destination.geometry.location.lat + "", 
       lon: "" + destination.geometry.location.lng + "", 
       name:"Destination", 
       desc: destination.formatted_address.replace(/`+/g,""), 
       image : "dropofficon.png"});  
  }

  frmMap.mapMain.locationData = locationData;*/
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

function onLocationSelected() {
  // Search mode 0 means we have a destination
  if(searchMode == 0) {

    destination = getSelectedAddress();
    deselectAllOptions();
    frmConfirm.lblDestination.text = shortenText (destination.formatted_address.replace(/`+/g,""), GLOBAL_CONCAT_LENGTH);
    frmConfirm.lblPickUpLocation.text = shortenText (currentPos.formatted_address.replace(/`+/g,""), GLOBAL_CONCAT_LENGTH);
    //updateConfirmForm();
    resetSearchBar();
    getDirections(currentPos,destination,null,function(response) {
      //ssa.mobile.alert(reponse.results);
      finalroute = response;
      //renderDirections(frmMap.mapMain,response);
    });
    frmMap.flexAddressList.setVisibility(false);
    frmMap.flexAddressShadow.setVisibility(false);
    tuta.forms.frmConfirm.show();

    //REPLACE 30 WITH DISTANCE TO TRAVEL
    frmConfirm.lblCost = "R" + Math.round(taxiRate(30));
    frmConfirm.lblDuration = 30 + " MIN";
  } else {
    currentPos = getSelectedAddress();
    resetSearchBar();
    updateMap();
    searchMode = 0;
    //kony.timer.schedule("showMarker", function(){frmMap["flexChangeDest"]["isVisible"] = true;}, 0.5, false);

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
  /*
  kony.timer.schedule("movetomap", function() { 
    frmMap.mapMain.clear();
    updateMap();
    hideProgress();
    //frmMap.flexDriverInfo.top = "100%";
    frmMap.flexDriverInfo.visible = true;
    animateMove2(frmMap.flexOptions, 0.3, "-110", "", function() {
      animateMove2(frmMap.flexDriverInfo, 0.3, "0%", "0dp", null);      
      getDirections(taxiPosition,pickupPoint,null, function(response) {
        taxiRoute = response;
        //ssa.mobile.alert("test", JSON.stringify(response));
        frmMap.flexProgress.setVisibility(false);
        frmMap.btnCancelHailDriving.setVisibility(true);
        renderDirections(frmMap.mapMain, taxiRoute, "0xFF0000FF","","pickupicon.png");
        //test = 0;
      });

    });
    //frmMap.flexOptions.visible = false;

  },2,false );*/

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
  kony.timer.cancel("onroute");
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

function showProgress() {
  frmMap.flexProgress.setVisibility(true);
  animateLogo(frmMap.imgTaxi);
}

function hideProgress() {
  frmMap.flexProgress.setVisibility(false);
  stopLogoAnimation(frmMap.imgTaxi);
}

function showOptions(location) {

}

function deselectAllOptions() {
  animateDeselect(frmMap.flexCheepest);
  animateDeselect(frmMap.flexQuickest);
  animateDeselect(frmMap.flexPremium);
}

function selectOption(eventObject,x,y) {
  deselectAllOptions();
  animateSelected(eventObject);
}

function animateLogo(eventObject) {
  eventObject.animate(
    kony.ui.createAnimation({"100":{"stepConfig":{"timingFunction":kony.anim.EASIN_IN_OUT},"width":"150dp","height":"150dp"}}),
    {"delay":0,"iterationCount":0,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":0.25,"direction":kony.anim.DIRECTION_ALTERNATE},
    {"animationEnd" : function() {}});
}

function stopLogoAnimation(eventObject) {
  eventObject.animate(
    kony.ui.createAnimation({"100":{"stepConfig":{"timingFunction":kony.anim.EASIN_IN_OUT},"width":"140dp","height":"140dp"}}),
    {"delay":0,"iterationCount":0,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":0.0,"direction":kony.anim.DIRECTION_NONE},
    {"animationEnd" : function() {}});
}

function animateSelected(eventObject) {
  eventObject.animate(animationSelected, 
                      {"delay":0.15,"iterationCount":0,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":0.25,"direction":kony.anim.DIRECTION_ALTERNATE},
                      {"animationEnd" : function() {}});
}   

function animateDeselect(eventObject) {
  eventObject.animate(animationDeselect, 
                      {"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":0.0,"direction":kony.anim.DIRECTION_NONE},
                      {"animationEnd" : function() {}});
}  

var destinationsOpen = false;
function toggleDestinations(eventObject, x , y) {
  if(destinationsOpen) {
    closeDestinations();
  } else {
    openDestinations();
  }
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

function animateScale(object, time, height, top, finish) {
  object.animate(
    kony.ui.createAnimation({"100":{"stepConfig":{"timingFunction":kony.anim.EASE},"top":top, "height":height}}),
    {"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
    {"animationEnd" : function(){ if(finish) { finish(); }}});
}

function openDestinations() {
  animateMove(frmMap.flexDestinations, 0.25, "34%", "0%", null);
  animateMove(frmMap.txtDestination, 0.25, "28%", "0%", null);
  animateScale(frmMap.flexDestinationList,0.25,"20%", "8%",null);
  destinationsOpen = true;
}

function closeDestinations() {
  animateMove(frmMap.flexDestinations, 0.25, "14%", "0%", null);
  animateMove(frmMap.txtDestination,0.25,"8%", "0%", null);
  animateScale(frmMap.flexDestinationList,0.25,"0%", "8%", null);
  destinationsOpen = false;

}

function animateSplash(){

  frmSplash.flexBars.animate(
    kony.ui.createAnimation({"100":{"bottom":"0%", stepConfig:{"timingFunction":kony.anim.EASE}}}),
    {"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":"0.5"},
    {"animationEnd" : null});


  frmSplash.imgTaxi.animate(
    kony.ui.createAnimation({"100":{"centerY":"40%", stepConfig:{"timingFunction":kony.anim.EASE}}}),
    {"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":"0.5"},
    {"animationEnd" : null});

}

var menuOpen = false;
var addressesShown = false;
function animateMenu(){
  //frmMap.flexSwipe.setVisibility(false); 
  frmMap.btnChs.setVisibility(false);  
  if(menuOpen === false){ //OPEN MENU
    //animateMove(frmMap.lblChs1, 0.2, "30", "15", null);
    //animateMove(frmMap.lblChs3, 0.2, "30", "15", null);

    //kony.timer.schedule("menuOpen1", function() { 
    frmMap.imgChsC.setVisibility(false);
    frmMap.flexDarken.setVisibility(true);
    //frmMap.lblChs1.setVisibility(false);
    //frmMap.lblChs2.setVisibility(false);
    //frmMap.lblChs3.setVisibility(false);
    animateMove(frmMap.flexAll, 0.3, "0", "80%");
    animateMove(frmMap.flexMenu, 0.3, "0", "0%");
    //kony.timer.schedule("menuOpen2", function() { 
    frmMap.imgChsO.setVisibility(true);
    //frmMap.lblChs2.setVisibility(false);
    //frmMap.lblChs1b.setVisibility(true);
    //frmMap.lblChs2b.setVisibility(true);
    //frmMap.lblChs3b.setVisibility(true);
    //animateMove(frmMap.lblChs1b, 0.2, "15", "17", null);
    // animateMove(frmMap.lblChs3b, 0.2, "15", "43", null);
    frmMap["btnChs"]["height"] = "100%";
    frmMap.btnChs.setVisibility(true);
    //frmMap.flexSwipe.setVisibility(true);
    menuOpen = true;
    //}, 0.35, false);
    frmMap.btnChs.setVisibility(true);
    menuOpen = true;
    //}, 0.1, false);
  }
  else //CLOSE MENU
  {
    //animateMove(frmMap.lblChs1b, 0.2, "15", "30", null);
    //animateMove(frmMap.lblChs3b, 0.2, "15", "30", null);

    //kony.timer.schedule("menuClose1", function() {
    frmMap.imgChsO.setVisibility(false);
    frmMap.flexDarken.setVisibility(false);
    //frmMap.lblChs1b.setVisibility(false);
    //frmMap.lblChs2b.setVisibility(false);
    //frmMap.lblChs3b.setVisibility(false);
    animateMove(frmMap.flexAll, 0.3, "0", "0%");
    animateMove(frmMap.flexMenu, 0.3, "0", "-80%");
    //kony.timer.schedule("menuClose2", function() {
    //frmMap.lblChs1.setVisibility(true);
    //frmMap.lblChs2.setVisibility(true); 
    //frmMap.lblChs3.setVisibility(true);
    frmMap.imgChsC.setVisibility(true);
    //animateMove(frmMap.lblChs1, 0.2, "19", "15", null);
    //animateMove(frmMap.lblChs3, 0.2, "41", "15", null);
    frmMap["btnChs"]["height"] = "55dp";
    frmMap.btnChs.setVisibility(true); 
    menuOpen = false;
    //}, 0.35, false);
    //}, 0.1, false);
  }
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

tuta.awaitConfirm = function(bookingID) {
    flexProgress.setVisiblity(true);
    //Kony timer – checks evert 5 seconds for the booking (if there is one) , 
    //take the result and check the status value of the key status – 
    //when it changes to CONFIRMED, then hide the flex container again
    kony.timer.schedule("taxiHailTimer", function(){



      application.service("userService").invokeOperation(
          "booking", {}, bookingID,
          function(result) { //This is the default function that runs if the query is succesful, if there is a result.
            if (result.value[0].status==="Confirmed")
            {
              flexProgress.setVisiblity(false);
              tuta.util.alert("success","Your booking has been confirmed!");
              kony.timer.cancel("taxiHailTimer");
            }
          },
          function(error) { //The second function will always run if there is an error.
            tuta.util.alert("error",error);
          }
        );


    }, 3.0, true);

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

tuta.initCallback = function(error) {
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
              //tuta.util.alert("LOGIN SUCCESS", result.value);
              tuta.forms.frmMap.show();
              kony.timer.schedule("startwatch", function(){tuta.startWatchLocation();}, 2, false);
              //tuta.forms.frm003CheckBox.show();
            },
            function(error) {
              // the service returns 403 (Not Authorised) if credentials are wrong
              tuta.util.alert("Error " + error.httpStatusCode, error.errmsg);
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

var watchID = null;
var initialized = 0;
tuta.startWatchLocation = function(){
  try{
    watchID = kony.store.getItem("watch");
    if(watchID === null){
      watchID = kony.location.watchPosition(
        function(position) {
          kony.store.removeItem("watch");
          kony.store.setItem("watch", watchID);
          tuta.location.geoCode(position.coords.latitude, position.coords.longitude, function(s, e){
            currentPos = s.results[0];
            updateMap();
          });

        },

        function (errorMsg) {
          if(errorMsg.code !==3 )
            tuta.util.alert("ERROR", errorMsg);
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
	tuta.util.alert("TEST", ex);
  }
};

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

  // initialize application
  application = new tuta.application(tuta.initCallback);

  tuta.location.currentPosition(function(response) {

    tuta.location.geoCode(response.coords.latitude, response.coords.longitude, function(success, error){
      currentPos = success.results[0]; 
      updateMap();



    });
  }, function(error) {
    tuta.util.alert("Error", error);
  });

};
