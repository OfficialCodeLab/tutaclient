function AS_Form_f430f76be06e467c8f1dc4c070056a2f() {
function MOVE_ACTION____a1ff04964bd44f9db6456cc5ad088ed5_Callback(){

}function MOVE_ACTION____4c166b2b81234ed2ba939659c6ebd0f6_Callback(){

}function MOVE_ACTION____5528027cc8564a4789542df5fc6c818f_Callback(){

}
frmMap["__missing_id__"].animate(
kony.ui.createAnimation({"100":{"centerX":"80%","stepConfig":{"timingFunction":kony.anim.EASIN_IN_OUT}}}),
{"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":0.25},
 {"animationEnd" : MOVE_ACTION____5528027cc8564a4789542df5fc6c818f_Callback});

frmMap["__missing_id__"].animate(
kony.ui.createAnimation({"100":{"centerX":"50%","stepConfig":{"timingFunction":kony.anim.EASIN_IN_OUT}}}),
{"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":0.25},
 {"animationEnd" : MOVE_ACTION____4c166b2b81234ed2ba939659c6ebd0f6_Callback});

frmMap["__missing_id__"].animate(
kony.ui.createAnimation({"100":{"centerX":"20%","stepConfig":{"timingFunction":kony.anim.EASE}}}),
{"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":0.25},
 {"animationEnd" : MOVE_ACTION____a1ff04964bd44f9db6456cc5ad088ed5_Callback});
if(hailState == 1) {
  renderDirections(frmMap.mapMain,finalroute,"0x0000FFFF","pickuppin.png","droppin.png");
  showProgress();
}

}