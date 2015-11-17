if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmLogin = function() {
	// initialize controller 
    tuta.forms.frmLogin = new tuta.controller(frmLogin); 

    tuta.forms.frmLogin.onPreShow = function(form) {
    var self = this;
	
    self.control("btnLogin").onClick = function(button) {

    	var inputs = { userName : self.control("txtUser").text , password : self.control("txtPass").text };
      
      	// try log user in
        application.service("userService").invokeOperation(
          	"login", {}, inputs,
            function(result) {
 				tuta.util.alert("LOGIN SUCCESS", result.value);
            },
            function(error) {
                // the service returns 403 (Not Authorised) if credentials are wrong
                tuta.util.alert(error);
            }
    	);
    };
      
    self.control("btnAdd").onClick = function(button) {
      	var user = {
          _id : "craig52@ssa.co.za",
          password: "mypass",
          userType: "private",
          location: {
          	lat : "1231231",
            long : "234234234"
        	}
        };
      
      	var input = { data : JSON.stringify(user) }; 
      
      	application.service("manageService").invokeOperation(
        	"userAdd", {}, input, function(success) {
              
            },
          	function(error) {
              
            }
        );
      
      	// user update example
      	var inputParams = { id : "craig@ssa.com", data : JSON.stringify( {  location : { lat : "234234", long : "234234234" }}   ) };
      
      	application.service("manageService").invokeOperation(
        	"userUpdate", {}, inputParams, function(success) {
              
            },
          	function(error) {
              
            }
        );
      	
    } ; 
  };
};

