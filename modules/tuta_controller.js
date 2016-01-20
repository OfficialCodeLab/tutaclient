if (typeof(tuta) === "undefined") {
	tuta = {};
}

tuta.controller = function(form, widgets) {
  var self = this;
  
  this.form = form;
  this.initI = form.init;
  this.preShowI = form.preShow;
  this.postShowI = form.postShow;
  this.onHideI = form.onHide;

  // array to store widgets to dynamically control visibility
  this.managedWidgets = [];
  
  // if the widget tag information is passed in as part of the constructor
  // just assign this array
  if(widgets) this.managedWidgets = widgets;
  
  // override events already defined by developer
  this.form.init = function(pForm) {
    // call original init
    if(self.initI) self.initI(pForm);
    
    // call controller init
    // form.init is called after the widget hierarchy is available
    if(self.onInit) self.onInit(pForm);
  	
  };
  
  this.form.preShow = function(pForm) {
    // call original preShow
  	if(self.preShowI) self.preShowI(pForm);
    
    // call controller onPreShow
    if(self.onPreShow) self.onPreShow(pForm);

  };
  
  this.form.postShow = function(pForm) {
    // call original postShow
  	if(self.postShowI) self.postShowI(pForm);
    
    // call controller onPostShow
    if(self.onPostShow) self.onPostShow(pForm);
  
  };
  
  this.form.onHide = function(pForm) {
    // call original postShow
  	if(self.onHideI) self.onHideI(pForm);
    
    // call controller onPostShow
    if(self.onHide) self.onHide(pForm);
  
  };

  
};

tuta.controller.prototype.show = function() {
	this.form.show();  
};

tuta.controller.prototype.control = function(id) {
	return this.form[id];  
};

tuta.controller.prototype.manageWidget = function(widgetId, defaultVisibility, ptags) {
	this.managedWidgets.push( { id: widgetId, visible: defaultVisibility, tags: ptags  });	  
};


/*
 NB! can only be called in postShow
*/
tuta.controller.prototype.header = function(id) {
  var header = kony.application.getCurrentForm().headers[0];
  
  if(id === undefined) return header;
  return header[id];
};

tuta.controller.prototype.footer = function(id) {
  var footer = kony.application.getCurrentForm().footers[0];
  
  if(id === undefined) return footer;
  return footer[id];
};

