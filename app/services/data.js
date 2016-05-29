import Ember from 'ember';
import ENV from 'webui/config/environment';

const internalError = "An unexpeted problem ocurred. Please contact the admin of the service."

export default Ember.Service.extend({
	session: Ember.inject.service('session'),

	download(pathspec) {
		if (!pathspec) {
			pathspec = "";
		}
		// clean path. Remove first and last slashes.
		pathspec = pathspec.replace(/^\/|\/$/g, '');

		let t = this.get('session.data.authenticated')[ENV['ember-simple-auth-token']['tokenPropertyName']];
		let params = {};
		params[ENV['ember-simple-auth-token']['tokenPropertyName']]= t;
		const query = Ember.$.param(params)
		return ENV.apis.dataBaseUrl+"download/"+pathspec+"?"+query;
	},

	upload(pathspec, data, progressHandler) {
		let self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
			Ember.run.later(() => {
				self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
					  const headers = {};
					  headers[headerName] = headerValue;
					Ember.$.ajax({
					    xhr: function() {  // Custom XMLHttpRequest
						    var myXhr = $.ajaxSettings.xhr();
						    if(myXhr.upload){ // Check if upload property exists
							myXhr.upload.addEventListener('progress',progressHandler, false); // For handling the progress of the upload
						    }
						    return myXhr;
					    },
					    contentType: "application/octet-stream",
					    data: data,
					    processData: false,
					    headers,
					    url: ENV.apis.dataBaseUrl+"upload/"+pathspec,
					    type: "PUT",
					}).done(function(response) {
						resolve();
					}).fail((resp) => {
						let error = internalError;
						if (resp.status === 400) {
							error = resp.responseJSON.message;
						} 
						reject(error);
					});
				});
			
			}, 2000);
               });
	}

});
