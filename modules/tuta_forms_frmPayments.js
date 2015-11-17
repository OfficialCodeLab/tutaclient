if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmPayments = function() {
// initialize controller 
  tuta.forms.frmPayments = new tuta.controller(frmPayments); 

  // Initialize form events	
  tuta.forms.frmPayments.onInit = function(form) {
  };  
  
  tuta.forms.frmPayments.onPreShow = function(form) {
    var self = this;
    
    this.control("btnBack").onClick = function (button) {tuta.forms.frmMap.show();};
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmPayments.onPostShow = function(form) {
    var self = this;
  };
};

