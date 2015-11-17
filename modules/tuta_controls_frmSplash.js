if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmSplash = function() {
// initialize controller 
  tuta.forms.frmSplash = new tuta.controller(frmSplash); 

  // Initialize form events	
  tuta.forms.frmSplash.onInit = function(form) {
  };  
  
  tuta.forms.frmSplash.onPreShow = function(form) {
    var self = this;
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmSplash.onPostShow = function(form) {
    var self = this;
  };
};

