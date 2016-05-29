import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ["ui", "blue",  "small" ,"progress"],
	didInsertElement() {
		if (this.get('total') === 0) {
			this.$().hide();
		}
		this.addObserver('value',this,'increment');
		this.addObserver('total',this,'setTotal');
	},
	increment() {
		if (this.get('value') !== 0)  {
			console.log('increment!');
			this.$().progress('increment');
			console.log('AFTER INCREMENT VALUE IS', this.get('value'));
		}
	},
	setTotal() {
		if (this.get('total') === 0) {
			this.$().hide();
		} else {
			this.$().progress({
				label: 'ratio',
				text: {
					ratio: '{value}/{total}',
					active: '{left} files remaining',
					success: '{total} files uploaded',
				},
				total: this.get('total'),
				value: this.get('value'),
			});
			this.$().show();
		}
	},
	actions: {
	}
});
