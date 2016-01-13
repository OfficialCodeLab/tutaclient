if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmEditProfile = function() {
// initialize controller 
  tuta.forms.frmEditProfile = new tuta.controller(frmEditProfile); 

  // Initialize form events	
  tuta.forms.frmEditProfile.onInit = function(form) {
  };  
  
  tuta.forms.frmEditProfile.onPreShow = function(form) {
    var self = this;
    
    this.control("btnBack").onClick = function (button) {tuta.forms.frmMap.show();};
    
    /*
    this.control("btnCancel").onClick = function (button) {tuta.forms.frmMap.show();};
    this.control("btnSubmit").onClick = function (button) {
      tuta.events.logIssue();
    };*/
    
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmEditProfile.onPostShow = function(form) {
    var self = this;
  };
};
