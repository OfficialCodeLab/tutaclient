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
    kony.timer.schedule("watchpos", function() {
      var positionoptions = {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000};
      kony.location.watchPosition(function(position){

        tuta.util.alert("TEST", JSON.stringify(position));
      }, function(error){
        tuta.util.alert("ERROR", error);          
      }, positionoptions);
    }, 0.5, false);
  };  

  tuta.forms.frmMap.onPreShow = function(form) {
    var self = this;

    //if(hailState === false) updateMap();
    hailState = false;
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
      0.25
    );	

    // this.control("btnChs").onClick = function (button) {tuta.forms.frmMap.show();};
    this.control("btnChs").onClick = function(button) {
      tuta.menuToggle(0.3, self.leftMenu._open);     
      self.leftMenu.toggle();
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
      tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0, "0%", "0", null);
      tuta.menuToggle(0, self.leftMenu._open);     
      self.leftMenu.toggle();
      tuta.forms.frmSplash.show();
    };

    this.control("btnDrop").onClick = selectPickUpLocation;
    this.control("btnCancelHail").onClick = cancelHail;  
    this.control("btnCancelHailNow").onClick = function () {frmMap.flexOverlay1.setVisibility(false); cancelHail();};
    this.control("btnReturnToTrip").onClick = function () {frmMap.flexOverlay1.setVisibility(false);};
    this.control("btnSubmitRating").onClick = function(){
      frmMap.flexOverlay2.setVisibility(false);
      //#ifdef iphone
      kony.timer.schedule("cancelHail", function() {  
        cancelHail();
      }, 0.3, false);
      //#endif

      //ifdef android
      cancelHail();
    };
    this.control("btnCancelHailDriving").onTouchStart = cancelHailPrompt;
    this.control("segAddressList").onRowClick = onLocationSelected;

    this.control("txtDest").setFocus(false);

    this.control("mapMain").onPinClick = function(map,location) {selectPickUpLocation();};
    this.control("mapMain").onClick = function(map, location) {
      frmMap.flexAddressList.setVisibility(false);
      frmMap.flexAddressShadow.setVisibility(false);
      //kony.timer.schedule("showMarker", function(){frmMap["flexChangeDest"]["isVisible"] = true;}, 0.3, false);
      resetSearchBar();
      searchMode = 0;
    };


    this.control("txtDest").onDone = function(widget) {
      if(frmMap.txtDest.text != null){
        frmMap.flexFindingDest.setVisibility(true);
        frmMap.flexChangeDest.setVisibility(false);
        //ssa.mobile.alert("Search", "Search Done");
        //frmMap.flexNoOfPeople.setVisibility(false);
        selectDest(frmMap);      
      }
    };

    this.control("txtPick").onDone = function(widget){
      if(frmMap.txtPick.text != null){
        frmMap.flexFindingDest.setVisibility(true);
        frmMap.flexChangeDest.setVisibility(false);
        //ssa.mobile.alert("Search", "Search Done");
        //frmMap.flexNoOfPeople.setVisibility(false);
        selectDest(frmMap);      
      }
    };


    // PUT BUTTONS HERE
  };

  tuta.forms.frmMap.onPostShow = function(form) {
    var self = this;
    updateMap();     
  };
  
  tuta.forms.frmMap.update = function(position){
    tuta.util.alert("TEST", JSON.stringify(position));
  };
};


