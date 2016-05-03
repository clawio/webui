import Ember from 'ember';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
	
	applications: [],
	username: "",


	actions: {
		logout() { 
			this.get('session').invalidate();
		}
	},

	didInsertElement: function() {
	    Ember.run.scheduleOnce('afterRender', this, function() {
		this.$('.ui.sidebar').sidebar("attach events", ".menu .logo");
		this.$(".application-dropdown").dropdown();
		this.$(".identity").dropdown();
            });
	}
});
