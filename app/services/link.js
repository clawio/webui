import Ember from 'ember';
import ENV from 'webui/config/environment';

export default Ember.Service.extend({
	session: Ember.inject.service('session'),

	list() {
		let self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		  const headers = {};
		  headers[headerName] = headerValue;
			Ember.$.ajax({
			    headers: headers,
			    url: ENV.apis.linkBaseUrl+"list",
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

	create(o, password, expires) {
		let data = {password: password, expires: expires};
		console.log(data);
		let pathspec = encodeURIComponent(o.pathspec);
		let self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		  const headers = {};
		  headers[headerName] = headerValue;
			Ember.$.ajax({
			    headers: headers,
			    url: ENV.apis.linkBaseUrl+"create/"+pathspec,
			    type: "POST",
			    data: JSON.stringify(data),
    			    contentType: 'application/json; charset=utf-8',
			    dataType: "json"
			}).done(function(response) {
				resolve(response);
			}).fail((error) => {
				reject(error);	
			});
		});
	       });
	},

	find(o) {
		let pathspec = encodeURIComponent(o.pathspec);
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
	},

	delete(token) {
		let self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
		  self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		  const headers = {};
		  headers[headerName] = headerValue;
			Ember.$.ajax({
			    headers: headers,
			    url: ENV.apis.linkBaseUrl+"delete/"+token,
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
