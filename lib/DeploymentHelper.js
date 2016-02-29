'use strict';


module.exports = function(values, resource, callback) {

  var segments = [];
  var deploymentSource = 'camunda-modeler';

  segments.push('Content-Disposition: form-data; name="data"; ' +
    'filename="' + values.filename + '"\r\nContent-Type: text/xml\r\n\r\n' + resource + '\r\n');
  segments.push('Content-Disposition: form-data; name="deployment-name"\r\n\r\n modeler-deployment \r\n');
  segments.push('Content-Disposition: form-data; name="deployment-source"\r\n\r\n' + deploymentSource + '\r\n');

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if(req.readyState === 4) {

      if(req.status === 200) {
        callback(null, 'success');
      }
      else {
        callback(req, 'error');
      }

    }
  };

  req.open('post', values.apiUrl, true);

  var sBoundary = '---------------------------' + Date.now().toString(16);
  req.setRequestHeader('Content-Type', 'multipart\/form-data; boundary=' + sBoundary);
  req.responseType = 'json';

  var sData = '--' + sBoundary + '\r\n' + segments.join('--' + sBoundary + '\r\n') + '--' + sBoundary + '--\r\n';

  req.send(sData);

};
