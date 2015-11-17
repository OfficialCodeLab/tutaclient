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
  tuta.forms.frmConfirm.onInit = function(form) {
  };  
  
  tuta.forms.frmConfirm.onPreShow = function(form) {
    var self = this;
   // PUT BUTTONS HERE
   //this.control("btnBack").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnAnPmMinus").onClick = function (button) {changeAmPm();};
   this.control("btnAmPmPlus").onClick = function (button) {changeAmPm();};
   this.control("btnCancelRequest").onClick = function (button) {
    destination = null; 
    tuta.forms.frmMap.show();
    updateMap();
    //This might need to be re-worked
    tuta.forms.frmMap.flexNoOfPeople.setVisibility(true);
  };
   this.control("btnChangeDest").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnChangePickup").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnDayDown").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnDayUp").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnHailTaxi").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnHrsMinus").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnHrsPlus").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnMinsMinus").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnMinsPlus").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnMonthDown").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnMonthUp").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnPickUp").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnSetTime").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnYearDown").onClick = function (button) {tuta.forms.frmMap.show();};
   this.control("btnYearUp").onClick = function (button) {tuta.forms.frmMap.show();};
  };
  
  tuta.forms.frmConfirm.onPostShow = function(form) {
    var self = this;
  };
};

//Methods used for custom time picker

function changeAmPm(){
  if (frmConfirm.lblAmPm.text == "AM")
    frmConfirm.lblAmPm.text = "PM";
  else
    frmConfirm.lblAmPm.text = "AM";
};