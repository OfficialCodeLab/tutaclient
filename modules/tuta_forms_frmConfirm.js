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
        this.control("btnAnPmMinus").onClick = function(button) {
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
            tuta.forms.frmMap.flexNoOfPeople.setVisibility(true);
        };
        //End of Cancel Request Button

        //Button: Change Destination
        this.control("btnChangeDest").onClick = function(button) {
            tuta.forms.frmMap.show();
            //Note: tuta.forms. might not be necessary in front of these. Test this.
            tuta.forms.frmMap.flexAddressList.setVisibility(false);
            tuta.forms.frmMap.flexAddressShadow.setVisibility(false);
            tuta.forms.frmMap.lblDest.text = "SET DESTINATION";
            tuta.forms.frmMap.txtDest.placeholder = "Click to Set a Destination";
            tuta.forms.frmMap.txtDest.text = "";
            tuta.forms.frmMap.txtDest.setFocus(true);
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
            tuta.forms.frmMap.show();
        };
        this.control("btnDayUp").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
        this.control("btnHailTaxi").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
        this.control("btnHrsMinus").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
        this.control("btnHrsPlus").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
        this.control("btnMinsMinus").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
        this.control("btnMinsPlus").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
        this.control("btnMonthDown").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
        this.control("btnMonthUp").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
        this.control("btnPickUp").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
        this.control("btnSetTime").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
        this.control("btnYearDown").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
        this.control("btnYearUp").onClick = function(button) {
            tuta.forms.frmMap.show();
        };
    };//End of Pre-Show

    tuta.forms.frmConfirm.onPostShow = function(form) {
        var self = this;
    };
};

//Methods used for custom time picker

function changeAmPm() {
    if (frmConfirm.lblAmPm.text == "AM")
        frmConfirm.lblAmPm.text = "PM";
    else
        frmConfirm.lblAmPm.text = "AM";
};