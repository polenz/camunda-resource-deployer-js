'use strict';

var ResourceDeployerRequest = require('../../lib/ResourceDeployerRequest');

describe('resource-deployer-request', function() {

  var diagramXML = require('./test.bpmn');

  it('should create a request', function() {
    var values = {
      filename: 'myTestProcess',
      apiUrl : 'http://localhost:8080/engine/deployment/create'
    };
    var response = new ResourceDeployerRequest(values, diagramXML);

    expect(response).not.to.be.empty;
  });

});
