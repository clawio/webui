import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('admin', function() {
    this.route('profile');
    this.route('files', function() {
      this.route('list-home', {path: '/list/'});
      this.route('list-nohome', {path: '/list/*path'});
      this.route('examine', {path: '/examine/*path'});
      this.route('links');
    });
  });

  this.route('public', function() {
    this.route('links', function() {
      this.route('info', {path: '/info/:token'});
      this.route('examine', {path: '/examine/:token'});
      this.route('list-home', {path: '/list/:token'});
      this.route('list-nohome', {path: '/list/:token/*path'});
    });
  });
});

export default Router;
