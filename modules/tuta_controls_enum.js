if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.controls) === "undefined") {
	tuta.controls = {};
}

tuta.controls.position = {
  LEFT : 0,
  RIGHT : 1,
  TOP : 2,
  BOTTOM : 3
};

tuta.controls.behavior = {
  MOVE_OVER : 1,
  OVERLAY : 2,
};
