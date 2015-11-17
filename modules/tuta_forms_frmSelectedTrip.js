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
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmSelectedTrip.onPostShow = function(form) {
    var self = this;
  };
};

