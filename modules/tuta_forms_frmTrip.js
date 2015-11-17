if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmTrip = function() {
// initialize controller 
  tuta.forms.frmTrip = new tuta.controller(frmTrip); 

  // Initialize form events	
  tuta.forms.frmTrip.onInit = function(form) {
  };  
  
  tuta.forms.frmTrip.onPreShow = function(form) {
    var self = this;
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmTrip.onPostShow = function(form) {
    var self = this;
  };
};

