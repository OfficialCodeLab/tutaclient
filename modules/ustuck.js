var ustuck = {};

ustuck.services = function() {
	//this.odata = new ssa.mobile.odata("http://192.168.2.110:8000/ustuck/services");
  	this.odata = new ssa.mobile.odata("http://154.0.165.84:8000/ustuck/services");
}

ustuck.services.prototype.init = function(success) {
  	this.readyFunction = success;
  	frmSplash.rtDebug.text = "<span>Initializing Services...</span>";
	this.getServiceTypes();
}

ustuck.services.prototype.getServiceTypes = function() {
	var self = this;  

	self.odata.read("/Services", function(res) {
			self.serviceTypes = res;

      		// tell the app services are loaded
      		if(self.readyFunction != null) {
              self.readyFunction();
            }
		},
		function(e) {
      		ssa.mobile.alert("Coms Error", "Could connect to services");
		});
}

ustuck.services.prototype.login = function(userName, password, success, error) {
  	// log user in
  	var self = this;
  ssa.mobile.alert("TEST", "TEST");
  
  	// call the user login function import
	self.odata.call("/Users/login", "{ \"userName\" : \"" + userName + "\" , \"password\" : \"" + password + "\" }", 
		function(res) {
			// we have a user record store as part of the model	
      		self.user._id = res[0]._id;
      		self.user.userType = res[0].userType;

      		// get the user info for this user	
			self.odata.read("/UserInfo("+ userName + ")",
				function(res) {
					// store the user info as part of the model 
					self.user.userInfo = res[0];
              		kony.store.setItem("user", JSON.stringify(self.user));
					
              		if(success != null) { success(self.user); }
				},
				function(e) {
				});
		},
		function(e) {
			if(error != null) error(e);
		});
}

