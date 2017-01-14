import Ember from 'ember';

export default Ember.Route.extend({
	metaData: Ember.inject.service('metadata'),
	data: Ember.inject.service('data'),
	link: Ember.inject.service('link'),
	notify: Ember.inject.service('notify'),

	model(params) {
		return Ember.RSVP.hash({
			currentFile: params.path || "",

			files: this.get('metaData').list(params.path) || [],

			breadcrumbs: this.get('pathToBreadcrumbs')(params.path),

			uploadTotal: 0,
			uploadValue: 0,
			uploadFilename: "",
			uploadFilesizeRatio: "",

			filterterm: "",

			fileInputVisible: false,
			fileInputDisabled: false,
			fileInputLoading: false,

			folderInputVisible: false,
			folderInputDisabled: false,
			folderInputLoading: false,

			shareSidebarVisible: false,
			shareSidebarLoading: false
		});
	},

	renderTemplate() {
		this.render();
		this.render('admin/files/list/sidebar-links',{
			outlet: 'sidebar-links',
		})
		this.render('admin/files/list/sidebar-content', {
			outlet: 'sidebar-content',
		})
	},




	actions: {

		// actions that handle the creation of files
		showBlobInput() {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'fileInputVisible', true);
		},
		hideBlobInput() {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'fileInputVisible', false);
		},
		createBlob(fileName) {
			let model = this.modelFor(this.routeName);
			Ember.set(model, 'fileInputLoading',true);

			let path = model.currentFile + "/" + fileName;
			path = path.replace(/^\/|\/$/g, '');

			let uploadPromise = this.get('data').upload(path, new Uint8Array(0));
			uploadPromise
			.then(() => {
				this.examineAfterCreation(path);
			})
			.catch(() => {
				this.get('notify').error(`"${path}" cannot be created`);
			})
			.finally(() => {
				Ember.set(model, 'fileInputLoading', false);
				Ember.set(model, 'fileInputVisible', false);
			});
		},

		// actions that handle the creation of folders
		showFolderInput() {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'folderInputVisible', true);
		},
		hideFolderInput() {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'folderInputVisible', false);
		},
		createFolder(folderName) {
			let model = this.modelFor(this.routeName);
			Ember.set(model, 'folderInputLoading',true);

			let path = model.currentFile + "/" + folderName;
			path = path.replace(/^\/|\/$/g, '');

			let uploadPromise = this.get('metaData').createFolder(path);
			uploadPromise
			.then(() => {
				this.examineAfterCreation(path);
			})
			.catch(() => {
				this.get('notify').error(`"${path}" cannot be created`);
			})
			.finally(() => {
				Ember.set(model, 'folderInputLoading', false);
				Ember.set(model, 'folderInputVisible', false);
			});
		},

		// actions that handle the filtering
		filter(filterterm) {
			let model = this.modelFor(this.routeName);
			Ember.set(model,'filterterm', filterterm);
		},

		//actions that handle the upload of files
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

		// actions that handle the  renaming of files
		renameFile(file, newName) {
			let o = this.modelFor(this.routeName).files.findBy("path", file.path);
			Ember.set(o, 'ui_renaming', true);

			let targetPath = file.path.split("/");
			// remove last part to obtain dirname
			targetPath.pop();
			targetPath.push(newName);
			targetPath = targetPath.join('/').replace(/^\/|\/$/g, '');

			console.log(targetPath);
			let renaming = this.get('metaData').move(o.path, targetPath);
			renaming
			.then(() => {
				this.modelFor(this.routeName).files.removeObject(o);
				this.examineAfterCreation(targetPath);
			})
			.catch(() => {
				this.get('notify').error(`"${o.path}" cannot be renamed to "${targetPath}"`);
			})
			.finally(() => {
				Ember.set(o, 'ui_renaming', false);
			});
		},

		// action that shows information about a particular file
		examine(path) {
		        path = path.replace(/^\/|\/$/g, '');
			this.transitionTo('admin.files.examine', path);
		},

		// action that list a new folder
		list(path) {
		        path = path.replace(/^\/|\/$/g, '');
			this.transitionTo('admin.files.list-nohome', path);
		},

		// action that deletes an file
		delete(path) {
			let file = this.modelFor(this.routeName).files.findBy("path", path);
			Ember.set(file, 'ui_deleting', true);

			let deleting = this.get('metaData').delete(path);
			deleting
			.then(() => {
				this.modelFor(this.routeName).files.removeObject(file);
				this.get('notify').info(`"${path}" deleted`);
			})
			.catch(() => {
				Ember.set(file, 'ui_deleting', false);
				this.get('notify').error(`"${path}" cannot be deleted`);
			});
		},

		// action that downloads an file
		download(path) {
			const downloadUrl = this.get('data').download(path);
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
		let path = this.modelFor(this.routeName).currentFile;
		path = path.replace(/^\/|\/$/g, '');
		path = path + "/" + basename;
		path = path.replace(/^\/|\/$/g, '');
		return this.get('data').upload(path, data, Ember.$.proxy(this.progressHandler, this));
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
		let path = this.modelFor(this.routeName).currentFile;
		path = path.replace(/^\/|\/$/g, '');
		path = path + "/" + basename;
		path = path.replace(/^\/|\/$/g, '');

		let uploadPromise = this.getUploadPromise(file);
		uploadPromise
		.then(() => {
			this.examineAfterCreation(path);
		})
		.catch(() => {
			this.get('notify').error(`"${path}" cannot be uploaded`);
		})
		.finally(() => {
			this.incrementUploadBar(file);
			this.handleUpload(files, indexes);
		});
	},

	examineAfterCreation(path) {
		let examining = this.get('metaData').examine(path);
		examining
		.then((file) => {
			let old = this.modelFor(this.routeName).files.findBy("path", path);
			if (old) {
				this.modelFor(this.routeName).files.removeObject(old);
			}

			Ember.set(file, 'ui_highlight', true);
			this.modelFor(this.routeName).files.addObject(file);

			Ember.run.later(() => {
				Ember.set(file, 'ui_highlight', false);
			}, 500);
		})
		.catch(() => {
			this.get('notify').error(`"${path}" cannot be examined`);
		});
	},

	pathToBreadcrumbs(path) {
		if (!path) {
			return [];
		}
		path = path.replace(/^\/|\/$/g, '');
		var current = path;
		var parts = current.split('/');
		var previousPath = "";
		var breadcrumbCollection = [];
		for(var i = 0; i < parts.length; i++ ) {
			var newPath = previousPath + '/' + parts[i];
			var name = parts[i];
			breadcrumbCollection.push({
				path: newPath,
				name: name
			});
			previousPath = newPath;
		}
		return breadcrumbCollection;
	},

});
