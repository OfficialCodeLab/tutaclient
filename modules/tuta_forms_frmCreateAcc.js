if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmCreateAcc = function() {
// initialize controller 
  tuta.forms.frmCreateAcc = new tuta.controller(frmCreateAcc); 

  // Initialize form events	
  tuta.forms.frmCreateAcc.onInit = function(form) {
  };  
  
  tuta.forms.frmCreateAcc.onPreShow = function(form) {
    var self = this;
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmCreateAcc.onPostShow = function(form) {
    var self = this;
  };
};

