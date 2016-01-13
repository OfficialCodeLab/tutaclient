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
    
    //Get the name of the user
    var userTempQuery = JSON.parse(kony.store.getItem("user"));
    var currentUserEmail = JSON.stringify(userTempQuery.userName);
    // var userInfoResults = "";
    //
    
    //Store the user ID as variable 'input' for query
    var input = {
      id: currentUserEmail
    };
    
    application.service("userService").invokeOperation(
      "user", {}, input,
      function(result) { 
        var firstName = result.value[0].userInfo.firstName;
        var surname = result.value[0].userInfo.lastName;
        frmEditProfile.txtFirstName.text = firstName;
        frmEditProfile.txtSurname.text = surname;
      },
      function(error) {
        // the service returns 403 (Not Authorised) if credentials are wrong
        tuta.util.alert("Error " + error);

      }
    );
    
    /*
    this.control("btnCancel").onClick = function (button) {tuta.forms.frmMap.show();};
    this.control("btnSubmit").onClick = function (button) {
      tuta.events.logIssue();
    };*/
    
    this.control("btnBack").onClick = function (button) {tuta.forms.frmMap.show();};
    this.control("btnSave").onClick = function (button) {
      var inputs = {
        data: JSON.stringify({
          firstName : frmEditProfile.txtFirstName.text,
          lastName : frmEditProfile.txtSurname.text
        }),
        id: currentUserEmail
      };
      
      application.service("manageService").invokeOperation(
      	"userInfoUpdate", {}, inputs,
        function(success) {
          tuta.util.alert("Success", "Info has been update");
        }, function(error) {
          tuta.util.alert("Error", JSON.stringify(error));
        }
      );
      //tuta.forms.frmMap.show();
    };
   // PUT BUTTONS HERE
  };
  
  tuta.forms.frmEditProfile.onPostShow = function(form) {
    var self = this;
  };
};
