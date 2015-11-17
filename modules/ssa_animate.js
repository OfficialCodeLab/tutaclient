/**
 * SSA Mobile namespace
 * @namespace ssa.mobile
 */
if (typeof(ssa) === "undefined") {
	ssa = {};
}

ssa.animate = {};

ssa.animate.move = function(object, time, top, left, finish) {
  object.animate(
	kony.ui.createAnimation({"100":{"top":top, "left": left, stepConfig:{"timingFunction":kony.anim.EASE}}}),
{"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
 {"animationEnd" : function(){ if(finish) { finish(); }}});
};

ssa.animate.moveDelayed = function(object, time, delay, top, left, finish) {
  object.animate(
	kony.ui.createAnimation({"100":{"top":top, "left": left, stepConfig:{"timingFunction":kony.anim.EASE}}}),
{"delay":delay,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
 {"animationEnd" : function(){ if(finish) { finish(); }}});
};

ssa.animate.menuOpen = false;

ssa.animate.toggleMenu = function(form, func) {
  if(ssa.animate.menuOpen) {
  	ssa.animate.move(form.flexMenu,0.25, "0px", "-85%", func); 
    ssa.animate.move(form.flexMain,0.25, "0px", "0%", func); 
    ssa.animate.menuOpen = false;
  } else {
    ssa.animate.move(form.flexMenu,0.25, "0px", "0%", func); 
    ssa.animate.move(form.flexMain,0.25, "0px", "85%", func); 
    ssa.animate.menuOpen = true;
  }
};
