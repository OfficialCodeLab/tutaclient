if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmPromo = function() {
// initialize controller 
  tuta.forms.frmPromo = new tuta.controller(frmPromo); 

  // Initialize form events	
  tuta.forms.frmPromo.onInit = function(form) {
  };  
  
  tuta.forms.frmPromo.onPreShow = function(form) {
    var self = this;
    this.control("btnBack").onClick = function (button) {kony.application.getPreviousForm().show();};
    tuta.map.stopMapListener();
  };
  
  tuta.forms.frmPromo.onPostShow = function(form) {
    var self = this;
  };
};

