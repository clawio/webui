/* jshint node: true */

var siteConfig = require('./site-config');

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'webui',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
     ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }


   ENV['apis'] = {
       authBaseUrl: siteConfig.authBaseUrl,
       metaDataBaseUrl: siteConfig.metaDataBaseUrl,
       dataBaseUrl: siteConfig.dataBaseUrl,
   };

  ENV['ember-simple-auth'] = {
      authorizer: 'authorizer:token',
      routeAfterAuthentication: 'admin.files.list-home',
      routeIfAlreadyAuthenticated: 'admin.files.list-home'
  };
  ENV['ember-simple-auth-token'] = {
	  serverTokenEndpoint: ENV['apis'].authBaseUrl+'token',
	  identificationField: 'username',
	  passwordField: 'password',
	  tokenPropertyName: 'access_token',
	  authorizationPrefix: 'Bearer',
	  authorizationHeaderName: 'Authorization',
	  headers: {},
  };


  return ENV;
};
