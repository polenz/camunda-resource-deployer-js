'use strict';


var ResourceDeployerRequest = function(values, resource) {
  //$dialogScope.status = 'LOADING';

  var segments = [];
  var deploymentSource = 'camunda-modeler-resource-deployer';
  var response = [];

  segments.push('Content-Disposition: form-data; name="data"; filename="' + values.filename + '"\r\nContent-Type: text/xml\r\n\r\n' + resource + '\r\n');
  segments.push('Content-Disposition: form-data; name="deployment-name"\r\n\r\n' + values.filename + '\r\n');
  segments.push('Content-Disposition: form-data; name="deployment-source"\r\n\r\n' + deploymentSource + '\r\n');

  var req = new XMLHttpRequest();
  req.onload = function(evt) {
    if(evt.target.readyState === 4) {

      //$dialogScope.status = null;

      if(evt.target.status === 200) {
        currentModal = null;

        //var executeAfterDestroy = [];
        //executeAfterDestroy.push(function() {
        //  successCallback(JSON.parse(evt.target.responseText), resource);
        //});
        response = {
          status: 'Deployment successful',
          message: JSON.parse(evt.target.responseText), resource
        };

        $modalInstance.close(evt.target.responseText);
      }
      /*
      else if(evt.target.status === 401) {
        // broadcast that the authentication changed
        $rootScope.$broadcast('authentication.changed', null);
        // set authentication to null
        $rootScope.authentication = null;
        // broadcast event that a login is required
        // proceeds a redirect to /login
        $rootScope.$broadcast('authentication.login.required');
        return;
      }
      */
      else {

        //$dialogScope.$apply(function() {
        //  failCallback(JSON.parse(evt.target.responseText));
        //});
        response = {
          status: 'Deployment failed',
          message: JSON.parse(evt.target.responseText)
        };
      }

    }

    return response;
  };

  req.onReadyStateChange = function(evt) {
    response = {
      status: 'Deployment failed',
      message: JSON.parse(evt.target.responseText)
    };
  };

  req.open('post', values.apiUrl, true);

  var sBoundary = '---------------------------' + Date.now().toString(16);
  req.setRequestHeader('Content-Type', 'multipart\/form-data; boundary=' + sBoundary);

  var sData = '--' + sBoundary + '\r\n' + segments.join('--' + sBoundary + '\r\n') + '--' + sBoundary + '--\r\n';
  req.send(sData);

};

module.exports = ResourceDeployerRequest;
