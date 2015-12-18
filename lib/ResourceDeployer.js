'use strict';

var template = require('./template.html');

var domify = require('min-dom/lib/domify'),
    domQuery = require('min-dom/lib/query'),
    domRemove = require('min-dom/lib/remove'),
    domClasses = require('min-dom/lib/classes'),
    domClosest = require('min-dom/lib/closest'),
    domAttr = require('min-dom/lib/attr'),
    domDelegate = require('min-dom/lib/delegate');

var assign = require('lodash/object/assign'),
    keys = require('lodash/object/keys'),
    endsWith = require('lodash/string/endsWith'),
    forEach = require('lodash/collection/forEach');

function addValidationError(validation, inputName, error) {
  var list = validation.inputName;
  if(!list) {
    list = [];
    validation[inputName] = list;
  }
  list.push(error);
}

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

  this.model = {};

  this._init(current);
  this._bind(current);
};

ResourceDeployer.prototype._init = function(current) {
  var container = current.container;

  var renderedTemplate = domify(template);

  container.appendChild(renderedTemplate);
};

ResourceDeployer.prototype._bind = function(current) {

  var container = current.container;
  var self = this;

  // bind text fields
  domDelegate.bind(container, 'input[type=text]', 'input', function onInput(event) {

    var node = event.delegateTarget,
        valueKey = domAttr(node, 'name'),
        value = node.value;

    var update = {};
    update[valueKey] = value;

    self._updateModel(update);
    self._applyModel();
  });

  // bind buttons
  domDelegate.bind(container, 'button[data-action]', 'click', function onInput(event) {

    var node = event.delegateTarget,
        action = domAttr(node, 'data-action');

    self._onAction(action);
    self._applyModel();
  });

  // read initial values:
  var values = {};
  var inputs = domQuery.all('input[type=text],textarea',this.current.container);
  forEach(inputs, function(input) {
    var propKey = domAttr(input, 'name');
    var propVal = input.value;
    values[propKey] = propVal;
  });
  this._updateModel(values);
};

ResourceDeployer.prototype._updateModel = function(update) {
  assign(this.model, update);
  
  var validationResult = this._onModelUpdate(keys(update));

  // apply validation result
  var inputs = domQuery.all('input[type=text]',this.current.container);
  forEach(inputs, function(input) {
    var errors = validationResult[domAttr(input, 'name')];
    // remove all old errors
    var nodes = domQuery.all('div[data-validation]', input.parentNode);
    // remove existing errors
    forEach(nodes, function(node) {
      input.parentNode.removeChild(node);
    });
    // add new errors (if applicable)
    forEach(errors, function(error) {
      input.parentNode.appendChild(domify('<div data-validation class="djs-validation-error">'+error+'</div>'));
    });
  });
};

ResourceDeployer.prototype._applyModel = function() {
  var inputs = domQuery.all('input[type=text],textarea',this.current.container);
  var model = this.model;
  forEach(inputs, function(input) {
    var modelVal = model[domAttr(input, 'name')];
    if(modelVal !== input.value) {
      input.value = modelVal;
    }
  });
};

ResourceDeployer.prototype._onModelUpdate = function(props) {
  var validation = {},
      model = this.model;

  // validate apiUrl
  if(!model.apiUrl) {
    addValidationError(validation, 'apiUrl', "Api Url is required");
  }

  // validate filname
  if(!model.filename) {
    addValidationError(validation, 'filename', "Filename is required");
  }
  if(model.filename && !(endsWith(model.filename, '.bpmn') || endsWith(model.filename, '.dmn'))) {
    addValidationError(validation, 'filename', "Filename must end in '.bpmn' or '.dmn'");
  }

  var btn = domQuery('button#deploy', this.current.container);
  btn.disabled = keys(validation).length > 0;

  return validation;
};

ResourceDeployer.prototype._onAction = function(actionId) {
  if(actionId == 'deploy') {
    this.model.log += 'deploying to '+this.model.apiUrl+'...\n';
  }
};

ResourceDeployer.prototype.close = function() {
  var container = this.current.container;

  // remove all children
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

module.exports = ResourceDeployer;