import Ember from 'ember';

export default Ember.Component.extend({
	username: "",
	password: "",
	error: "",
	loading: false,
	onUserDidLogin: null,

	actions: {
		login: function() { 
			this.$(".dimmer").addClass("active");
			const loginPromise = this.authentication.login(this.get('username'), this.get('password'));
			let self = this;
			loginPromise.then(function(token) {
				self.get('onUserDidLogin')();
			}, function(error) {
				console.log(self.$("form"));
				self.$("form").addClass("error");
				self.$("form").form("add errors", [error]);
			}).finally(function() {
				self.$(".dimmer").removeClass("active");	
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
