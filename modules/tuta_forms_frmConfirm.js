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

        /*
          Variables:

          - Pickup (Current Location)
          - Destination (Location)
          - Nearest Driver (Location)
          - Trip Duration (Based on distance from nearest driver)
          - ID of current user logged in
          - Trip Distance 

          - Instant Booking? (true / false)

          If false,

          Show Date & Time Picker, 
          - Date
          - Time

          Send through booking information
          on request button click
        */

        var pickupLocation = {
          LAT:"",
          LON:""
        };
        var tripDestination = {
          LAT:"",
          LON:""
        }
        var nearestDriverPos; //Serverside

        var estimatedTripDuration; //Ignore for now

       // boolean instantBooking;

        var pickupTime;
        var pickupDay;
        var pickupMonth;
        var pickupYear;
        var currentUserID;

        var tripDistance;

        //Initialise variables
        instantBooking = true;

        //Set Pickup Location (sent through from pickup button)

        //Set Trip Destination (on button click, type in an address)

        //nearestDriverPos = Get position of nearest driver

        //tripDistance = work out distance for trip

        //Work out estimated trip duration in seconds, 60 seconds per 1000m
        estimatedTripDuration = tripDistance * 60;

        




        //Request button click
      	var bookingID = "";
        function requestButtonClick(){
          if (instantBooking === true)
          {
            var currentUser = JSON.parse(kony.store.getItem("user"));
            var booking = {
              userId: currentUser.userName + "",
              address: {
                description: destination.formatted_address.replace(/`+/g,"") + ""
              },
              location: {
                lat: currentPos.geometry.location.lat + "",
                long: currentPos.geometry.location.lng + ""
              },
              status: "Unconfirmed"
            };
            
            //tuta.logTechUser();
            
            var input = { data : JSON.stringify(booking) };
            //tuta.util.alert("TEST", input);
            
            application.service("userService").invokeOperation(
              "book", {}, input,
              function(result) {
                // tuta.util.alert("LOGIN SUCCESS", result.value);
                //bookingID = result._id;
                bookingID = result.value[0].id;
                tuta.forms.frmMap.show();
                tuta.awaitConfirm(bookingID);
                //tuta.logUser();
                //hailTaxi();
                //tuta.forms.frm003CheckBox.show();
              },
              function(error) {
                // the service returns 403 (Not Authorised) if credentials are wrong
                tuta.util.alert("Error " + error.httpStatusCode, error.errmsg);
                self.control("txtPassword").text = "";
              }
            );
          } 
          else{
            //collect all variables, send through WITH date & time
          }
        }










        /*==============================================================
          ____        _   _                  
         | __ ) _   _| |_| |_ ___  _ __  ___ 
         |  _ \| | | | __| __/ _ \| '_ \/ __|
         | |_) | |_| | |_| || (_) | | | \__ \
         |____/ \__,_|\__|\__\___/|_| |_|___/

        ==============================================================*/

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
          requestButtonClick();
            //hailTaxi();
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
            kony.timer.schedule("showDateTime", function() {
                frmConfirm["flexDateTime"]["isVisible"] = true;
            }, 0.3, false);
        };
        this.control("btnYearDown").onClick = function(button) {
            onYearChange(0);
        };
        this.control("btnYearUp").onClick = function(button) {
            onYearChange(1);
        };


        this.control("imgX").onTouchStart = function() {
            frmConfirm["flexDateTime"]["isVisible"] = false;
        };
        this.control("imgTick").onTouchStart = setNewTime;
        this.control("flexCancel1").onTouchStart = function() {
            frmConfirm["flexDateTime"]["isVisible"] = false;
        };
        this.control("flexCancel2").onTouchStart = function() {
            frmConfirm["flexDateTime"]["isVisible"] = false;
        };

        this.control("flexSlider").addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, setupTblSwipe, function(widget, gestureInformationSwipe) {
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
        setUpDays("Jan");
        this.control("lblDay").text = days.values[0];
    };
};

//Methods used for custom time picker