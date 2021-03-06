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
    tuta.map.stopMapListener();
    
    //Get the name of the user
    var userTempQuery = JSON.parse(kony.store.getItem("user"));
    var currentUserEmail = JSON.stringify(userTempQuery.userName);
    // var userInfoResults = "";
    //
    
    //Store the user ID as variable 'input' for userService query
    var input = {
      id: currentUserEmail
    };
    frmEditProfile.imgUser.base64 = "driverdefault.png";
    
    
    // Fill edit profile fields
    application.service("userService").invokeOperation(
      "user", {}, input,
      function(result) { 
        var firstName = result.value[0].userInfo.firstName;
        var surname = result.value[0].userInfo.lastName;
        var avatarBase64 = result.value[0].userInfo.avatarDocId;
        frmEditProfile.txtFirstName.text = firstName;
        frmEditProfile.txtSurname.text = surname;
          frmEditProfile.imgUser.base64 = avatarBase64;
      },
      function(error) {
        // the service returns 403 (Not Authorised) if credentials are wrong
        tuta.util.alert("userService error " + error);

      }
    );
      
    /*
    this.control("btnCancel").onClick = function (button) {tuta.forms.frmMap.show();};
    this.control("btnSubmit").onClick = function (button) {
      tuta.events.logIssue();
    };*/
    
    this.control("btnBack").onClick = function (button) {kony.application.getPreviousForm().show();};
    
    this.control("cmrTakePhoto").onCapture = function() {
      frmEditProfile.imgUser.rawBytes = frmEditProfile.cmrTakePhoto.rawBytes;
    };
    
    this.control("btnImportPicture").onClick = function() {
      
      function openGallery() {
        var querycontext = {mimetype: "image/*"};
        var returnStatus = kony.phone.openMediaGallery(onselectioncallback,
                                                       querycontext);
      }
      
      function onselectioncallback(rawbytes) {
        if (rawbytes === null) {
          return;
        }
        frmEditProfile.imgUser.rawBytes = rawbytes;
      }
      
      openGallery();
    };
    
    this.control("btnSave").onClick = function (button) {
      //Store the user ID as variable 'input' for manageService query
      frmEditProfile.flexUpdatingProfile.isVisible = true;
      var avatarBase64 = kony.convertToBase64(frmEditProfile.imgUser.rawBytes);
      
      var inputs = {
        data: JSON.stringify({
          firstName : frmEditProfile.txtFirstName.text,
          lastName : frmEditProfile.txtSurname.text,
          avatarDocId: avatarBase64
        }),
        id: currentUserEmail
      };
      
      application.service("manageService").invokeOperation(
      	"userInfoUpdate", {}, inputs,
        function(success) {
          tuta.util.alert("Success", "Info has been updated");
          frmEditProfile.flexUpdatingProfile.isVisible = false;
          initialProfilePic = avatarBase64;
          initialUserName = frmEditProfile.txtFirstName.text + " " + frmEditProfile.txtSurname.text;
          //tuta.forms.frmMap.show();
        }, function(error) {
          frmEditProfile.flexUpdatingProfile.isVisible = false;
          tuta.util.alert("Error Saving Data", JSON.stringify(error));
        }
      );
      
    };
   // PUT BUTTONS HERE
    
  };
  
  tuta.forms.frmEditProfile.onPostShow = function(form) {
    var self = this;
  };
};
