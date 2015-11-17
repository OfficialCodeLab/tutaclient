
/**
 * SSA Mobile namespace
 * @namespace ssa.mobile
 */
if (typeof(ssa) === "undefined") {
	ssa = {};
}

/**
 * Application instance for SSA apps
 * @param initCallback callback for successful mbaas init
 */
ssa.application = function(initCallback) {
	var self = this;
	self.client = new kony.sdk();
	self.client.init(	ssa.config.appKey, 
						ssa.config.appSecret, 
						ssa.config.serverUrl,
						function(success) {
							kony.print("SSA: App init OK");
      						
							self.serviceDocument = success;
							self.identity = self.client.getIdentityService(ssa.config.idService);
							
							if(initCallback !== undefined) {
								initCallback();
							}
						},
						function(error) {
							self.defaultError(error);
							kony.print("SSA: App init failed");
							kony.print("SSA: " + error);
						} );
};

/**
 * Application login for SSA apps
 * @param user credentials 
 * @param callback for successful mbaas login
 */
ssa.application.prototype.login = function(user, pass, callback) {
	var self = this;
	if(self.identity === undefined) {
		if(callback !== undefined) {
			kony.print("SSA: App not initialized");
			callback(null,{ errorcode: 100, errormessage : "App not initialized"});
		}
		
		return;
	}
	
	self.identity.login({ userid: user, password : pass},
		function(success) {
			if(callback !== undefined) {
				callback();
				kony.print("SSA: Login success");
			}
		}, 
		function(error) {
			if(callback !== undefined) {
				kony.print("SSA: Login failure");	
				callback(null,{ errorcode: 101, errormessage : "login failed"});
			}
		});
};

/**
 * Get application service definition
 * @param serviceName 
 */
ssa.application.prototype.service = function(serviceName) {
	return this.client.getIntegrationService(serviceName);
};

/**
 * Default fallback error for failed initialization
 * @param message error message
 */
ssa.application.prototype.defaultError = function(message) {
	// present something informative here
  	this.alert("ERROR", message);
};

ssa.application.prototype.alert = function (title,message) {
  ssa.util.alert(title,message);
};