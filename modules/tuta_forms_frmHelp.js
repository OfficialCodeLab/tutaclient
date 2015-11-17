if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmHelp = function() {
// initialize controller 
  tuta.forms.frmHelp = new tuta.controller(frmHelp); 

  // Initialize form events	
  tuta.forms.frmHelp.onInit = function(form) {
  };  
  
  tuta.forms.frmHelp.onPreShow = function(form) {
    var self = this;
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmHelp.onPostShow = function(form) {
    var self = this;
  };
};

