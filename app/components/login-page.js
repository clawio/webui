import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ["juan"],

	session: Ember.inject.service('session'),
	metaData: Ember.inject.service('metadata'),

	actions: {
		login: function() { 
			console.log("called");
			this.$(".dimmer").addClass("active");
			let credentials = this.getProperties('identification', 'password');
			let self = this;	
			
			this.get('session').authenticate('authenticator:token', credentials)
				.catch(() => {
					let error = "Wrong username or password";
					this.set('error', error);
					this.$("form").addClass("error");
					this.$("form").form("add errors", [error]);
					this.$(".dimmer").removeClass("active");
				})
				.then(() => {
					// try to create user home directory				
					self.get('metaData').createHomeTree()
					.catch(() => {
						let error = "Cannot create your home directory";
						this.set('error', error);
						this.$("form").addClass("error");
						this.$("form").form("add errors", [error]);
						this.$(".dimmer").removeClass("active");
					});
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
					  prompt: 'You must provide a valid username'
					}]
				},
			        password: {
					identifier: 'password',
					rules: [{
					  type: 'empty',
					  prompt: 'You must provide a password'
					}]
				}
			},
		});
            });
	}
});
