
if (typeof(tuta) === "undefined") {
	tuta = {};
}

tuta.events = {};

function showNow(){
  if(sliderDir == 1){    
    sliderDir = 0;
    kony.timer.schedule("reset", function() {   
      frmConfirm.imgNow.src = "slidernow.png";
      sliderDir = 2;
      frmConfirm.lblDateTime.setVisibility(true); 
      frmConfirm.lblTime.setVisibility(false);
      frmConfirm.btnSetTime.setVisibility(false);  
      frmConfirm.lblDateTimeNew.setVisibility(false);
    }, 0.25, false);
    tuta.animate.move(frmConfirm.imgNow, 0.25, "0", "-15", null);
  }
}

function showLater(){
  if(sliderDir == 2){    
    sliderDir = 0;
    kony.timer.schedule("reset", function() {   
      frmConfirm.imgNow.src = "sliderlater.png";
      sliderDir = 1;
      frmConfirm.lblDateTimeNew.setVisibility(true);
      frmConfirm.lblDateTime.setVisibility(false); 
      frmConfirm.scrollToBeginning();
      kony.timer.schedule("showDateTime", function(){
        frmConfirm["flexDateTime"]["isVisible"] = true;                                                     
        frmConfirm.btnSetTime.setVisibility(true);
      }, 0.3, false);  
    }, 0.25, false);
    tuta.animate.move(frmConfirm.imgNow, 0.25, "0", "110", null);
  }
}

function toggleImage(widget){
  if (widget.isVisible === false)
  {
    widget["isVisible"] = true;
  }
  else{
    widget["isVisible"] = false;
  }
}


var storedTrips = [];
tuta.events.loadTripHistory = function(callback){
  tuta.retrieveBookingsHistory(function(results, error){
    if(error === undefined){

      storedTrips = [];
      for (var j = 0; j < results.value.length; j++){storedTrips.push({});}
      for (var i = 0; i < results.value.length; i++){
        try{     
          var date = tuta.events.dateStringLong(results.value[i].info.date);
          //TODO GET DRIVER NAME AND IMAGE FROM DATABASE
          storedTrips[i] = {
            "name" : results.value[i].providerId,
            "start" : results.value[i].address.start,
            "end" : results.value[i].address.end,
            "date" : date,
            "cost" : "R" + results.value[i].info.cost,
            "rating" : results.value[i].info.driverRating,
            "driverImg" : "profilepicbookingnew.png", //TODO: replace with real profile pic
            "tripImg" : "map2.png"//TODO: QUERY STATIC MAPS API TO GET IMAGE
          };
        }
        catch(ex){
          //callback(null, "An error occurred.");
        }

      }
      frmTrip.segTripHistoryMain.widgetDataMap = { "lblCost"  : "cost", "lblDateTime" : "date"};
      frmTrip.segTripHistoryMain.setData(storedTrips);
      callback("success");



    }
    else{
      callback(null, "Server error. Please retry.");
    }
  });


};

tuta.events.logIssue = function (){
  
  
  var input = {
    userId : currentUser.userName,
    providerId : GLOBAL_PROVIDER_EMAIL,
    email : frmHelp.txtEmail.text.toLowerCase().replace(" ", ""),
    userName : frmHelp.txtName.text,
    companyName : frmHelp.txtCompanyName.text,
    queryTopic : frmHelp.lbxQuery.selectedKeyValue[1],
    queryFull : frmHelp.txtareaEditIssue.text,
    date : (new Date()).getTime(),
    status : "Pending"
  };
  
  var data = { data : JSON.stringify(input) };
  
  //tuta.util.alert("TEST", (new Date()).getTime());
  
  
  
  application.service("manageService").invokeOperation(
  "logIssueAdd", {}, data,
  function(success){
    tuta.util.alert("Issue Logged!", "Please check your emails and keep this id as reference : " + success.value[0].id);
    tuta.forms.frmMap.show();
  },function(error){
    tuta.util.alert("Error", error);
    
  });
  
};


tuta.events.directionsMaps = function (address){
  kony.application.openURL("http://maps.google.com/maps?f=d&daddr=" + address +
                             "&sspn=0.2,0.1&nav=1");
};


tuta.events.dateString = function(epoch){
  var newDate = epoch.substring(0, epoch.length-3);
  var date = new Date(parseInt(newDate) * 1000);
  var hours = date.getHours();
  var mins = date.getMinutes();
  if (hours < 10){
    hours = "0" + hours;    
  }
  
  if (mins < 10){
    mins = "0" + mins;    
  }
  
  return hours + ":" + mins;
};

tuta.events.dateStringLong = function(epoch){
  var newDate = epoch.substring(0, epoch.length-3);
  var date = new Date(parseInt(newDate) * 1000);
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var hours = date.getHours();
  var mins = date.getMinutes();
  if (hours < 10){
    hours = "0" + hours;    
  }
  
  if (mins < 10){
    mins = "0" + mins;    
  }
  
  if (day < 10){
    day = "0" + day;    
  }
  
  if (month < 10){
    month = "0" + month;    
  }
  
  return day + "/" + month + "/" + year + "   " + hours + ":" + mins;
};