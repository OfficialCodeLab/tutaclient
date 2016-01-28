if (typeof(tuta) === "undefined") {
  tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
  tuta.forms = {};
}

tuta.forms.frmMap = function() {
  // initialize controller 
  tuta.forms.frmMap = new tuta.controller(frmMap); 

  // Initialize form events	
  tuta.forms.frmMap.onInit = function(form) {
  };  

  tuta.forms.frmMap.onPreShow = function(form) {
    var self = this;
	tuta.map.stopMapListener();
    //frmMap.txtDest.setFocus(false);
	frmMap.Image066d5e18d311e4b.setVisibility(false); // search destination cancel image 
    frmMap.CopyImage0943e5358a1de41.setVisibility(false); // search destination cancel image
    
    this.control("txtDest").onBeginEditing = function() {
      frmMap.Image066d5e18d311e4b.setVisibility(true);
    };
    
    this.control("txtDest").onEndEditing = function() {
      frmMap.Image066d5e18d311e4b.setVisibility(false);
    };
    
    this.control("txtPick").onBeginEditing = function() {
      frmMap.CopyImage0943e5358a1de41.setVisibility(true);
    };
    
    this.control("txtPick").onEndEditing = function() {
      frmMap.CopyImage0943e5358a1de41.setVisibility(false);
    };
    
    this.control("btnPerson1").onClick = onPeopleSelect;
    this.control("btnPerson2").onClick = onPeopleSelect;
    this.control("btnPerson3").onClick = onPeopleSelect;
    this.control("btnPerson4").onClick = onPeopleSelect;
    this.control("btnPerson5").onClick = onPeopleSelect;
    this.control("btnPerson6").onClick = onPeopleSelect;
    people.push(frmMap.imgPeople1);
    people.push(frmMap.imgPeople2);
    people.push(frmMap.imgPeople3);
    people.push(frmMap.imgPeople4);
    people.push(frmMap.imgPeople5);
    people.push(frmMap.imgPeople6);

    
    this.control("imgStar1").onTouchStart = onStarSelect;
    this.control("imgStar2").onTouchStart = onStarSelect;
    this.control("imgStar3").onTouchStart = onStarSelect;
    this.control("imgStar4").onTouchStart = onStarSelect;
    this.control("imgStar5").onTouchStart = onStarSelect;
    star.push(frmMap.imgStar1);
    star.push(frmMap.imgStar2);
    star.push(frmMap.imgStar3);
    star.push(frmMap.imgStar4);
    star.push(frmMap.imgStar5);

    this.leftMenu = new tuta.controls.menu(
      this.control("flexAll"), 
      this.control("flexMenu"), 
      tuta.controls.position.LEFT,
      tuta.controls.behavior.MOVE_OVER,
      0.15
    );	

    this.control("btnArrivedConfirm").onClick = function(button){
      tuta.animate.move(frmMap.flexDriverArrived, 0, "", "100%", null);
      frmMap.flexDarken.setVisibility(false);
    };

    //Get the name of the user
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
        var firstName = result.value[0].userInfo.firstName;
        var lastName = result.value[0].userInfo.lastName;
        var avatarBase64 = result.value[0].userInfo.avatarDocId;
        var fullName = firstName + " " + lastName;

        //tuta.util.alert("User Information", "Name: " + csFullName);
        frmMap.lblUser.text = fullName;
 		
      },
      function(error) {
        // the service returns 403 (Not Authorised) if credentials are wrong
        tuta.util.alert("Error " + error);
      }
    );

    // this.control("btnChs").onClick = function (button) {tuta.forms.frmMap.show();};
    this.control("btnChs").onClick = function(button) {
      tuta.menuToggle(0.15, self.leftMenu._open);     
      self.leftMenu.toggle();
    };
    
    // Goes to edit profile form
    this.control("btnEditProfile").onClick = function(button) {
      tuta.menuToggle(0, self.leftMenu._open);
      self.leftMenu.toggle();
      tuta.forms.frmEditProfile.show();
    };

    this.control("btnPay").onClick = function (button) {
      tuta.menuToggle(0, self.leftMenu._open);     
      self.leftMenu.toggle();
      tuta.forms.frmPayments.show();
    };
    this.control("btnHistory").onClick = function (button) {
      tuta.menuToggle(0, self.leftMenu._open);     
      self.leftMenu.toggle();
      tuta.forms.frmTrip.show();
    };
    this.control("btnHelp").onClick = function (button) {
      tuta.menuToggle(0, self.leftMenu._open);     
      self.leftMenu.toggle();
      tuta.forms.frmHelp.show();
    };
    this.control("btnPromo").onClick = function (button) {
      tuta.menuToggle(0, self.leftMenu._open);     
      self.leftMenu.toggle();
      tuta.forms.frmPromo.show();
    };
    this.control("btnAbout").onClick = function (button) {
      tuta.menuToggle(0, self.leftMenu._open);     
      self.leftMenu.toggle();
      tuta.forms.frmAbout.show();
    };
    this.control("btnLegal").onClick = function (button) {
      tuta.menuToggle(0, self.leftMenu._open);     
      self.leftMenu.toggle();
      tuta.forms.frmLegal.show();
    };
    this.control("btnSignOut").onClick = function (button) {
      kony.store.removeItem("user");
      tuta.menuToggle(0, self.leftMenu._open);     
      self.leftMenu.toggle();
      tuta.forms.frmSplash.show();
    };
    this.control("btnMapCenter").onClick = function (button) {
      //Handle repeated presses
      try{
        kony.timer.cancel("waitForMapUpdate");
      } catch (ex){

      }
      //Stop the watch location
      tuta.stopUpdateMapFunction();

      //Center the map on the user
      var locationData = {lat:currentPos.geometry.location.lat,lon:currentPos.geometry.location.lng,name: "",desc: ""};
      frmMap.mapMain.navigateToLocation(locationData,false,false);

      //Schedule the update map to start in 10 seconds
      kony.timer.schedule("waitForMapUpdate", function(){
        tuta.startUpdateMapFunction();
      }, 10, false);
    };

    this.control("btnDrop").onClick = selectPickUpLocation;
    //this.control("btnCancelHail").onClick = cancelHail;  
    this.control("btnCancelHailNow").onClick = function () { 
      tuta.animate.move(frmMap.flexOverlay1, 0, "100%", 0, null); 
      tuta.animate.moveBottomLeft(frmMap.flexDriverInfo, 0.2, "0", "0", null);
      tuta.animate.moveBottomLeft(frmMap.flexCancel, 0.2, "105", "-5", null);
      tuta.animate.moveBottomRight(frmMap.flexPhone, 0.2, "105", "-5", null);
      tuta.cancelBooking(yourBooking);
      tuta.resetMap();
    };
    this.control("btnReturnToTrip").onClick = function () { tuta.animate.move(frmMap.flexOverlay1, 0, "100%", 0, null);};
    this.control("btnSubmitRating").onClick = function(){
      var rating = "5";
      tuta.updateBookingHistoryRating(currentBooking, rating, function(){

        tuta.animate.move(frmMap.flexOverlay2, 0, "0", "100%", null);

        tuta.resetMap();
      });
    };
    //this.control("btnCancelHailDriving").onTouchStart = cancelHailPrompt;
    this.control("segAddressList").onRowClick = onLocationSelected;

    this.control("btnCancelHailProgress").onClick = function (button){
      kony.timer.schedule("cancelBookingHail",  function(){tuta.cancelBooking(yourBooking);}, 2, false);
      
      tuta.resetMap();
      try{
        kony.timer.cancel("taxiHailTimer");
      }
      catch(ex){

      }

      frmMap.flexProgress.setVisibility(false);
      onJourney = 0;
      currentBooking = null;

      //Clear appstate
      /*
      appState = {
        state_string: "NONE",
        bookingID: "NONE"
      };
      
      try{      
        tuta.appstate.clearState();
      }
      catch(ex){}*/
    };

    //this.control("mapMain").onPinClick = function(map,location) {selectPickUpLocation();};
    this.control("mapMain").onClick = function(map, location) {
      frmMap.flexAddressList.setVisibility(false);
      frmMap.flexAddressShadow.setVisibility(false);
      //kony.timer.schedule("showMarker", function(){frmMap["flexChangeDest"]["isVisible"] = true;}, 0.3, false);
      if(onJourney === 0 )
        frmMap.flexChangeDest.setVisibility(true);

      resetSearchBar();
      searchMode = 0;
    };


    this.control("btnDebug").onClick = function(button) {
      tuta.menuToggle(0, self.leftMenu._open);     
      self.leftMenu.toggle();
      tuta.forms.frmDebug.show();
    };


    this.control("txtDest").onDone = function(widget) {
      if(frmMap.txtDest.text !== null){
        frmMap.flexFindingDest.setVisibility(true);
        frmMap.flexChangeDest.setVisibility(false);
        frmMap.Image066d5e18d311e4b.setVisibility(true);
        //ssa.mobile.alert("Search", "Search Done");
        //frmMap.flexNoOfPeople.setVisibility(false);
        selectDest(frmMap);      
      }
    };

    this.control("txtPick").onDone = function(widget){
      if(frmMap.txtPick.text !== null){
        frmMap.flexFindingDest.setVisibility(true);
        frmMap.flexChangeDest.setVisibility(false);
        frmMap.CopyImage0943e5358a1de41.setVisibility(true);
        //ssa.mobile.alert("Search", "Search Done");
        //frmMap.flexNoOfPeople.setVisibility(false);
        selectDest(frmMap);      
      }
    };
    
    
    this.control("txtDest").onCancel = 
      frmMap.Image066d5e18d311e4b.setVisibility(false);
    
	this.control("txtPick").onCancel = function(widget) {
      frmMap.CopyImage0943e5358a1de41.setVisibility(false);
    }; 
    
    this.control("btnCancelSetDest").onClick = clearDestPick;
    this.control("btnCancelSetPick").onClick = clearDestPick;
    
    this.control("btnCancelHailOnRoute").onClick = function (button){
      tuta.animate.move(frmMap.flexOverlay1, 0, 0, 0, null);
    };

    frmMap.flexDarken.setVisibility(false);

    this.control("btnPhone").onClick = function(button) {
      try {

        kony.phone.dial(drivercell);
      } 
      catch(err) {
        alert("error in dial:: "+ err);
      }
    };
    
    if(client_state === 0){
      //
      
      try {
        kony.timer.cancel("updateMapBounds");
      }catch(ex){}
      kony.timer.schedule("updateMapBounds", function(){
        
        var bds = frmMap.mapMain.getBounds();
        tuta.map.storeCenter(bds);
        tuta.map.startMapListener();
      }, 2, false);
      
      //tuta.map.startMapListener();
    }
    else{
      tuta.map.stopMapListener();
    }

    //Begin storing the appstate as the map is loaded

    /*
    currentAppState = {
        user: JSON.parse(currentUser).userName,
        booking: "None",
        stateNum: 1
      };


    try{
      //Store the object in case of crash
      tuta.appstate.setState(currentAppState);
    } catch(ex){
      tuta.util.alert("Error", "Unable to store app state for some reason.\n\n" + ex + 
        "\n\n" + JSON.stringify(currentAppState));
    }
    */

  };//End Preshow

  tuta.forms.frmMap.onPostShow = function(form) {
    var self = this;    
    //#ifdef iphone
    frmMap.mapMain.zoomLevel = 17;
    //#endif
    //var testDist = tuta.location.distance(12.33,12.55,22.67,23.52);
    //tuta.util.alert("TEST", testDist);

    //Cancel kony timer
    /*
    try{
      kony.timer.cancel("trackDemoDriver");
    }
    catch(ex){

    }

    //Create timer to drack drivers,
    //Update map every 5 seconds
    if (taxiScanFlag === true){
          kony.timer.schedule("trackDemoDriver", function(){
            tuta.trackDriver("craig@ssa.com");
          }, 5, true);
    }
    else{
      	kony.timer.cancel("trackDemoDriver");
    }*/


    //Hide overlay



  };
  
  tuta.forms.frmMap.onHide = function(form){
    var self = this;
    tuta.map.stopMapListener();
  };
};


