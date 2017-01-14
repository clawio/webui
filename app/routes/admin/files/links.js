import Ember from 'ember';

export default Ember.Route.extend({
	link: Ember.inject.service('link'),
	data: Ember.inject.service('data'),
	notify: Ember.inject.service('notify'),

	model() {
		return this.get('link').list();
	},

	actions: {
		unlink(token) {
			let model = this.modelFor(this.routeName);
			let link = model.findBy("token", token);
			Ember.set(link, 'ui_unlinking', true);

			let unlinking = this.get('link').delete(token);
			unlinking
			.then(() => {
				model.removeObject(link);
				this.get('notify').info(`public link with ID "${token}" has been deleted`);
			})
			.catch((error) => {
				Ember.set(link, 'ui_unlinking', false);
				this.get('notify').error(`public link with id "${token}" cannot be unlinked`);
			});
		},

		default(type, path) {
			if (type === 'folder' ) {
				this.transitionTo('admin.files.list-nohome', path);
			} else {
				const downloadUrl = this.get('data').download(path);	
				window.open(downloadUrl);
			}
		},
	}
});
