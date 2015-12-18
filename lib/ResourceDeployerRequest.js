'use strict';


var ResourceDeployerRequest = function(values, resource) {

  var segments = [];
  var deploymentSource = 'camunda-modeler';
  var response = [];

  segments.push('Content-Disposition: form-data; name="data"; filename="' + values.filename + '"\r\nContent-Type: text/xml\r\n\r\n' + resource + '\r\n');
  segments.push('Content-Disposition: form-data; name="deployment-name"\r\n\r\n modeler-deployment \r\n');
  segments.push('Content-Disposition: form-data; name="deployment-source"\r\n\r\n' + deploymentSource + '\r\n');

  var req = new XMLHttpRequest();
  req.onload = function(evt) {
    if(evt.target.readyState === 4) {

      if(evt.target.status === 200) {

        response = {
          status: 'Deployment successful',
          message: JSON.parse(evt.target.responseText)
        };

      }

      else {

        response = {
          status: 'Deployment failed',
          message: JSON.parse(evt.target.responseText)
        };
      }

    }

    return response;
  };

  req.open('post', values.apiUrl, true);

  var sBoundary = '---------------------------' + Date.now().toString(16);
  req.setRequestHeader('Content-Type', 'multipart\/form-data; boundary=' + sBoundary);

  var sData = '--' + sBoundary + '\r\n' + segments.join('--' + sBoundary + '\r\n') + '--' + sBoundary + '--\r\n';

  req.send(sData);

};

module.exports = ResourceDeployerRequest;
