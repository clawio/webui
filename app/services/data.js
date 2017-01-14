import Ember from "ember";
import ENV from "webui/config/environment";

const internalError = "An unexpeted problem ocurred. Please contact the admin of the service.";

export default Ember.Service.extend({
  session: Ember.inject.service('session'),

  download(path) {
    if (!path) {
      path = "";
    }
    // clean path. Remove first and last slashes.
    path = path.replace(/^\/|\/$/g, '');
    path = encodeURIComponent(path);

    let t = this.get('session.data.authenticated')[ENV['ember-simple-auth-token']['tokenPropertyName']];
    let params = {};
    params[ENV['ember-simple-auth-token']['tokenPropertyName']] = t;
    const query = Ember.$.param(params);
    return ENV.apis.dataBaseUrl + "download/" + path + "?" + query;
  },

  upload(path, data, progressHandler) {
    path = encodeURIComponent(path);
    let self = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;
        headers['clawio-api-arg'] = {path: path}
        Ember.$.ajax({
          xhr: function () {  // Custom XMLHttpRequest
            var myXhr = Ember.$.ajaxSettings.xhr();
            if (myXhr.upload) { // Check if upload property exists
              myXhr.upload.addEventListener('progress', progressHandler, false); // For handling the progress of the upload
            }
            return myXhr;
          },
          contentType: "application/octet-stream",
          data: data,
          processData: false,
          headers,
          url: ENV.apis.dataBaseUrl + "upload",
          type: "POST",
        }).done(function () {
          resolve();
        }).fail((resp) => {
          let error = internalError;
          if (resp.status === 400) {
            error = resp.responseJSON.message;
          }
          reject(error);
        });
      });
    });
  },
});
