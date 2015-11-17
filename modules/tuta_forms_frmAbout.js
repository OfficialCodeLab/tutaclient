if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmAbout = function() {
// initialize controller 
  tuta.forms.frmAbout = new tuta.controller(frmAbout); 

  // Initialize form events	
  tuta.forms.frmAbout.onInit = function(form) {
  };  
  
  tuta.forms.frmAbout.onPreShow = function(form) {
    var self = this;
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmAbout.onPostShow = function(form) {
    var self = this;
  };
};

