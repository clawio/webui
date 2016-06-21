import Ember from 'ember';

export default Ember.Service.extend({
	messages: null,

	init() {
		this._super(...arguments);
		this.set('messages', []);
	},

	error(msg) {
		let o = Ember.Object.create({type: "error", msg: msg});
		this.get('messages').pushObject(o);	
	},

	getMessages() {
		return this.get('messages');
	}
});
