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
    
    this.control("btnBack").onClick = function (button) {tuta.forms.frmMap.show();};
    this.control("btnCancel").onClick = function (button) {tuta.forms.frmMap.show();};
    this.control("btnSubmit").onClick = function (button) {
      tuta.events.logIssue();
    };
    
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmHelp.onPostShow = function(form) {
    var self = this;
  };
};

