
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
