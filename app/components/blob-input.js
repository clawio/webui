import Ember from 'ember';

export default Ember.Component.extend({
	blobName: "",
	loading: false,

	didRender() {
		this.$("input").focus();
	},

	actions: {
		hide() {
			this.sendAction('hide');	
		},
		create() {
			let blobName = this.get('blobName');
			if (event.keyCode === 13 && blobName)  { // enter key
				this.sendAction('create', blobName);
			} else if (event.keyCode === 27) { // escape key
				this.sendAction('hide');
			}
		}	
	},


});
