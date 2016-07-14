import Ember from 'ember';

export default Ember.Component.extend({
	error: null,

	actions: {
		validate() {
			this.sendAction('validate', this.get('secret'));
		}
	},

	didRender() {
		let error = this.get('error');
		if (error) {
			this.$("form").addClass("error");
			this.$("form").form("add errors", [error]);
		} else {
			this.$("form").removeClass("error");
		} 
	}
});
