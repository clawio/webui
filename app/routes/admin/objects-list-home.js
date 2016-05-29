import Ember from 'ember';

export default Ember.Route.extend({
	metaData: Ember.inject.service('metadata'),
	data: Ember.inject.service('data'),

	model(params) {
		return Ember.RSVP.hash({
			currentPathspec: params.pathspec || "",
			objects: this.get('metaData').list(params.pathspec),
			breadcrumbs: this.get('pathspecToBreadcrumbs')(params.pathspec),
			uploadTotal: 0,
			uploadValue: 0,
		});
		Ember.run.later(() => {
				
			Ember.set(this.modelFor(this.routeName), 'uploadTotal', 10);
			Ember.set(this.modelFor(this.routeName), 'uploadValue', 5);
		}, 2000);
	},

	initUploadBar(total) {
		Ember.set(this.modelFor(this.routeName), 'uploadTotal', total);
		Ember.set(this.modelFor(this.routeName), 'uploadValue', 0);
	},
	incrementUploadBar() {
		let total = Ember.get(this.modelFor(this.routeName), 'uploadTotal');
		let current = Ember.get(this.modelFor(this.routeName), 'uploadValue');
		Ember.set(this.modelFor(this.routeName), 'uploadValue', current + 1);

		if (current + 1 >= total) {
			Ember.set(this.modelFor(this.routeName), 'uploadTotal', 0);
			Ember.set(this.modelFor(this.routeName), 'uploadValue', 0);
		}
	},
	progressHandler(e) {
		if(e.lengthComputable){
			console.log(e.loaded+"/"+e.total);
			//$('progress').attr({value:e.loaded,max:e.total});
		}
	},
	getTotalSize(files) {
		let sum = 0;
		for(let i = 0; i < files.length; i++) {
			sum += files.item(i).size;
		}
		return sum;
	},
	getUploadPromise(file) {
		let basename = file.name;
		let data = file;
		let pathspec = this.modelFor(this.routeName).currentPathspec;
		pathspec = pathspec.replace(/^\/|\/$/g, '');
		pathspec = pathspec + "/" + basename;
		pathspec = pathspec.replace(/^\/|\/$/g, '');
		return this.get('data').upload(pathspec, data, this.progressHandler);
	},
	actions: {

		upload(files) {
			let numberOfFiles = files.length;
			let totalSize = this.getTotalSize(files);
			let uploadQueue = [];

			// showUploadBar()
			for(let i = 0; i < files.length; i++) {
				let uploadPromise = this.getUploadPromise(files.item(i));
				uploadQueue.push(uploadPromise);
				uploadPromise
				.then(() => {
					// addObjectToModel();
					console.log("upload ok!");
				})
				.catch(() => {
					// showError();
					console.error("upload failed");
				})
				.finally(() => {
				})
			}
			Ember.RSVP.allSettled(uploadQueue).then((results) => {
				console.log(results);
			});
		},
		examine(pathspec) {
		        pathspec = pathspec.replace(/^\/|\/$/g, '');
			this.transitionTo('admin.objects-examine', pathspec);	
		},
		list(pathspec) {
		        pathspec = pathspec.replace(/^\/|\/$/g, '');
			this.transitionTo('admin.objects-list-nohome', pathspec);
		},

		delete(pathspec) {
			let object = this.modelFor(this.routeName).objects.findBy("pathspec", pathspec);
			Ember.set(object, 'ui_deleting', true);

			let deleting = this.get('metaData').delete(pathspec);
			deleting
			.then(() => {
				this.modelFor(this.routeName).objects.removeObject(object);
			})
			.catch((res) => {
				Ember.set(object, 'ui_deleting', false);
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
