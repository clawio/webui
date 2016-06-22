import Ember from 'ember';
import ENV from 'webui/config/environment';

export default Ember.Service.extend({
	session: Ember.inject.service('session'),
	
	createHomeTree() {
		let self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		  const headers = {};
		  headers[headerName] = headerValue;
			Ember.$.ajax({
			    headers: headers,
			    url: ENV.apis.metaDataBaseUrl+"init",
			    type: "POST",
			}).done(function() {
				resolve();
			}).fail((error) => {
				reject(error);	
			});
		});
	       });
	},

	createTree(pathspec) {
		pathspec = encodeURIComponent(pathspec);
		let self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		  const headers = {};
		  headers[headerName] = headerValue;
			Ember.$.ajax({
			    headers: headers,
			    url: ENV.apis.metaDataBaseUrl+"createtree/"+pathspec,
			    type: "POST",
			}).done(function() {
				resolve();
			}).fail((error) => {
				reject(error);	
			});
		});
	       });
	},
	
	move(fromPathspec, targetPathspec) {
		// clean path. Remove first and last slashes.
		fromPathspec = fromPathspec.replace(/^\/|\/$/g, '');
		targetPathspec =  targetPathspec.replace(/^\/|\/$/g, '');
		fromPathspec = encodeURIComponent(fromPathspec);
		targetPathspec= encodeURIComponent(targetPathspec);

		let self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		  const headers = {};
		  headers[headerName] = headerValue;
			let params = {};
			params['target'] = targetPathspec;
			const query = Ember.$.param(params);
			Ember.$.ajax({
			    headers: headers,
			    url: ENV.apis.metaDataBaseUrl+"move/"+fromPathspec+"?"+query,
			    type: "POST",
			}).done(function(response) {
				resolve(response);
			}).fail((error) => {
				reject(error);	
			});
		});
               });
	},

	examine(pathspec) {
		if (!pathspec) {
			pathspec = "";
		}
		// clean path. Remove first and last slashes.
		pathspec = pathspec.replace(/^\/|\/$/g, '');
		pathspec = encodeURIComponent(pathspec);

		let self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		  const headers = {};
		  headers[headerName] = headerValue;
			Ember.$.ajax({
			    headers: headers,
			    url: ENV.apis.metaDataBaseUrl+"examine/"+pathspec,
			    type: "GET",
			    dataType: "json"
			}).done(function(response) {
				resolve(response);
			}).fail((error) => {
				reject(error);	
			});
		});
               });
	},

	list(pathspec) {
		if (!pathspec) {
			pathspec = "";
		}
		// clean path. Remove first and last slashes.
		pathspec = pathspec.replace(/^\/|\/$/g, '');
		pathspec = encodeURIComponent(pathspec);

		let self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		  const headers = {};
		  headers[headerName] = headerValue;
			Ember.$.ajax({
			    headers: headers,
			    url: ENV.apis.metaDataBaseUrl+"list/"+pathspec,
			    type: "GET",
			    dataType: "json"
			}).done(function(response) {
				resolve(response || []);
			}).fail((error) => {
				reject(error);	
			});
		});
               });
	},

	delete(pathspec) {
		pathspec = encodeURIComponent(pathspec);
		let self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		  const headers = {};
		  headers[headerName] = headerValue;
			Ember.$.ajax({
			    headers: headers,
			    url: ENV.apis.metaDataBaseUrl+"delete/"+pathspec,
			    type: "DELETE",
			}).done(function() {
				resolve();
			}).fail((error) => {
				reject(error);	
			});
		});
	       });
	}
});
