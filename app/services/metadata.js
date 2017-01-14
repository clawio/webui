import Ember from "ember";
import ENV from "webui/config/environment";

export default Ember.Service.extend({
  session: Ember.inject.service('session'),

  createHomeTree() {
    let self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        Ember.$.ajax({
          headers: headers,
          url: ENV.apis.metaDataBaseUrl + "init",
          type: "POST",
        }).done(function () {
          resolve();
        }).fail((error) => {
          reject(error);
        });
      });
    });
  },

  createTree(path) {
    path = encodeURIComponent(path);
    let self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        Ember.$.ajax({
          headers: headers,
          url: ENV.apis.metaDataBaseUrl + "makefolder",
          type: "POST",
          data: JSON.stringify({path}),
          contentType: "application/json",
        }).done(function () {
          resolve();
        }).fail((error) => {
          reject(error);
        });
      });
    });
  },

  move(fromPath, targetPath) {
    // clean path. Remove first and last slashes.
    fromPath = fromPath.replace(/^\/|\/$/g, '');
    targetPath = targetPath.replace(/^\/|\/$/g, '');
    fromPath = encodeURIComponent(fromPath);
    targetPath = encodeURIComponent(targetPath);

    let self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        let params = {};
        params['target'] = targetPath;
        const query = Ember.$.param(params);
        Ember.$.ajax({
          headers: headers,
          url: ENV.apis.metaDataBaseUrl + "move",
          type: "POST",
          data: JSON.stringify({source: fromPath, target: targetPath}),
          contentType: "application/json",
        }).done(function (response) {
          resolve(response);
        }).fail((error) => {
          reject(error);
        });
      });
    });
  },

  examine(path) {
    if (!path) {
      path = "";
    }
    // clean path. Remove first and last slashes.
    path = path.replace(/^\/|\/$/g, '');
    path = encodeURIComponent(path);

    let self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        Ember.$.ajax({
          headers: headers,
          url: ENV.apis.metaDataBaseUrl + "examine",
          type: "POST",
          dataType: "json",
          data: JSON.stringify({path}),
          contentType: "application/json",
        }).done(function (response) {
          resolve(response);
        }).fail((error) => {
          reject(error);
        });
      });
    });
  },

  list(path) {
    if (!path) {
      path = "";
    }
    // clean path. Remove first and last slashes.
    path = path.replace(/^\/|\/$/g, '');
    path = encodeURIComponent(path);

    let self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        Ember.$.ajax({
          headers: headers,
          url: ENV.apis.metaDataBaseUrl + "list",
          type: "POST",
          dataType: "json",
          data: JSON.stringify({path}),
          contentType: "application/json",
        }).done(function (response) {
          resolve(response || []);
        }).fail((error) => {
          reject(error);
        });
      });
    });
  },

  delete(path) {
    path = encodeURIComponent(path);
    let self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        Ember.$.ajax({
          headers: headers,
          url: ENV.apis.metaDataBaseUrl + "delete",
          type: "POST",
          data: JSON.stringify({path}),
          contentType: "application/json",
        }).done(function () {
          resolve();
        }).fail((error) => {
          reject(error);
        });
      });
    });
  }
});
