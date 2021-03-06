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


    this.control("btnClearState").onClick = function (button){
      tuta.appstate.clearState();
      tuta.location.loadPositionInit();
      tuta.forms.frmMap.show();
    };

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
        var inputs = { userName : self.control("txtEmail").text.toLowerCase() , password : self.control("txtPassword").text };
        currentUser = inputs;
        // try log user in
        tuta.animate.move(frmSplash.flexLoading, 0, 0, 0, null);
        tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0, "-35%", "0", null);
        tuta.animate.moveBottomLeft(frmSplash.flexLoginButtons, 0, "0%", "100%", null);
        application.service("userService").invokeOperation(
          "login", {}, inputs,
          function(result) {
            // tuta.util.alert("LOGIN SUCCESS", result.value);
            self.control("txtEmail").text = "";
            self.control("txtPassword").text = "";

            //Creates a new item, "user", in the store. 
            //User is the key / ID, and contains a JSON structure as a value
            kony.store.setItem("user", JSON.stringify(inputs));
            currentUser = inputs;
            //CS001
            tuta.appstate.helper.resumeFromState();
            //
            //tuta.location.loadPositionInit(); Carl commented this out
            //tuta.forms.frm003CheckBox.show();
          },
          function(error) {
            tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0, "0%", "0", null);
            tuta.animate.move(frmSplash.flexLoading, 0, 0, "100%", null);
            // the service returns 403 (Not Authorised) if credentials are wrong
            if(error.httpStatusCode + "" == "403"){
              tuta.util.alert("Invalid Credentials", "Your username and password combination was wrong, please try again.");
            }
            else{
              tuta.util.alert("ERROR", error);
            }
            self.control("txtPassword").text = "";
          }
        );

      }


    };

    this.control("btnLogin").onClick = function(button){ 
      tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0.3, "0%", "-100%", null);
      tuta.animate.moveBottomLeft(frmSplash.flexLoginButtons, 0.3, "0%", "0", null);
    };

    this.control("btnSignUp").onClick = function(button){
      tuta.forms.frmCreateAcc.show();
    };

    this.control("btnSignUp2").onClick = function(button){
      tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0, "-35%", "0", null);
      tuta.animate.moveBottomLeft(frmSplash.flexLoginButtons, 0, "0%", "100%", null);
      tuta.forms.frmCreateAcc.show();
    };
    tuta.map.stopMapListener();

    if(initialAppLoad == false){
      try{
        kony.timer.cancel("animateButtons");
      } catch(ex){}
      kony.timer.schedule("animateButtons", function(){
        tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0.3, "0%", "0%", null);

      }, 0.3, false);

    }

  };

  tuta.forms.frmSplash.onPostShow = function(form) {
    var self = this;
  };


};

