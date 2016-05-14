import Ember from 'ember';

export default Ember.Route.extend({
	metaData: Ember.inject.service('metadata'),
	data: Ember.inject.service('data'),

	model(params) {
		return Ember.RSVP.hash({
			objects: this.get('metaData').list(params.pathspec),
			breadcrumbs: this.get('pathspecToBreadcrumbs')(params.pathspec),
		});
	},

	actions: {
		list(pathspec) {
		        pathspec = pathspec.replace(/^\/|\/$/g, '');
			this.transitionTo('admin.objects-list-nohome', pathspec);
		},

		delete(pathspec) {
			let object = this.modelFor(this.routeName).objects.findBy("pathspec", pathspec);
			object.set('ui_deleting', true);
			console.log(this.modelFor(this.routeName).objects);
			return;
			let deleting = this.get('metaData').delete(pathspec);
			deleting
			.then(() => {
				this.modelFor(this.routeName).objects.removeObject(object);
				console.log("deletion ok!");
			})
			.catch((res) => {
				object.ui_deleting = false;
				console.log(res, "cannot delete");
			})
		},

		download(pathspec) {
			const downloadUrl = this.get('data').download(pathspec);	
			window.open(downloadUrl);
		},
	},

	pathspecToBreadcrumbs(pathspec) {
		if (!pathspec) {
			return [];
		}
		pathspec = pathspec.replace(/^\/|\/$/g, '');
		var current = pathspec;
		var parts = current.split('/');
		var previousPath = "";
		var breadcrumbCollection = [];
		for(var i = 0; i < parts.length; i++ ) {
			var newPath = previousPath + '/' + parts[i];
			var name = parts[i];
			breadcrumbCollection.push({
				pathspec: newPath,
				name: name
			});
			previousPath = newPath;
		}
		return breadcrumbCollection;
	},
});
