if (typeof(tuta) === "undefined") {
	tuta = {};
}

if (typeof(tuta.controls) === "undefined") {
	tuta.controls = {};
}

tuta.controls.menu = function(flexContent, flexMenu, position, behavior, timeTaken) {

  	this._main = flexContent;
  	this._menu = flexMenu;
  	this._position = position;
  	this._behavior = behavior;
  	this._time = timeTaken;
  	this._open = false;
};

tuta.controls.menu.prototype.toggle = function(callback) {
    if(this._menu !== undefined) {
      if(this._open) {
        switch(this._position) {
        	case tuta.controls.position.LEFT : { 
              tuta.animate.move(this._menu,this._time, this._menu.top, "-" + this._menu.width, callback); 
              if(this._behavior == tuta.controls.behavior.MOVE_OVER ) tuta.animate.move(this._main,this._time, this._main.top, "0px", null);
              break;
        	}
            case tuta.controls.position.RIGHT : { 
              tuta.animate.move(this._menu,this._time,this._menu.top, "100%", callback); 
              if(this._behavior == tuta.controls.behavior.MOVE_OVER ) tuta.animate.move(this._main,this._time, this._main.top, "0px", null);
              break;
        	}
            case tuta.controls.position.TOP : { 
              tuta.animate.move(this._menu,this._time, "-" + this._menu.height, this._menu.left, callback); 
              if(this._behavior == tuta.controls.behavior.MOVE_OVER ) tuta.animate.move(this._main,this._time, "0%", this._main.left, null);
              break;
        	}
            case tuta.controls.position.BOTTOM : { 
              tuta.animate.move(this._menu,this._time, "100%", this._menu.left, callback); 
              if(this._behavior == tuta.controls.behavior.MOVE_OVER ) tuta.animate.move(this._main,this._time, "0%", this._main.left, null);
              break;
        	}
      	}
        this._open = false;
        
      } else {
        	switch(this._position) {
        		case tuta.controls.position.LEFT : { 
                  	tuta.animate.move(this._menu,this._time, this._menu.top, "0%", callback); 
                  	if(this._behavior == tuta.controls.behavior.MOVE_OVER ) tuta.animate.move(this._main,this._time, this._main.top, this._menu.width, null);
				  	break;	                
                }
                case tuta.controls.position.RIGHT : { 
              		tuta.animate.move(this._menu,this._time, this._menu.top, this.calcOffset(this._menu), callback); 
              		if(this._behavior == tuta.controls.behavior.MOVE_OVER ) tuta.animate.move(this._main,this._time, this._main.top, "-" + this._menu.width, null);
              		break;
        		}
                case tuta.controls.position.TOP : { 
                  tuta.animate.move(this._menu,this._time,"0%", this._menu.left, callback); 
                  if(this._behavior == tuta.controls.behavior.MOVE_OVER ) tuta.animate.move(this._main,this._time, this._menu.height, this._main.left, null);
                  break;
                }
				case tuta.controls.position.BOTTOM : { 
                  tuta.animate.move(this._menu,this._time,this.calcHOffset(this._menu), this._menu.left, callback); 
                  if(this._behavior == tuta.controls.behavior.MOVE_OVER ) tuta.animate.move(this._main,this._time, "-" + this._menu.height, this._main.left, null);
                  break;
                }                
            }
        	this._open = true;
      }
    }
};

tuta.controls.menu.prototype.calcOffset = function(menu) {
	if(menu.width.indexOf("%") > 0) {
      var newPos = 100 - parseInt(menu.width);
      return newPos + "%";
    }  
};

tuta.controls.menu.prototype.calcHOffset = function(menu) {
	if(menu.width.indexOf("%") > 0) {
      var newPos = 100 - parseInt(menu.height);
      return newPos + "%";
    }  
};