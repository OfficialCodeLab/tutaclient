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
    var profilePicUploaded = false;
    var profilePic;
    
    self.control("btnProfilePic").onClick = function(button) {
      if(frmCreateAcc.cmrTakePhoto.isVisible === true) {
        frmCreateAcc.cmrTakePhoto.isVisible = false;
        frmCreateAcc.btnImportPicture.isVisible = false;
      } else {
		frmCreateAcc.cmrTakePhoto.isVisible = true;
        frmCreateAcc.btnImportPicture.isVisible = true;
      }
    };
    
    self.control("cmrTakePhoto").onCapture = function() {
      frmCreateAcc.imgUser.rawBytes = frmCreateAcc.cmrTakePhoto.rawBytes;
      frmCreateAcc.cmrTakePhoto.isVisible = false;
      frmCreateAcc.btnImportPicture.isVisible = false;
      profilePic = kony.convertToBase64(frmCreateAcc.imgUser.rawBytes);
      profilePicUploaded = true;
    };
    
    self.control("btnImportPicture").onClick = function() {
      
      function openGallery() {
        var querycontext = {mimetype: "image/*"};
        var returnStatus = kony.phone.openMediaGallery(onselectioncallback,
                                                       querycontext);
        frmCreateAcc.cmrTakePhoto.isVisible = false;
        frmCreateAcc.btnImportPicture.isVisible = false;
        profilePic = kony.convertToBase64(frmCreateAcc.imgUser.rawBytes);
      }
      
      function onselectioncallback(rawbytes) {
        if (rawbytes === null) {
          return;
        }
        frmCreateAcc.imgUser.rawBytes = rawbytes;
        profilePicUploaded = true;
      }
      
      openGallery();
    };
    
    self.control("btnCancel").onClick = function(button) {
      kony.application.getPreviousForm().show();
    };

    self.control("btnSubmit").onClick = function(button) {
      //CHECK IF EXISTS
	  
      if(creatingAccount === false){
        frmCreateAcc.flexCreatingAccount.isVisible = true;
        
        creatingAccount = true;

        var userEmail = self.control("txtEmail").text;

        if(userEmail === null || userEmail === "") {
          tuta.util.alert("Error", "Please fill in all fields");
          
          try{
            userEmail.toLowerCase();
          } catch(ex) {}
          
          creatingAccount = false;
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
                                  addresses: []
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
                                      frmCreateAcc.flexCreatingAccount.isVisible = false;
                                      
                                      // Set profile picture here
                                      /* Currently this breaks default profile picture
                                      if(profilePicUploaded) {                                     
                                        var picInput = {
                                          data: JSON.stringify({
                                            avatarDocId: profilePic
                                          }),
                                          id: userEmail
                                        };
                                        
                                        application.service("manageService").invokeOperation(
                                        "userInfoUpdate", {}, picInput, function(success) {                                          
                                        }, function(error) {
                                          self.util.alert("Error updating profile picture", error.errmsg);
                                          creatingAccount = false;
                                          frmCreateAcc.flexCreatingAccount.isVisible = false;
                                        });
                                      }
                                      */
                                      
                                    },
                                    function(error) {
                                      //tuta.util.alert("Error " + error.httpStatusCode, error.errmsg);
                                      self.control("txtPass").text = "";
                                      creatingAccount = false;
                                      frmCreateAcc.flexCreatingAccount.isVisible = false;
                                    }
                                  );
                                },
                                function(error) {
                                  //tuta.util.alert("ERROR", error);
                                  creatingAccount = false;
                                  frmCreateAcc.flexCreatingAccount.isVisible = false;
                                }
                              );
                              
                            },
                            function(error) {
                              //tuta.util.alert("ERROR", error);
                              creatingAccount = false;
                              frmCreateAcc.flexCreatingAccount.isVisible = false;
                            }
                          );

                        }, function (error){
                          //tuta.util.alert("ERROR", "");
                          creatingAccount = false;
                          frmCreateAcc.flexCreatingAccount.isVisible = false;
                        });
                      }
                      else {
                        tuta.util.alert("Enter contact number", "Please enter your contact number");
                        creatingAccount = false;
                        frmCreateAcc.flexCreatingAccount.isVisible = false;
                      }
                    }
                    else {
                      tuta.util.alert("Enter full name", "Please enter both your first name and surname");
                      creatingAccount = false;
                      frmCreateAcc.flexCreatingAccount.isVisible = false;
                    }
                  }
                  else {
                    tuta.util.alert("PASSWORD TOO EASY", "Password must have 8 characters and should contain at least one digit, one lower case and one upper case");
                    creatingAccount = false;
                    frmCreateAcc.flexCreatingAccount.isVisible = false;
                  }
                }
                else {
                  tuta.util.alert("PASSWORDS DONT MATCH", ""); 
                  creatingAccount = false;
                  frmCreateAcc.flexCreatingAccount.isVisible = false;
                }
                
              }            
            },
            function(error) {
              //tuta.util.alert("ERROR", error);    
              creatingAccount = false;   
              frmCreateAcc.flexCreatingAccount.isVisible = false;
            }
          );
        }
      }
    };
    tuta.map.stopMapListener();
  };

  tuta.forms.frmCreateAcc.onPostShow = function(form) {
    var self = this;
    
    //Clear all fields
    self.control("txtName").text = "";
    self.control("txtEmail").text = "";
    self.control("txtContact").text = "";
    self.control("txtPass").text = "";
    self.control("txtPass2").text = "";
  };
};

