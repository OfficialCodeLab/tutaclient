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
   
    self.control("btnConfirm").onClick = function(button) {
      //CHECK IF EXISTS
      
      var userEmail = self.control("txtEmail").text;

      if(userEmail === null || userEmail === "")
      {

      }
      else
      {
        var input = { id : userEmail};      

        application.service("userService").invokeOperation(
          "userExists", {}, input, function(success) {
            //tuta.util.alert("SUCCESS", success);
            if(success.value === null || success.value === [])
            {
              tuta.util.alert("CONTINUE", "");
            }
            else
            {
              tuta.util.alert("USER EXISTS", "");                
            }
          },
          function(error) {
            tuta.util.alert("ERROR", error);              
          }
        );

      }
      
      
      	var user = {
          _id : self.control("txtEmail").text,
          password: self.control("txtPass").text,
          userType: "private",
          location: {
          	lat : "1231231",
            long : "234234234"
        	}
        };
      
      //COMPARE PASSWORDS
      
      //GET LOCATION
      
      //SPLIT NAME
      
       var userInfo = [
                {
                    _id: self.control("txtEmail").txt,
                    firstName: self.control("txtName").txt,
                    lastName: self.control("txtName").txt,
                    mobileNumber: self.control("txtContact").txt,
                    addresses: [],
                    avatarDocId: "null",
                    lastModified: 1442393002779
                }
            ];
      
      	input = { data : JSON.stringify(user) }; 
      
      /*
      	application.service("manageService").invokeOperation(
        	"userAdd", {}, input, function(success) {
              
            },
          	function(error) {
              
            }
        );*/	
    };
  };
  
  tuta.forms.frmCreateAcc.onPostShow = function(form) {
    var self = this;
  };
};

