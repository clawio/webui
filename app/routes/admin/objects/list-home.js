import Ember from 'ember';

export default Ember.Route.extend({
	metaData: Ember.inject.service('metadata'),
	data: Ember.inject.service('data'),
	link: Ember.inject.service('link'),
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

			filterterm: "",

			blobInputVisible: false,
			blobInputDisabled: false,
			blobInputLoading: false,

			treeInputVisible: false,
			treeInputDisabled: false,
			treeInputLoading: false,

			shareSidebarVisible: false,
			shareSidebarLoading: false
		});
	},
	
	renderTemplate() {
		this.render();
		this.render('admin/objects/list/sidebar-links',{
			outlet: 'sidebar-links',
		})
		this.render('admin/objects/list/sidebar-content', {
			outlet: 'sidebar-content',
		})
	},




	actions: {

		// actions that handle the creation of blobs
		showBlobInput() {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'blobInputVisible', true);
		},
		hideBlobInput() {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'blobInputVisible', false);
		},
		createBlob(blobName) {
			let model = this.modelFor(this.routeName);
			Ember.set(model, 'blobInputLoading',true);

			let pathspec = model.currentPathspec + "/" + blobName;
			pathspec = pathspec.replace(/^\/|\/$/g, '');

			let uploadPromise = this.get('data').upload(pathspec, new Uint8Array(0));
			uploadPromise
			.then(() => {
				this.examineAfterCreation(pathspec);
			})
			.catch(() => {
				this.get('notify').error(`"${pathspec}" cannot be created`);
			})
			.finally(() => {
				Ember.set(model, 'blobInputLoading', false);
				Ember.set(model, 'blobInputVisible', false);
			});
		},

		// actions that handle the creation of trees
		showTreeInput() {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'treeInputVisible', true);
		},
		hideTreeInput() {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'treeInputVisible', false);
		},
		createTree(treeName) {
			let model = this.modelFor(this.routeName);
			Ember.set(model, 'treeInputLoading',true);

			let pathspec = model.currentPathspec + "/" + treeName;
			pathspec = pathspec.replace(/^\/|\/$/g, '');

			let uploadPromise = this.get('metaData').createTree(pathspec);
			uploadPromise
			.then(() => {
				this.examineAfterCreation(pathspec);
			})
			.catch(() => {
				this.get('notify').error(`"${pathspec}" cannot be created`);
			})
			.finally(() => {
				Ember.set(model, 'treeInputLoading', false);
				Ember.set(model, 'treeInputVisible', false);
			});
		},

		// actions that handle the filtering
		filter(filterterm) {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'filterterm', filterterm);
		},

		//actions that handle the upload of blobs
		upload(files) {
			let numberOfFiles = files.length;

			// showUploadBar()
			this.initUploadBar(numberOfFiles, files.item(0));

			let indexes = [];	
			for(let i = 0; i < files.length; i++) {
				indexes.push(i);
			}
			this.handleUpload(files, indexes);
		},
	
		// actions that handle the  renaming of objects
		renameObject(object, newName) {
			let o = this.modelFor(this.routeName).objects.findBy("pathspec", object.pathspec);
			Ember.set(o, 'ui_renaming', true);
			
			let targetPathspec = object.pathspec.split("/");
			// remove last part to obtain dirname	
			targetPathspec.pop();
			targetPathspec.push(newName);
			targetPathspec = targetPathspec.join('/').replace(/^\/|\/$/g, '');

			console.log(targetPathspec);
			let renaming = this.get('metaData').move(o.pathspec, targetPathspec);
			renaming
			.then(() => {
				this.modelFor(this.routeName).objects.removeObject(o);
				this.examineAfterCreation(targetPathspec);
			})
			.catch(() => {
				this.get('notify').error(`"${o.pathspec}" cannot be renamed to "${targetPathspec}"`);
			})
			.finally(() => {
				Ember.set(o, 'ui_renaming', false);
			});
		},

		// action that shows information about a particular object
		examine(pathspec) {
		        pathspec = pathspec.replace(/^\/|\/$/g, '');
			this.transitionTo('admin.objects.examine', pathspec);	
		},
		
		// action that list a new tree
		list(pathspec) {
		        pathspec = pathspec.replace(/^\/|\/$/g, '');
			this.transitionTo('admin.objects.list-nohome', pathspec);
		},

		// action that deletes an object
		delete(pathspec) {
			let object = this.modelFor(this.routeName).objects.findBy("pathspec", pathspec);
			Ember.set(object, 'ui_deleting', true);

			let deleting = this.get('metaData').delete(pathspec);
			deleting
			.then(() => {
				this.modelFor(this.routeName).objects.removeObject(object);
				this.get('notify').info(`"${pathspec}" deleted`);
			})
			.catch(() => {
				Ember.set(object, 'ui_deleting', false);
				this.get('notify').error(`"${pathspec}" cannot be deleted`);
			});
		},
		
		// action that downloads an object
		download(pathspec) {
			const downloadUrl = this.get('data').download(pathspec);	
			window.open(downloadUrl);
		},


		share(o) {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'shareComponentVisible', true);
			Ember.set(model,'shareComponentLoading', true);
			this.get('link').find(o)
			.then((link) => {
				Ember.set(model,'shareLink', link);
			})	
			.catch(() => {
				Ember.set(model,'shareLink', null);
			})
			.finally(() => {
				Ember.set(model,'shareComponentLoading', false);
			})
		},
		createShareLink(o, password, epoch) {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'shareComponentLoading', true);
			this.get('link').create(o, password, epoch)
			.then((link) => {
				Ember.set(model,'shareLink', link);
			})		
			.finally(() => {
				Ember.set(model,'shareComponentLoading', false);
			})
		},
		deleteShareLink(token) {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'shareComponentLoading', true);
			this.get('link').delete(token)
			.finally(() => {
				Ember.set(model,'shareLink', null);
				Ember.set(model,'shareComponentLoading', false);
			})
		}


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
			return;
		}
		let file = files.item(indexes.shift());

		let basename = file.name;
		let pathspec = this.modelFor(this.routeName).currentPathspec;
		pathspec = pathspec.replace(/^\/|\/$/g, '');
		pathspec = pathspec + "/" + basename;
		pathspec = pathspec.replace(/^\/|\/$/g, '');

		let uploadPromise = this.getUploadPromise(file);
		uploadPromise
		.then(() => {
			this.examineAfterCreation(pathspec);
		})
		.catch(() => {
			this.get('notify').error(`"${pathspec}" cannot be uploaded`);
		})
		.finally(() => {
			this.incrementUploadBar(file);
			this.handleUpload(files, indexes);
		});
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
			}, 500);
		})
		.catch(() => {
			this.get('notify').error(`"${pathspec}" cannot be examined`);
		});
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
