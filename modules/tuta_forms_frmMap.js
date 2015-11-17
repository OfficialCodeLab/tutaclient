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
    this.leftMenu = new tuta.controls.menu(
          this.control("flexAll"), 
          this.control("flexMenu"), 
          tuta.controls.position.LEFT,
          tuta.controls.behavior.MOVE_OVER,
          0.25
      );	
    
    // this.control("btnChs").onClick = function (button) {tuta.forms.frmMap.show();};
    this.control("btnChs").onClick = function(button) {
        self.leftMenu.toggle();
      };
    
    this.control("btnPay").onClick = function (button) {tuta.forms.frmPayments.show();};
    this.control("btnHistory").onClick = function (button) {tuta.forms.frmTrip.show();};
    this.control("btnHelp").onClick = function (button) {tuta.forms.frmHelp.show();};
    this.control("btnPromo").onClick = function (button) {tuta.forms.frmPromo.show();};
    this.control("btnAbout").onClick = function (button) {tuta.forms.frmAbout.show();};
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmMap.onPostShow = function(form) {
    var self = this;
  };
};


