'use strict';

var TestHelper = require('../TestHelper');

var fs = require('fs');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var coreModule = require('bpmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection'),
    modelingModule = require('bpmn-js/lib/features/modeling');

describe('properties-panel', function() {

  var diagramXML = fs.readFileSync(__dirname + '/test.bpmn', { encoding: 'utf-8' });

  var testModules = [
    coreModule, selectionModule, modelingModule
  ];

  var container;
  var resourceDeployerContainer;
  var textCtx;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));


  beforeEach(inject(function(commandStack, canvas) {

    textCtx = {};

    var button = document.createElement('button');
    button.textContent = 'Toggle Deployer';
    
    resourceDeployerContainer = document.createElement('div');

    button.addEventListener('click', function() {
      TestHelper.toggleResourceDeployer(textCtx, resourceDeployerContainer);
    });

    container.appendChild(button);
    container.appendChild(resourceDeployerContainer);
  }));


  it('should do nothing', inject(function() {
    TestHelper.toggleResourceDeployer(textCtx, resourceDeployerContainer);
  }));

});
