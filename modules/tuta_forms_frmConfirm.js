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

  //Form Pre-Show Functions
  tuta.forms.frmConfirm.onPreShow = function(form) {
    var self = this;

    /*==============================================================
          __  __      _   _               _     
         |  \/  | ___| |_| |__   ___   __| |___ 
         | |\/| |/ _ \ __| '_ \ / _ \ / _` / __|
         | |  | |  __/ |_| | | | (_) | (_| \__ \
         |_|  |_|\___|\__|_| |_|\___/ \__,_|___/

        ==============================================================*/

    //Request button click
    var bookingID = "";
    function requestButtonClick(){
      var currentUser = JSON.parse(kony.store.getItem("user"));
      if (hailingTaxi === false){

        //Stop repetitive clicks
        hailingTaxi = true;
        var pickupPosition;

        if(pickupPoint === null)
          pickupPosition = currentPos;
        else
          pickupPosition = pickupPoint;

        if (sliderDir == 2) //Booking Now
        {
          //Gets current user as a JSON Object
          var booking = {
            userId: currentUser.userName + "",
            address: {
              description: destination.formatted_address.replace(/`+/g,"") + ""
            },
            location: {
              lat: pickupPosition.geometry.location.lat + "",
              lng: pickupPosition.geometry.location.lng + ""
            },
            status: "Unconfirmed"
          };



          //tuta.logTechUser();

          var input = { data : JSON.stringify(booking) };
          //tuta.util.alert("TEST", input);

          application.service("driverService").invokeOperation(
            "book", {}, input,
            function(result) {
              bookingID = result.value[0].id;

              //Store the current booking
              //ksAppState.bookingID = bookingID;

              tuta.forms.frmMap.show();
              kony.timer.schedule("awaitConfirm", function(){tuta.awaitConfirm(bookingID);}, 1, false);
              
              //Stops repetitive clicks
              hailingTaxi = false;
            },
            function(error) {
              // the service returns 403 (Not Authorised) if credentials are wrong
              tuta.util.alert("Error " + error.httpStatusCode, error.errmsg);
            }
          );
        } 
        else if (sliderDir == 1) //Booking Later
        {
          var pickupTime = getEpoch();
          var pickupTimeShort = Math.round(pickupTime/1000);
          var timeNow = Math.round(new Date().getTime()/1000);
          //var time1 = new Date(pickupTime);
          //tuta.util.alert("Time is", "Day " + time1.getDate() + "\nMonth " + time1.getMonth() + "\nYear " + 
          //                time1.getFullYear() + "\nTime " + time1.getHours() + ":" + time1.getMinutes());

          
          if(pickupTimeShort - timeNow > 600) //Booking restrictions satisfied
          {
            var bookingLater = {
              userId: currentUser.userName + "",
              time: "" + pickupTime,
              address: {
                description: destination.formatted_address.replace(/`+/g,"") + ""
              },
              location: {
                lat: pickupPosition.geometry.location.lat + "",
                lng: pickupPosition.geometry.location.lng + ""
              },
              status: "Unconfirmed"
            };

            //tuta.logTechUser();

            var inputLater = { data : JSON.stringify(bookingLater) };
            //tuta.util.alert("TEST", input);

            application.service("driverService").invokeOperation(
              "book", {}, inputLater,
              function(result) {
                bookingID = result.value[0].id;
                tuta.forms.frmMap.show();
                kony.timer.schedule("awaitConfirm", function(){tuta.util.alert("Success", "Booking has been made. Please await confirmation.");}, 1, false);
                hailingTaxi = false;
              },
              function(error) {
                // the service returns 403 (Not Authorised) if credentials are wrong
                tuta.util.alert("Error " + error.httpStatusCode, error.errmsg);
                self.control("txtPassword").text = "";
              }
            );
          }
          else if (pickupTimeShort - timeNow > 0){
            tuta.util.alert("Time too soon", "Please enter a time more than 10 minutes away.");
            hailingTaxi = false;
          }
          else {
            tuta.util.alert("Time incorrect", "Please enter a time that is not before the current time.");
            hailingTaxi = false;
          }


          //collect all variables, send through WITH date & time
        }
      }
      else{

      }

    }//END OF REQUEST BUTTON CLICK

    function getEpoch(){
      //var dateTime = new Date(timeformatted.year, timeformatted.month, timeformatted.day, timeformatted.hours, timeformatted.mins);
      var dateString = (frmConfirm.lblDateTimeNew.text).substring(0,11) + " " + timeformatted.hours + ":" + timeformatted.mins;
      var dateTime = Date.parse(dateString);
      //var time = dateTime.parse();
      return dateTime;
    }










    /*==============================================================
          ____        _   _                  
         | __ ) _   _| |_| |_ ___  _ __  ___ 
         |  _ \| | | | __| __/ _ \| '_ \/ __|
         | |_) | |_| | |_| || (_) | | | \__ \
         |____/ \__,_|\__|\__\___/|_| |_|___/

        ==============================================================*/

    this.control("btnAmPmMinus").onClick = function(button) {
      tuta.calendar.changeAmPm();
    };
    this.control("btnAmPmPlus").onClick = function(button) {
      tuta.calendar.changeAmPm();
    };

    //Button: Cancel Request
    this.control("btnCancelRequest").onClick = function(button) {
      //destination = null;
      tuta.forms.frmMap.show();
      //updateMap();
      //This might need to be re-worked
      //frmMap.flexNoOfPeople.setVisibility(true);
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
      tuta.calendar.cyclicDecrement(days);
    };
    this.control("btnDayUp").onClick = function(button) {
      tuta.calendar.cyclicIncrement(days);
    };
    this.control("btnHailTaxi").onClick = function(button) {
      requestButtonClick();
      //hailTaxi();
    };
    this.control("btnHrsMinus").onClick = function(button) {
      self.control("txtTimeHrs").text = tuta.calendar.minusOne(self.control("txtTimeHrs").text, false);
      tuta.calendar.fixHours();
    };
    this.control("btnHrsPlus").onClick = function(button) {
      self.control("txtTimeHrs").text = tuta.calendar.addOne(self.control("txtTimeHrs").text);
      tuta.calendar.fixHours();
    };
    this.control("btnMinsMinus").onClick = function(button) {
      self.control("txtTimeMins").text = tuta.calendar.minusOne(self.control("txtTimeMins").text, true);
      tuta.calendar.fixMins();
      tuta.calendar.fixMins2();
    };
    this.control("btnMinsPlus").onClick = function(button) {
      self.control("txtTimeMins").text = tuta.calendar.addOne(self.control("txtTimeMins").text);
      tuta.calendar.fixMins();
      tuta.calendar.fixMins2();
    };
    this.control("btnMonthDown").onClick = function(button) {
      tuta.calendar.onMonthChange(0);
    };
    this.control("btnMonthUp").onClick = function(button) {
      tuta.calendar.onMonthChange(1);
    };
    /*
            this.control("btnPickUp").onClick = function(button) {
                tuta.forms.frmMap.show();
            };
            This button doesn't seem to do anything!
            */


    this.control("btnSetTime").onClick = function(button) {
      frmConfirm.scrollToBeginning();
      kony.timer.schedule("showDateTime", function() {
        frmConfirm["flexDateTime"]["isVisible"] = true;
      }, 0.3, false);
    };
    this.control("btnYearDown").onClick = function(button) {
      tuta.calendar.onYearChange(0);
    };
    this.control("btnYearUp").onClick = function(button) {
      tuta.calendar.onYearChange(1);
    };


    this.control("imgX").onTouchStart = function() {
      frmConfirm["flexDateTime"]["isVisible"] = false;
    };


    this.control("imgTick").onTouchStart = tuta.calendar.setNewTime;
    this.control("flexCancel1").onTouchStart = function() {
      frmConfirm["flexDateTime"]["isVisible"] = false;
    };
    this.control("flexCancel2").onTouchStart = function() {
      frmConfirm["flexDateTime"]["isVisible"] = false;
    };

    this.control("flexSlider").addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, GLOBAL_GESTURE_FINGERS_1, function(widget, gestureInformationSwipe) {
      //ssa.mobile.alert("","" + gestureInformationSwipe.swipeDirection );
      if (gestureInformationSwipe.swipeDirection == 2) {
        showLater();
      } else if (gestureInformationSwipe.swipeDirection == 1) {
        showNow();
      }
    });
  }; //End of Pre-Show

  tuta.forms.frmConfirm.onPostShow = function(form) {
    var self = this;
    tuta.calendar.setUpDays("Jan");
    showNow();
    this.control("lblDay").text = days.values[0];
  };
};

//Methods used for custom time picker


//Functions



/*
Info

application.service(" <insert service name here> ").invokeOperation(
          " <insert service operation here> ", { <header function - nothing here> }, <json variable here, usually as a string> ,
          function(result) { //This is the default function that runs if the query is succesful, if there is a result.

            //Just a popup, you can show some info here if the method is succesful
            //tuta.util.alert("LOGIN SUCCESS", result.value);

            //Do some stuff here


            //Storing information locally:

            //Creates a new item, "user", in the store. (Can be named anything)
            //User is the key/ID, and contains a JSON structure as a value
            kony.store.setItem("user", JSON.stringify(inputs <This is the json struct> ));

            //Do some more stuff
            self.moveLoginButtons.toggle();
            tuta.forms.frmMap.show();
            //tuta.forms.frm003CheckBox.show();
          },
          function(error) { //The second function will always run if there is an error.
            // the service returns 403 (Not Authorised) if credentials are wrong
            tuta.util.alert("Error " + error.httpStatusCode, error.errmsg);
            self.control("txtPassword").text = "";
          }
        );
*/