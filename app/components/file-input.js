import Ember from 'ember';

export default Ember.Component.extend({
	fileName: "",
	loading: false,

	didRender() {
		this.$("input").focus();
	},

	actions: {
		hide() {
			this.sendAction('hide');	
		},
		create() {
			let fileName = this.get('fileName');
			if (event.keyCode === 13 && fileName)  { // enter key
				this.sendAction('create', fileName);
			} else if (event.keyCode === 27) { // escape key
				this.sendAction('hide');
			}
		}	
	},


});
