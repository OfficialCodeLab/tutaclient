
/**
 * TUTA Mobile namespace
 * @namespace tuta.mobile
 */
if (typeof(tuta) === "undefined") {
	tuta = {};
}

/**
 * Application instance for TUTA apps
 * @param initCallback callback for successful mbaas init
 */
tuta.application = function(initCallback) {
	var self = this;
	self.client = new kony.sdk();
	self.client.init(	tuta.config.appKey, 
						tuta.config.appSecret, 
						tuta.config.serverUrl,
						function(success) {
							kony.print("TUTA: App init OK");
      						
							self.serviceDocument = success;
							self.identity = self.client.getIdentityService(tuta.config.idService);
							
							if(initCallback !== undefined) {
								initCallback();
							}
						},
						function(error) {
							self.defaultError(error);
							kony.print("TUTA: App init failed");
							kony.print("TUTA: " + error);
						} );
};

/**
 * Application login for TUTA apps
 * @param user credentials 
 * @param callback for successful mbaas login
 */
tuta.application.prototype.login = function(user, pass, callback) {
	var self = this;
	if(self.identity === undefined) {
		if(callback !== undefined) {
			kony.print("TUTA: App not initialized");
			callback(null,{ errorcode: 100, errormessage : "App not initialized"});
		}
		
		return;
	}
	
	self.identity.login({ userid: user, password : pass},
		function(success) {
			if(callback !== undefined) {
				callback();
				kony.print("TUTA: Login success");
			}
		}, 
		function(error) {
			if(callback !== undefined) {
				kony.print("TUTA: Login failure");	
				callback(null,{ errorcode: 101, errormessage : "login failed"});
			}
		});
};

/**
 * Get application service definition
 * @param serviceName 
 */
tuta.application.prototype.service = function(serviceName) {
	return this.client.getIntegrationService(serviceName);
};

/**
 * Default fallback error for failed initialization
 * @param message error message
 */
tuta.application.prototype.defaultError = function(message) {
	// present something informative here
  	this.alert("ERROR", message);
};

tuta.application.prototype.alert = function (title,message) {
  tuta.util.alert(title,message);
};