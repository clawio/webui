import Ember from 'ember';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
	
	actions: {
		logout() { 
			this.get('session').invalidate();
		}
	},

	didInsertElement: function() {
	    Ember.run.scheduleOnce('afterRender', this, function() {
		this.$(".application-dropdown").dropdown();
		this.$(".identity").dropdown();
            });
	}
});
