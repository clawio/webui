import Ember from 'ember';

export default Ember.Component.extend({
	folderName: "",
	loading: false,

	actions: {
		hide() {
			this.sendAction('hide');	
		},
		create() {
			let folderName = this.get('folderName');
			if (event.keyCode === 13 && folderName)  { // enter key
				this.sendAction('create', folderName);
			} else if (event.keyCode === 27) { // escape key
				this.sendAction('hide');
			}
		}	
	},

	didRender() {
		this.$("input").focus();
	}

});
