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
              //tuta.util.alert("LOGIN SUCCESS", result.value);
              tuta.animate.moveBottomLeft(frmSplash.flexMainButtons, 0, "0%", "0", null);
                //Check for app states, resume accordingly.

                //kony.store.setItem("watch", watchID);
                //kony.store.removeItem("watch");
                //kony.store.getItem("user");
                //kony.store.setItem("user", JSON.stringify(inputs <This is the json struct> ));

                ksAppState = kony.store.getItem("storedAppState");

                if (ksAppState.tripState == 1){
                  //User was idle, continue as normal
                  tuta.forms.frmMap.show();
                }
                else if (ksAppState.tripState == 2){
                  //User was hailing a driver. Continue to hail the driver.
                  inputBooking = ksAppState.storedBooking;




                  tuta.forms.frmMap.show();
                }
                else if (ksAppState.tripState == 3){
                  /*User was waiting for driver! 
                    1. Draw route
                    2. Track driver

                    Need to start all timers that wait for the driver
                    app to tell client app that customer is picked up*/
                    inputBooking = ksAppState.storedBooking;





                    tuta.forms.frmMap.show();
                }
                else if (ksAppState.tripState == 4){
                  /*User was in transit!
                  Track the user along the route,
                  run the relevant methods to draw the route,
                  run the timer that waits for the driver app
                  to drop the customer off.*/
                  inputBooking = ksAppState.storedBooking;




                  tuta.forms.frmMap.show();
                }
                else{
                  ksAppState.tripState = 1;
                  tuta.forms.frmMap.show();
                }



                
                //Move to next form
            },
            function(error) {
                // the service returns 403 (Not Authorised) if credentials are wrong
              if(error.httpStatusCode + "" == "403"){
                tuta.util.alert("Invalid Credentials", "Your username and password combination was wrong, please try again.");
              }
                //tuta.util.alert(error);
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
      	var inputParams = { 
          id : "craig@ssa.com", 
          data : JSON.stringify( {  location : { lat : "234234", long : "234234234" }}   ) 
        };
      
      	application.service("manageService").invokeOperation(
        	"userUpdate", {}, inputParams, function(success) {
              
            },
          	function(error) {
              
            }
        );
      	
    } ; 
  };
};

