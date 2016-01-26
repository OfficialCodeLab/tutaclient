
function onPeopleSelect(eventobject, x , y) {
  var nopeople = eventobject.id.replace("btnPerson","");
  if(nopeople === lastPersonClicked && nopeople > 1)
  {
    nopeople--;
    lastPersonClicked = 0;
  }
  else
    lastPersonClicked = nopeople;

  for(var i = 0; i < nopeople; i++) {
    people[i].src = "personselected.png";
  }
  for(var j = nopeople; j < 6; j++) {
    people[j].src = "person.png";
  }
}

function onStarSelect(eventobject, x , y) {
  var nostar = eventobject.id.replace("imgStar","");
  if(nostar === lastStarSelected && nostar > 1)
  {
    nostar--;
    lastStarSelected = 0;
  }
  else
    lastStarSelected = nostar;

  for(var i =0; i < nostar; i++) {
    star[i].src = "starselected.png";
  }
  for(var j = nostar; j < 5; j++) {
    star[j].src = "starunselected.png";
  }
} 

function setUpSwipes(){ 
  frmMap.flexNoPanning.addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, GLOBAL_GESTURE_FINGERS_1,  function(widget, gestureInformationSwipe) {

  });
  
  frmCreateAcc.flexCreatingAccount.addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, GLOBAL_GESTURE_FINGERS_1,  function(widget, gestureInformationSwipe) {

  });

  frmMap.flexSwiper.addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, GLOBAL_GESTURE_FINGERS_1,  function(widget, gestureInformationSwipe) {
    if(gestureInformationSwipe.swipeDirection == 2) { //RIGHT
      //tuta.renderFinalRoute();
    }
  });

}