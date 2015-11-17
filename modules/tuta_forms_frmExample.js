if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmExample = function() {
// initialize controller 
  tuta.forms.frmExample = new tuta.controller(frmExample); 

  // Initialize form events	
  tuta.forms.frmExample.onInit = function(form) {
      
    
      	
      /*
    	this.header("btnMenu").onClick = function(button) {
        tuta.util.alert("My Header Button","Clicked!");
      };*/
  };  
  
  tuta.forms.frmExample.onPreShow = function(form) {
    var self = this;

      this.leftMenu = new tuta.controls.menu(
          this.control("flexMain"), 
          this.control("flexMenu"), 
          tuta.controls.position.LEFT,
          tuta.controls.behavior.MOVE_OVER,
          0.25
      );	
    
      this.rightMenu = new tuta.controls.menu(
          this.control("flexMain"), 
          this.control("flexRightMenu"), 
          tuta.controls.position.RIGHT,
          tuta.controls.behavior.OVERLAY,
          0.25
      );	
    
	  this.topMenu = new tuta.controls.menu(
          this.control("flexMain"), 
          this.control("flexTopMenu"), 
          tuta.controls.position.TOP,
          tuta.controls.behavior.MOVE_OVER,
          0.25
      );    
    
      // example of onClick event on example form for btnOne
      this.control("btnOne").onClick = function(button) {
        self.leftMenu.toggle();
      };
    
      this.control("btnTwo").onClick = function(button) {
        self.rightMenu.toggle();
      };	
     	
      this.control("btn3").onClick = function(button) {
        self.topMenu.toggle();
      };
  };
  
  tuta.forms.frmExample.onPostShow = function(form) {
    var self = this;
    this.header("btnMenu").onClick =function(button) {
      	self.topMenu.toggle();
    };
  };
};
