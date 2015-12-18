'use strict';

var TestHelper = require('../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var coreModule = require('bpmn-js/lib/core'),
    selectionModule = require('diagram-js/lib/features/selection'),
    modelingModule = require('bpmn-js/lib/features/modeling'),
    ResourceDeployer = require('../../lib/ResourceDeployer');

var domQuery = require('min-dom/lib/query');

describe('properties-panel', function() {

  var diagramXML = require('./test.bpmn');

  var testModules = [
    coreModule, selectionModule, modelingModule
  ];

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules
  }));


  beforeEach(inject(function(commandStack) {

    var resourceDeployer;

    var button = document.createElement('button');
    button.textContent = 'Toggle Deployer';
    
    var resourceDeployerContainer = document.createElement('div');

    button.addEventListener('click', function() {
      if(resourceDeployer) {  
        resourceDeployer.close();
        resourceDeployer = null;
      }
      else {
        var options = {
          container: resourceDeployerContainer,
          resourceProvider: function() {
          }
        };
        resourceDeployer = new ResourceDeployer(options);
      }
    });

    container.appendChild(button);
    container.appendChild(resourceDeployerContainer);
  }));


  it('should do nothing', inject(function() {

  }));

});
