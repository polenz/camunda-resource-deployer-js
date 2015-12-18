# Camunda Resource Deployer JS

A simple UI Component which can be used to deploy a resource (BPMN File, DMN File, CMMN file) to Camunda Process Engine using the REST API.

![screenshot](https://github.com/polenz/camunda-resource-deployer-js/blob/master/assets/screenshot.png)


## How to use it

Embedding the Component.

> Checkout the [examples](https://github.com/polenz/camunda-resource-deployer-js-example) in order
to learn how you can use the component.

In a browserify enabled web project, you can simply install the component:

```bash
npm install camunda-resource-deployer-js --save
```

Now you can bootstrap the component somewhere in your ui code:

```js
var ResourceDeployer = require('camunda-resource-deployer-js');

var deployer = new ResourceDeployer({
  container: containerElement,
  resourceProvider: function(done) {
    // load the resource and call done() with the result
  }
});
```
The above code instantiates a new ResourceDeployer which renders it's dom nodes as child elements of `containerElement`.
In addition, a `resourceProvider` is passed in which allows the component to load the resource to be deployed.

The component can be removed by calling

```js
resourceDeployer.close();
```

## Enable cors on the server

When using this component you will be performing a corss origin request. In order for this to work, you need to enable CORS on the server.

> NOTE: the following only works for Apache Tomcat.

Edit the file `server/apache-tomcat-8.0.24/webapps/engine-rest/WEB-INF/web.xml` and add the following content:

```xml
<filter>
  <filter-name>CorsFilter</filter-name>
  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
  <init-param>
    <param-name>cors.allowed.origins</param-name>
    <param-value>*</param-value>
  </init-param>
</filter>
<filter-mapping>
  <filter-name>CorsFilter</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```
