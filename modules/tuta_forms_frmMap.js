if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmMap = function() {
// initialize controller 
  tuta.forms.frmMap = new tuta.controller(frmMap); 

  // Initialize form events	
  tuta.forms.frmMap.onInit = function(form) {
  };  
  
  tuta.forms.frmMap.onPreShow = function(form) {
    var self = this;
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmMap.onPostShow = function(form) {
    var self = this;
  };
};


