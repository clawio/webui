import Ember from 'ember';

export default Ember.Service.extend({
	messages: null,

	init() {
		this._super(...arguments);
		this.set('messages', []);
	},

	error(text) {
		let o = Ember.Object.create({color: "red",text:text, readed: false});
		this.get('messages').pushObject(o);	
		this.readLater(o);
	},

	info(text) {
		let o = Ember.Object.create({color: "blue",text: text, readed: false});
		this.get('messages').pushObject(o);	
		this.readLater(o);
	},

	markAsReaded(msg) {
		Ember.set(msg, 'readed', true);
		this.get('messages').removeObject(msg);
		this.get('messages').pushObject(msg);
	},

	readLater(msg) {
		Ember.run.later(() => {
			Ember.set(msg, 'readed', true);
			this.get('messages').removeObject(msg);
			this.get('messages').pushObject(msg);
		}, 5000);
	}
});
