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
    
    this.control("btnBack").onClick = function (button) {tuta.forms.frmMap.show();};
+    this.control("btnCancel").onClick = function (button) {tuta.forms.frmMap.show();};
+    this.control("btnSubmit").onClick = function (button) {tuta.forms.frmMap.show();};
  };
  
  tuta.forms.frmLegal.onPostShow = function(form) {
    var self = this;
  };
};

