if (typeof(tuta) === "undefined") {
  tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
  tuta.forms = {};
}

tuta.forms.frmCreateAcc = function() {
  // initialize controller 
  tuta.forms.frmCreateAcc = new tuta.controller(frmCreateAcc); 

  // Initialize form events	
  tuta.forms.frmCreateAcc.onInit = function(form) {
  };  

  tuta.forms.frmCreateAcc.onPreShow = function(form) {
    var self = this;
    var creatingAccount = false;    

    self.control("btnConfirm").onClick = function(button) {
      //CHECK IF EXISTS

      if(creatingAccount === false){
        creatingAccount = true;

        var userEmail = (self.control("txtEmail").text).toLowerCase();

        if(userEmail === null || userEmail === "") {
          tuta.util.alert("Error", "Please fill in all fields");  
        }
        else {
          var input = { id : userEmail};      

          //TODO: email regex test

          application.service("userService").invokeOperation(
            "userExists", {}, input, function(success) {
              var userExists = tuta.userExists(success);
              if(userExists === true){
                tuta.util.alert("Error", "USER EXISTS ALREADY");               
              }
              else {
                //COMPARE PASSWORDS AND DO REGEX MATCH
                if(self.control("txtPass").text === self.control("txtPass2").text){
                  var passRegex = self.control("txtPass").text.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/);

                  // REMOVAL OF VERIFICATION
                  var removeVerification = true;

                  if(passRegex !== null || removeVerification === true){
                    //tuta.util.alert("PASSWORDS correct", ""); 
                    var names = self.control("txtName").text.split(" ");

                    if(names.length >= 2) {
                      var firstname = names[0];
                      var surname = names[1];
                      for (var i = 2; i < names.length; i++){
                        surname += " " + names[i];
                      }

                      if(self.control("txtContact").text !== "" && self.control("txtContact").text !== null){

                        tuta.location.currentPosition(function(success){

                          //BEGIN INSERT USER
                          var user = {

                            _id : userEmail,
                            password: self.control("txtPass").text,
                            userType: "private",
                            location: {
                              lat : JSON.stringify(success.coords.latitude),
                              lng : JSON.stringify(success.coords.longitude)
                            }                          
                          }; 

                          input = { data : JSON.stringify(user) };

                          //tuta.util.alert("TEST", input);

                          application.service("manageService").invokeOperation(
                            "userAdd", {}, input, function(success) {
                              //BEGIN INSERT USER INFO
                              var userInfo = {
                                _id: userEmail,
                                firstName: firstname,
                                lastName: surname,
                                mobileNumber: self.control("txtContact").text,
                                addresses: [],
                                avatarDocId: "null"
                              };

                              input = { data : JSON.stringify(userInfo) }; 

                              application.service("manageService").invokeOperation(
                                "userInfoAdd", {}, input, function(success) {
                                  input = { userName : userEmail , password : self.control("txtPass").text };

                                  // try log user in
                                  application.service("userService").invokeOperation(
                                    "login", {}, input,
                                    function(result) {
                                      kony.store.setItem("user", JSON.stringify(input));
                                      tuta.location.loadPositionInit();
                                      tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0, "0%", "0", null);
                                      tuta.util.alert("SUCCESS", "Account has been created.");
                                      creatingAccount = false;
                                    },
                                    function(error) {
                                      //tuta.util.alert("Error " + error.httpStatusCode, error.errmsg);
                                      self.control("txtPass").text = "";
                                      creatingAccount = false;
                                    }
                                  );
                                },
                                function(error) {
                                  //tuta.util.alert("ERROR", error);
                                  creatingAccount = false;
                                }
                              );
                            },
                            function(error) {
                              //tuta.util.alert("ERROR", error);
                              creatingAccount = false;
                            }
                          );

                        }, function (error){
                          //tuta.util.alert("ERROR", "");
                          creatingAccount = false;
                        }
                                                     );
                      }
                      else {
                        tuta.util.alert("Enter contact number", "Please enter your contact number");
                        creatingAccount = false;
                      }
                    }
                    else {
                      tuta.util.alert("Enter full name", "Please enter both your first name and surname");
                      creatingAccount = false;
                    }
                  }
                  else {
                    tuta.util.alert("PASSWORD TOO EASY", "Password must have 8 characters and should contain at least one digit, one lower case and one upper case");
                    creatingAccount = false;
                  }
                }
                else {
                  tuta.util.alert("PASSWORDS DONT MATCH", ""); 
                  creatingAccount = false;               
                }
              }            
            },
            function(error) {
              //tuta.util.alert("ERROR", error);    
              creatingAccount = false;          
            }
          );
        }
      }


    }
  };

  tuta.forms.frmCreateAcc.onPostShow = function(form) {
    var self = this;
  };
};

