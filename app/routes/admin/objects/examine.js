import Ember from 'ember';

export default Ember.Route.extend({
	metaData: Ember.inject.service('metadata'),
	data: Ember.inject.service('data'),

	model(params) {
		return this.get('metaData').examine(params.pathspec);
	},
});
