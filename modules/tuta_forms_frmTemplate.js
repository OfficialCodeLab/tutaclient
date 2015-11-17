if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmTemplate = function() {
// initialize controller 
  tuta.forms.frmTemplate = new tuta.controller(frmTemplate); 

  // Initialize form events	
  tuta.forms.frmTemplate.onInit = function(form) {
  };  
  
  tuta.forms.frmTemplate.onPreShow = function(form) {
    var self = this;
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmTemplate.onPostShow = function(form) {
    var self = this;
  };
};

