import Ember from 'ember';
import ENV from 'webui/config/environment';

export default Ember.Service.extend({
	session: Ember.inject.service('session'),

	create(pathspec, password) {
		pathspec = encodeURIComponent(pathspec);
		let self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		  const headers = {};
		  headers[headerName] = headerValue;
			Ember.$.ajax({
			    headers: headers,
			    url: ENV.apis.linkBaseUrl+"create/"+pathspec,
			    type: "POST",
			    dataType: "json"
			}).done(function(response) {
				resolve(response);
			}).fail((error) => {
				reject(error);	
			});
		});
	       });
	},
	find(pathspec) {
		pathspec = encodeURIComponent(pathspec);
		let self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		  const headers = {};
		  headers[headerName] = headerValue;
			Ember.$.ajax({
			    headers: headers,
			    url: ENV.apis.linkBaseUrl+"find/"+pathspec,
			    type: "GET",
			    dataType: "json"
			}).done(function(response) {
				resolve(response);
			}).fail((error) => {
				reject(error);	
			});
		});
	       });
	}
});
