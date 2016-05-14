import Ember from 'ember';
import { jwt_decode } from 'ember-cli-jwt-decode';
import ENV from 'webui/config/environment';

export default Ember.Service.extend({
	session: Ember.inject.service('session'),

	getUser() {
		let t = this.get('session.data.authenticated')[ENV['ember-simple-auth-token']['tokenPropertyName']];
		let user = jwt_decode(t);
		return user;
	}
});
