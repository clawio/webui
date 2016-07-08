import Ember from 'ember';

export default Ember.Component.extend({
	treeName: "",
	loading: false,

	actions: {
		hide() {
			this.sendAction('hide');	
		},
		create() {
			let treeName = this.get('treeName');
			if (event.keyCode === 13 && treeName)  { // enter key
				this.sendAction('create', treeName);
			} else if (event.keyCode === 27) { // escape key
				this.sendAction('hide');
			}
		}	
	},

	didRender() {
		this.$("input").focus();
	}

});
