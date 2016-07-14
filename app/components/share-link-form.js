import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		create() {
		        let epoch = 0;	
			console.log(this.get('date'));
			if (this.get('date') !== "") {
				epoch = new Date(this.get('date')).getTime() / 1000; // just seconds
			}

			this.sendAction('create', this.get('password'), epoch);
		},
	},

	didRender() {
		this.$("#calendar").calendar({type: "date"});
	}
});
