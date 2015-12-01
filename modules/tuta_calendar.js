//==========================================
// START CALENDAR AND DATEPICKER FUNCTIONS
//==========================================

if (typeof(tuta) === "undefined") {
	tuta = {};
}

tuta.calendar = {};

tuta.calendar.fixHours = function(){ 
  var txt = parseInt(frmConfirm.txtTimeHrs.text, 10);
  if (txt == txt){ //Checking for NaN
    if(txt <= 0){
      txt = 12;
    }
    else if (txt > 12 && txt < 24){
      txt -= 12;
      frmConfirm.lblAmPm.text = "PM";
    }  
    else if (txt > 24){
      txt = 12;
      if(frmConfirm.lblAmPm.text == "AM")
        frmConfirm.lblAmPm.text = "PM";      
    }

  }
  else
  {        
    frmConfirm.txtTimeHrs.text = "";
    return;
  }

  frmConfirm.txtTimeHrs.text = Math.round(txt) + "";
};

tuta.calendar.fixMins = function(){
  var txt = parseInt(frmConfirm.txtTimeMins.text, 10);

  if(txt == txt){ 
    if(txt >=60){
      txt = 0;
      frmConfirm.txtTimeMins.text = "00";
      var x = 1;
      x += parseInt(frmConfirm.txtTimeHrs.text, 10);
      frmConfirm.txtTimeHrs.text = Math.round(x) + "";      
    }
  }
  else
  {        
    frmConfirm.txtTimeMins.text = "";
    return;
  }
};

tuta.calendar.fixMins2 = function(){
  var txt = parseInt(frmConfirm.txtTimeMins.text, 10);

  if(txt == txt){
    if(txt < 10){
      frmConfirm.txtTimeMins.text = "0" + Math.round(txt);
    }
  }
  else
    return;
};

tuta.calendar.addOne = function(txt){
  var newVal = parseInt(txt, 10) + 1;
  return Math.round(newVal) + "";
};

tuta.calendar.minusOne = function (txt, mins){
  var newVal = parseInt(txt, 10) - 1;
  if(newVal < 0 && mins === true)
  {
    frmConfirm.txtTimeHrs.text = tuta.calendar.minusOne(frmConfirm.txtTimeHrs.text, false); 
    fixHours();
    return 59;
  }
  else if (newVal <= 0 && mins === false){
    tuta.calendar.changeAmPm();
    return 12;
  }
  return Math.round(newVal) + "";
};

tuta.calendar.changeAmPm = function(){
  if (frmConfirm.lblAmPm.text == "AM")
    frmConfirm.lblAmPm.text = "PM";
  else
    frmConfirm.lblAmPm.text = "AM";
};

tuta.calendar.getMonth = function (month){
  return (months.track)+1;
};

tuta.calendar.getHour = function (hour, meridian){
  if(meridian.toLowerCase() === "pm")
    return hour+12;

  return hour;

};

tuta.calendar.setNewTime = function (){
  var newTime = frmConfirm.txtTimeHrs.text + ":" + frmConfirm.txtTimeMins.text + " " + frmConfirm.lblAmPm.text;
  var newDate = frmConfirm.lblDay.text + " " + frmConfirm.lblMonth.text + " " + frmConfirm.lblYear.text;


  timeformatted.day = parseInt(frmConfirm.lblDay.text);
  timeformatted.month = tuta.calendar.getMonth(frmConfirm.lblMonth.text);
  timeformatted.year = parseInt(frmConfirm.lblYear.text);
  timeformatted.mins = parseInt(frmConfirm.txtTimeMins.text);
  timeformatted.meridian = (frmConfirm.lblAmPm.text).toLowerCase();
  timeformatted.hours = tuta.calendar.getHour(parseInt(frmConfirm.txtTimeHrs.text), timeformatted.meridian);


  frmConfirm.lblDateTimeNew.text = newDate + " - " + newTime;
  frmConfirm.flexDateTime.setVisibility(false);
};

tuta.calendar.enableChangeTime = function (){
  frmConfirm.flexDetails2.height = 215;
  frmConfirm.lblTime.setVisibility(true);
  frmConfirm.btnSetTime.setVisibility(true);
};

tuta.calendar.disableChangeTime = function (){
  frmConfirm.flexDetails2.height = 185;
  frmConfirm.lblTime.setVisibility(false);
  frmConfirm.btnSetTime.setVisibility(false);  
};


tuta.calendar.onMonthChange = function(bool){
  if(bool === 1)
    tuta.calendar.cyclicIncrement(months);
  else if (bool === 0)
    tuta.calendar.cyclicDecrement(months);

  tuta.calendar.setUpDays(frmConfirm.lblMonth.text);
  var selectedDay = parseInt(frmConfirm.lblDay.text, 10);
  if(selectedDay > days.values.length) {
    frmConfirm.lblDay.text = days.values[days.values.length-1];
    days.track = days.values.length-1;
  }
};

tuta.calendar.onYearChange = function (bool){
  if(bool === 1)
    tuta.calendar.cyclicIncrement(years);
  else if (bool === 0)
    tuta.calendar.cyclicDecrement(years);

  tuta.calendar.setUpDays("Feb");
  var selectedDay = parseInt(frmConfirm.lblDay.text, 10);
  if(selectedDay > days.values.length) {
    frmConfirm.lblDay.text = days.values[days.values.length-1];
    days.track = days.values.length-1;
  }
};

tuta.calendar.cyclicIncrement = function (obj){
  if(obj.values.length-1 === obj.track)
    obj.track = 0;
  else
    obj.track++;

  tuta.calendar.updateObj(obj);
};

tuta.calendar.cyclicDecrement = function (obj){
  if(obj.track === 0)
    obj.track = obj.values.length -1;
  else
    obj.track--;  

  tuta.calendar.updateObj(obj);
};

tuta.calendar.updateObj = function (obj){  
  switch (obj.label){
    case "d":
      frmConfirm.lblDay.text = obj.values[obj.track];
      break;

    case "m":
      frmConfirm.lblMonth.text = obj.values[obj.track];
      break;

    case "y":
      frmConfirm.lblYear.text = obj.values[obj.track];
      break;
  }
};

tuta.calendar.setUpDays = function (month){
  if(month == "Apr" || month == "June" || month == "Sep" || month == "Nov") { //30
    tuta.calendar.pushPopNumbers(30);   
  }
  else if (month == "Feb") { //28 or 29
    var leap = parseInt(frmConfirm.lblYear.text, 10);
    if(leap % 4 === 0)
      tuta.calendar.pushPopNumbers(29);	
    else
      tuta.calendar.pushPopNumbers(28);      
  }
  else { //31
    tuta.calendar.pushPopNumbers(31);     
  }
};

tuta.calendar.pushPopNumbers = function (x){
  if(days.values.length < x)
  {
    for(var i = 1; i <= x; i++){
      if(i >= 10)
        days.values[i-1] = "" + i;
      else
        days.values[i-1] = "0" + i; 
    }
  }
  else {
    while(days.values.length > x)
      days.values.pop();
  }    
};

//==========================================
// END CALENDAR AND DATEPICKER FUNCTIONS
//==========================================
