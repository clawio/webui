import Ember from 'ember';

export default Ember.Service.extend({
	login(username, password) {
		return new Ember.RSVP.Promise(function(resolve, reject) {
			Ember.run.later(function() {
				if (username === 'demo' && password === 'demo') {
					return resolve('secrettooken');
				}
				return reject("Bad usename or password");
			}, 3000);
		});
	}
});
