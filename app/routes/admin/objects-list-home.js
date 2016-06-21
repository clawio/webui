import Ember from 'ember';

export default Ember.Route.extend({
	metaData: Ember.inject.service('metadata'),
	data: Ember.inject.service('data'),
	notify: Ember.inject.service('notify'),

	model(params) {
		return Ember.RSVP.hash({
			currentPathspec: params.pathspec || "",
			objects: this.get('metaData').list(params.pathspec) || [],
			breadcrumbs: this.get('pathspecToBreadcrumbs')(params.pathspec),
			uploadTotal: 0,
			uploadValue: 0,
			uploadFilename: "",
			uploadFilesizeRatio: "",
			isObjectBeingCreated: false,
			isTreeBeingCreated: false,
		});
	},
	
	setFilesizeRatio(ratio) {
		Ember.set(this.modelFor(this.routeName), 'uploadFilesizeRatio', ratio);
	},
	initUploadBar(total, firstFile) {
		Ember.set(this.modelFor(this.routeName), 'uploadTotal', total);
		Ember.set(this.modelFor(this.routeName), 'uploadValue', 0);
		Ember.set(this.modelFor(this.routeName), 'uploadFilename', firstFile.name);
		this.setFilesizeRatio("0/"+firstFile.size);
	},
	incrementUploadBar(file) {
		console.log(this.modelFor(this.routeName).uploadFilename);
		let current = Ember.get(this.modelFor(this.routeName), 'uploadValue');
		Ember.set(this.modelFor(this.routeName), 'uploadValue', current + 1);
		Ember.set(this.modelFor(this.routeName), 'uploadFilename', file.name);
	},
	progressHandler(e) {
		if(e.lengthComputable){
			// update upload progress bar
			let ratio = e.loaded + "/" + e.total;
			this.setFilesizeRatio(ratio);
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
		return this.get('data').upload(pathspec, data, Ember.$.proxy(this.progressHandler, this));
	},
	handleUpload(files, indexes) {
		if(indexes.length === 0) {
			console.log('upload finished');
			Ember.run.later(() => {
				Ember.set(this.modelFor(this.routeName), 'uploadTotal', 0); // remove progress bar
			}, 1500);
			return
		}
		let file = files.item(indexes.shift());

		let basename = file.name;
		let data = file;
		let pathspec = this.modelFor(this.routeName).currentPathspec;
		pathspec = pathspec.replace(/^\/|\/$/g, '');
		pathspec = pathspec + "/" + basename;
		pathspec = pathspec.replace(/^\/|\/$/g, '');

		let uploadPromise = this.getUploadPromise(file);
		uploadPromise
		.then(() => {
			this.examineAfterCreation(pathspec);
		})
		.catch((error) => {
			this.get('notify').error("cannot upload object")
		})
		.finally(() => {
			this.incrementUploadBar(file);
			this.handleUpload(files, indexes);
		})
	},

	examineAfterCreation(pathspec) {
		let examining = this.get('metaData').examine(pathspec);
		examining
		.then((object) => {
			let old = this.modelFor(this.routeName).objects.findBy("pathspec", pathspec);
			if (old) {
				this.modelFor(this.routeName).objects.removeObject(old);
			}

			Ember.set(object, 'ui_highlight', true);
			this.modelFor(this.routeName).objects.addObject(object);

			Ember.run.later(() => {
				Ember.set(object, 'ui_highlight', false);
			}, 500)
		})
		.catch((error) => {
			this.get('notify').error("cannot examine object")
		})
	},

	actions: {
		upload(files) {
			let numberOfFiles = files.length;
			let totalSize = this.getTotalSize(files);
			let uploadQueue = [];

			// showUploadBar()
			this.initUploadBar(numberOfFiles, files.item(0));

			let indexes = [];	
			for(let i = 0; i < files.length; i++) {
				indexes.push(i);
			}
			this.handleUpload(files, indexes);
		},
		
		renameObject(object, newName) {
			let o = this.modelFor(this.routeName).objects.findBy("pathspec", object.pathspec);
			Ember.set(o, 'ui_renaming', true);
			
			let targetPathspec = object.pathspec.split("/");
			// remove last part to obtain dirname	
			targetPathspec.pop();
			targetPathspec.push(newName);
			targetPathspec = targetPathspec.join('/').replace(/^\/|\/$/g, '');

			let renaming = this.get('metaData').move(o.pathspec, targetPathspec);
			renaming
			.then(() => {
				this.modelFor(this.routeName).objects.removeObject(o);
				this.examineAfterCreation(targetPathspec);
			})
			.catch((error) => {
				this.get('notify').error("cannot remove object")
			})
			.finally((res) => {
				Ember.set(o, 'ui_renaming', false);
			})
		},

		createObject(objectName) {
			Ember.set(this.modelFor(this.routeName), 'isObjectBeingCreated',true);

			let pathspec = this.modelFor(this.routeName).currentPathspec + "/" + objectName;
			pathspec = pathspec.replace(/^\/|\/$/g, '');

			let uploadPromise = this.get('data').upload(pathspec, new Uint8Array(0));
			uploadPromise
			.then(() => {
				this.examineAfterCreation(pathspec);
			})
			.catch((error) => {
				this.get('notify').error("cannot create blob")
			})
			.finally(() => {
				Ember.set(this.modelFor(this.routeName), 'isObjectBeingCreated', false);
			})
		},

		createTree(treeName) {
			Ember.set(this.modelFor(this.routeName), 'isTreeBeingCreated',true);

			let pathspec = this.modelFor(this.routeName).currentPathspec + "/" + treeName;
			pathspec = pathspec.replace(/^\/|\/$/g, '');

			let createTreePromise = this.get('metaData').createTree(pathspec);
			createTreePromise
			.then(() => {
				this.examineAfterCreation(pathspec);
			})
			.catch((error) => {
				this.get('notify').error("cannot create tree")
			})
			.finally(() => {
				Ember.set(this.modelFor(this.routeName), 'isTreeBeingCreated', false);
			})
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
				this.get('notify').error("cannot create tree")
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
