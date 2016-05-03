import Ember from 'ember';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),

	actions: {
		login: function() { 
			this.$(".dimmer").addClass("active");
			let { username, password } = this.getProperties('username', 'password');
			let self = this;	
			
			this.get('session').authenticate('authenticator:oauth2', username, password)
				.catch((reason) => {
					let error = "Bad username or password";
					this.set('error', error);
					this.$("form").addClass("error");
					this.$("form").form("add errors", [error]);
				})
				.finally(() => {
					this.$(".dimmer").removeClass("active");	
					self.get('onUserDidAuthenticated')();
				});
		} 
	},

	didInsertElement: function() {
	    Ember.run.scheduleOnce('afterRender', this, function() {
		this.$("form").form({
			fields: {
			      username: {
					identifier: 'username',
					rules: [{
					  type: 'empty',
					  prompt: 'Please enter an username'
					}]
				},
			        password: {
					identifier: 'password',
					rules: [{
					  type: 'empty',
					  prompt: 'Please enter a password'
					}]
				}
			},
			on: 'blur',
		});
            });
	}
});
