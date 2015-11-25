if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmSplash = function() {
// initialize controller 
  tuta.forms.frmSplash = new tuta.controller(frmSplash); 

  // Initialize form events	
  tuta.forms.frmSplash.onInit = function(form) {
  };  

  tuta.forms.frmSplash.onPreShow = function(form) {
    var self = this;

    this.moveLoginButtons = new tuta.controls.menu( 
      this.control("flexMainButtons"),
      this.control("flexLoginButtons"), 
      tuta.controls.position.RIGHT, 
      tuta.controls.behavior.MOVE_OVER, 
      0.3
    );

    this.control("btnLogin2").onClick = function(button) {
      if(self.control("txtEmail").text === "" || self.control("txtEmail").text === null){
        tuta.util.alert("Error", "Please enter your email");  
        self.control("txtPassword").text = "";
      }
      else if (self.control("txtPassword").text === "" || self.control("txtPassword").text === null){
        tuta.util.alert("Error", "Please enter your password");        
      }
      else{
        //Inputs stored as a JSON object temporarily
        var inputs = { userName : self.control("txtEmail").text , password : self.control("txtPassword").text };

        // try log user in
        application.service("userService").invokeOperation(
          "login", {}, inputs,
          function(result) {
            // tuta.util.alert("LOGIN SUCCESS", result.value);
            self.control("txtEmail").text = "";
            self.control("txtPassword").text = "";

            //Creates a new item, "user", in the store. 
            //User is the key / ID, and contains a JSON structure as a value
            kony.store.setItem("user", JSON.stringify(inputs));
            tuta.location.loadPositionInit();
            self.moveLoginButtons.toggle();
            tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0, "0%", "0", null);
            tuta.forms.frmMap.show();
            //tuta.forms.frm003CheckBox.show();
          },
          function(error) {
            // the service returns 403 (Not Authorised) if credentials are wrong
            tuta.util.alert("Error " + error.httpStatusCode, error.errmsg);
            self.control("txtPassword").text = "";
          }
        );

      }


    };

    this.control("btnLogin").onClick = function(button){ 
      self.moveLoginButtons.toggle();
    };

    this.control("btnSignUp").onClick = function(button){
      tuta.forms.frmCreateAcc.show();
    };

  };

  tuta.forms.frmSplash.onPostShow = function(form) {
    var self = this;

    kony.timer.schedule("login", function(){
      
    }, 0.5, false);
  };
  
  
};

