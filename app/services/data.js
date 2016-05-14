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

});
