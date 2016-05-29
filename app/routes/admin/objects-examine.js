import Ember from 'ember';

export default Ember.Route.extend({
	metaData: Ember.inject.service('metadata'),
	data: Ember.inject.service('data'),

	model(params) {
		return this.get('metaData').examine(params.pathspec);
	},

	actions: {
		list(pathspec) {
		        pathspec = pathspec.replace(/^\/|\/$/g, '');
			this.transitionTo('admin.objects-list-nohome', pathspec);
		},

		delete(pathspec) {
		},

		download(pathspec) {
			const downloadUrl = this.get('data').download(pathspec);	
			window.open(downloadUrl);
		},
	},
});
