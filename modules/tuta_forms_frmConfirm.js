if (typeof(tuta) === "undefined") {
  tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
  tuta.forms = {};
}

tuta.forms.frmConfirm = function() {
  // initialize controller 
  tuta.forms.frmConfirm = new tuta.controller(frmConfirm);

  // Initialize form events 
  tuta.forms.frmConfirm.onInit = function(form) {};

  tuta.forms.frmConfirm.onPreShow = function(form) {
    var self = this;
    // PUT BUTTONS HERE
    //this.control("btnBack").onClick = function (button) {tuta.forms.frmMap.show();};
    this.control("btnAmPmMinus").onClick = function(button) {
      changeAmPm();
    };
    this.control("btnAmPmPlus").onClick = function(button) {
      changeAmPm();
    };

    //Button: Cancel Request
    this.control("btnCancelRequest").onClick = function(button) {
      destination = null;
      tuta.forms.frmMap.show();
      updateMap();
      //This might need to be re-worked
      frmMap.flexNoOfPeople.setVisibility(true);
    };
    //End of Cancel Request Button

    //Button: Change Destination
    this.control("btnChangeDest").onClick = function(button) {
      tuta.forms.frmMap.show();
      //Note: tuta.forms. might not be necessary in front of these. Test this.
      frmMap.flexAddressList.setVisibility(false);
      frmMap.flexAddressShadow.setVisibility(false);
      self.control("lblDest").text = "SET DESTINATION";
      self.control("txtDest").placeholder = "Click to Set a Destination";
      self.control("txtDest").text = "";
      frmMap.txtDest.setFocus(true);
      searchMode = 0;

    };
    //End of Change Destination Button

    //Button: Change Pickup
    this.control("btnChangePickup").onClick = function(button) {
      tuta.forms.frmMap.show();  
      selectPickUpLocation();  
    };
    //End of Change Pickup Button

    this.control("btnDayDown").onClick = function(button) {
      cyclicDecrement(days);
    };
    this.control("btnDayUp").onClick = function(button) {
      cyclicIncrement(days);
    };
    this.control("btnHailTaxi").onClick = function(button) {
      hailTaxi();
    };
    this.control("btnHrsMinus").onClick = function(button) {
      self.control("txtTimeHrs").text = minusOne(self.control("txtTimeHrs").text, false); 
      fixHours();
    };
    this.control("btnHrsPlus").onClick = function(button) {
      self.control("txtTimeHrs").text = addOne(self.control("txtTimeHrs").text); 
      fixHours();
    };
    this.control("btnMinsMinus").onClick = function(button) {
      self.control("txtTimeMins").text = minusOne(self.control("txtTimeMins").text, true); 
      fixMins(); 
      fixMins2();
    };
    this.control("btnMinsPlus").onClick = function(button) {
      self.control("txtTimeMins").text = addOne(self.control("txtTimeMins").text); 
      fixMins(); 
      fixMins2();
    };
    this.control("btnMonthDown").onClick = function(button) {
      onMonthChange(0);
    };
    this.control("btnMonthUp").onClick = function(button) {
      onMonthChange(1);
    };
    /*
        this.control("btnPickUp").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
        This button doesn't seem to do anything!
        */
    this.control("btnSetTime").onClick = function(button) {
      frmConfirm.scrollToBeginning();
      kony.timer.schedule("showDateTime", function(){frmConfirm["flexDateTime"]["isVisible"] = true;}, 0.3, false);
    };
    this.control("btnYearDown").onClick = function(button) {
      onYearChange(0);
    };
    this.control("btnYearUp").onClick = function(button) {
      onYearChange(1);
    };


    this.control("imgX").onTouchStart = function() {frmConfirm["flexDateTime"]["isVisible"] = false;};
    this.control("imgTick").onTouchStart = setNewTime;
    this.control("flexCancel1").onTouchStart = function() {frmConfirm["flexDateTime"]["isVisible"] = false;};
    this.control("flexCancel2").onTouchStart = function() {frmConfirm["flexDateTime"]["isVisible"] = false;};

    this.control("flexSlider").addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, setupTblSwipe,  function(widget, gestureInformationSwipe) {
      //ssa.mobile.alert("","" + gestureInformationSwipe.swipeDirection );
      if(gestureInformationSwipe.swipeDirection == 2) { 
        showLater(); 
      }
      else if (gestureInformationSwipe.swipeDirection == 1){
        showNow();
      }
    });
  };//End of Pre-Show

  tuta.forms.frmConfirm.onPostShow = function(form) {
    var self = this;
    setUpDays("Jan");
    this.control("lblDay").text = days.values[0];
  };
};

//Methods used for custom time picker
