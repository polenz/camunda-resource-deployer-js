# camunda-modeler-resource-deployer

## Enable cors on the server

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