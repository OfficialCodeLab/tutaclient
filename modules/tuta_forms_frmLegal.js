if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmLegal = function() {
// initialize controller 
  tuta.forms.frmLegal = new tuta.controller(frmLegal); 

  // Initialize form events	
  tuta.forms.frmLegal.onInit = function(form) {
  };  
  
  tuta.forms.frmLegal.onPreShow = function(form) {
    var self = this;
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmLegal.onPostShow = function(form) {
    var self = this;
  };
};

