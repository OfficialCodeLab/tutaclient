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
  };
  
  tuta.forms.frmConfirm.onPostShow = function(form) {
    var self = this;
  };
};

