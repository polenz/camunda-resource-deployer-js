'use strict';

var template = require('./template.html');

var domify = require('min-dom/lib/domify');

var ResourceDeployer = function(options) {
  var current = this.current = {};

  if(!options.container) {
    throw new Error("options.container is not defined.");
  }

  current.container = options.container;

  if(!options.resourceProvider) {
    throw new Error("options.resourceProvider is not defined.");
  }

  current.resourceProvider = options.resourceProvider;

  this._init(current);
};

ResourceDeployer.prototype._init = function(current) {
  var container = current.container;

  var renderedTemplate = domify(template);

  container.appendChild(renderedTemplate);
};

ResourceDeployer.prototype.close = function() {
  var container = this.current.container;

  // remove all children
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

module.exports = ResourceDeployer;