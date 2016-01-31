if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.forms) === "undefined") {
	tuta.forms = {};
}

tuta.forms.frmTrip = function() {
// initialize controller 
  tuta.forms.frmTrip = new tuta.controller(frmTrip); 

  // Initialize form events	
  tuta.forms.frmTrip.onInit = function(form) {
  };  
  
  
  tuta.forms.frmTrip.onPreShow = function(form) {
    var self = this;
    
    this.control("btnBack").onClick = function(button){tuta.forms.frmMap.show();};
    //this.control("btnContinue").onClick = function(button){tuta.mobile.alert("TEST", "TEST");};
    this.control("segTripHistoryMain").onRowClick = function(widget) {
      var data;
      data = frmTrip.segTripHistoryMain.selectedItems[0];
      
      //TODO SHORTEN TEXT ON ADDRESS FIELDS
      frmSelectedTrip.lblDateTime.text = data.date;
      frmSelectedTrip.lblPickup.text = data.start;
      frmSelectedTrip.lblDropoff.text = data.end;
      frmSelectedTrip.lblCost.text = data.cost;
      frmSelectedTrip.lblRating.text = data.rating;
      tuta.fetchUser(data.name, function(user){
        frmSelectedTrip.lblDriverName.text = user.userInfo.firstName;
        if(user.userInfo.avatarDocId !== null && user.userInfo.avatarDocId !== undefined&& user.userInfo.avatarDocId !== "")
        	frmSelectedTrip.imgDriverProfile.base64 = user.userInfo.avatarDocId;
        
        tuta.forms.frmSelectedTrip.show(); 
        
      });
      
      var origin = {formatted_address: data.start};
      var dest = {formatted_address: data.end};
      
      tuta.location.directions(origin, dest, null, function(result, id){
        renderDirections(frmSelectedTrip.mapHistory,result,"0x0000FFFF", "pickupicon.png", "dropofficon.png");     
      }, "1");
    };
    tuta.map.stopMapListener();
  };
  
  tuta.forms.frmTrip.onPostShow = function(form) {
    var self = this;
    
    frmTrip.lblStatus.text = "Loading, please wait...";
    tuta.animate.move(frmTrip.flexLoading, 0, "165", 0, null);
    tuta.events.loadTripHistory(function(response, error){
      if(response !== null ){
        tuta.animate.move(frmTrip.flexLoading, 0, "165", "100%", null);
      } else{
        frmTrip.lblStatus.text = error;
      }
    });
    /*this.header("btnMenu").onClick =function(button) {
     	self.topMenu.toggle();
    };*/
  };
};

