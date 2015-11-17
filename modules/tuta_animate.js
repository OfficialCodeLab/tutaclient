/**
 * TUTA Mobile namespace
 * @namespace tuta.mobile
 */
if (typeof(tuta) === "undefined") {
	tuta = {};
}

tuta.animate = {};

// MOVE
tuta.animate.move = function(object, time, top, left, finish) {
  object.animate(
	kony.ui.createAnimation({"100":{"top":top, "left": left, stepConfig:{"timingFunction":kony.anim.EASE}}}),
{"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
 {"animationEnd" : function(){ if(finish) { finish(); }}});
};

tuta.animate.moveTopRight = function(object, time, top, right, finish) {
  object.animate(
	kony.ui.createAnimation({"100":{"top":top, "right": right, stepConfig:{"timingFunction":kony.anim.EASE}}}),
{"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
 {"animationEnd" : function(){ if(finish) { finish(); }}});
};

tuta.animate.moveBottomLeft = function(object, time, bottom, left, finish) {
  object.animate(
	kony.ui.createAnimation({"100":{"bottom":bottom, "left": left, stepConfig:{"timingFunction":kony.anim.EASE}}}),
{"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
 {"animationEnd" : function(){ if(finish) { finish(); }}});
};

tuta.animate.moveBottomRight = function(object, time, bottom, right, finish) {
  object.animate(
	kony.ui.createAnimation({"100":{"bottom":bottom, "right": right, stepConfig:{"timingFunction":kony.anim.EASE}}}),
{"delay":0,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
 {"animationEnd" : function(){ if(finish) { finish(); }}});
};

// MOVE DELAYED
tuta.animate.moveDelayed = function(object, time, delay, top, left, finish) {
  object.animate(
	kony.ui.createAnimation({"100":{"top":top, "left": left, stepConfig:{"timingFunction":kony.anim.EASE}}}),
{"delay":delay,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
 {"animationEnd" : function(){ if(finish) { finish(); }}});
};

tuta.animate.moveDelayedTopRight = function(object, time, delay, top, right, finish) {
  object.animate(
	kony.ui.createAnimation({"100":{"top":top, "right": right, stepConfig:{"timingFunction":kony.anim.EASE}}}),
{"delay":delay,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
 {"animationEnd" : function(){ if(finish) { finish(); }}});
};

tuta.animate.moveDelayedBottomLeft = function(object, time, delay, bottom, left, finish) {
  object.animate(
	kony.ui.createAnimation({"100":{"bottom":bottom, "left": left, stepConfig:{"timingFunction":kony.anim.EASE}}}),
{"delay":delay,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
 {"animationEnd" : function(){ if(finish) { finish(); }}});
};

tuta.animate.moveDelayedBottomRight = function(object, time, delay, bottom, right, finish) {
  object.animate(
	kony.ui.createAnimation({"100":{"bottom":bottom, "right": right, stepConfig:{"timingFunction":kony.anim.EASE}}}),
{"delay":delay,"iterationCount":1,"fillMode":kony.anim.FILL_MODE_FORWARDS,"duration":time},
 {"animationEnd" : function(){ if(finish) { finish(); }}});
};

tuta.animate.menuOpen = false;

tuta.animate.toggleMenu = function(form, func) {
  if(tuta.animate.menuOpen) {
  	tuta.animate.move(form.flexMenu,0.25, "0px", "-85%", func); 
    tuta.animate.move(form.flexMain,0.25, "0px", "0%", func); 
    tuta.animate.menuOpen = false;
  } else {
    tuta.animate.move(form.flexMenu,0.25, "0px", "0%", func); 
    tuta.animate.move(form.flexMain,0.25, "0px", "85%", func); 
    tuta.animate.menuOpen = true;
  }
};
