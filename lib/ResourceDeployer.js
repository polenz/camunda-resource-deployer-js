var fs = require('fs');

var template = fs.readFileSync(__dirname + '/template.html', { encoding: 'utf-8' }),
    deploy = require('./DeploymentHelper');

var domify = require('min-dom/lib/domify'),
    domQuery = require('min-dom/lib/query'),
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

  this.model = {
    filename: options.filename,
    apiUrl: options.apiUrl,
    log: ''
  };

  this._init(current);
  this._bind(current);
};

ResourceDeployer.prototype._init = function(current) {
  var container = current.container;

  var renderedTemplate = domify(template);
  current.panel = renderedTemplate;

  container.appendChild(renderedTemplate);
};

ResourceDeployer.prototype._bind = function(current) {

  var panel = current.panel;
  var self = this;

  // bind text fields
  domDelegate.bind(panel, 'input[type=text]', 'input', function onInput(event) {

    var node = event.delegateTarget,
        valueKey = domAttr(node, 'name'),
        value = node.value;

    var update = {};
    update[valueKey] = value;

    self._updateModel(update);
    self._applyModel();
  });

  // bind buttons
  domDelegate.bind(panel, 'button[data-action]', 'click', function onInput(event) {

    var node = event.delegateTarget,
        action = domAttr(node, 'data-action');

    self._onAction(action);
    self._applyModel();
  });

  // read initial values:

  this._applyModel();
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
    if (input.className === 'djs-resource-deployer-console') {
      input.scrollTop = input.scrollHeight;
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
  var self = this;

  if(actionId == 'deploy') {
    
    var model = this.model;
    var actualDateTime = new Date();
    model.log += actualDateTime.toLocaleString() + '\n';
    model.log += 'deploying to '+model.apiUrl+'...\n';

    this.current.resourceProvider(function(err, xml) {

      var req = {
        apiUrl: model.apiUrl + '/deployment/create',
        filename: model.filename
      };

      deploy(req, xml, function(err, res) {

        if(err) {
          model.log += 'Deployment failed :(\n\n';
          // TODO: log error
        }
        else {
          model.log += "Deployment successful\n\n";
        }

        self._applyModel();

      });

    });
    
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
