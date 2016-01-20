if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmSelectedTrip = function() {
// initialize controller 
  tuta.forms.frmSelectedTrip = new tuta.controller(frmSelectedTrip); 

  // Initialize form events	
  tuta.forms.frmSelectedTrip.onInit = function(form) {
  };  
  
  tuta.forms.frmSelectedTrip.onPreShow = function(form) {
    var self = this;
    this.control("btnBack").onClick = function (button) {tuta.forms.frmTrip.show();};
    this.control("btnHelp").onClick = function (button) {tuta.forms.frmHelp.show();};
    tuta.map.stopMapListener();
  };
  
  tuta.forms.frmSelectedTrip.onPostShow = function(form) {
    var self = this;
  };
};

