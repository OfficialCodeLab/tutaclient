function AS_Button_6fb3e7ee4e5f4a258d148728de591191(eventobject) {
function ROTATE_ACTION____02cc9b7970034954aa2b6bc98faaf7cd_Callback(){

}

var trans100 = kony.ui.makeAffineTransform();
trans100.rotate(50);
frmDebug["imgCar1"].animate(
kony.ui.createAnimation({"100":{"anchorPoint":{"x":0.5,"y":0.5},"stepConfig":{"timingFunction":kony.anim.EASE},"transform":trans100}}),
{"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":0.25},
 {"animationEnd" : ROTATE_ACTION____02cc9b7970034954aa2b6bc98faaf7cd_Callback});

}