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
        var inputs = { userName : self.control("txtEmail").text , password : self.control("txtPassword").text };

        // try log user in
        application.service("userService").invokeOperation(
          "login", {}, inputs,
          function(result) {
            // tuta.util.alert("LOGIN SUCCESS", result.value);
            self.control("txtEmail").text = "";
            self.control("txtPassword").text = "";
            kony.store.setItem("user", JSON.stringify(inputs));
            self.moveLoginButtons.toggle();
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
      var input = null;
      input = kony.store.getItem("user");
      if (input !== null){
        try{
          application.service("userService").invokeOperation(
            "login", {}, JSON.parse(input),
            function(result) {
              //tuta.util.alert("LOGIN SUCCESS", result.value);
              tuta.forms.frmMap.show();
              //tuta.forms.frm003CheckBox.show();
            },
            function(error) {
              // the service returns 403 (Not Authorised) if credentials are wrong
              tuta.util.alert("Error " + error.httpStatusCode, error.errmsg);
            }
          );
        }
        catch (ex){
          tuta.util.alert("Error", ex);
        }
      }  
      else{
        tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0.2, "0%", "0", null);
      }
    }, 0.2, false);
  };
};

