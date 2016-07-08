import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('admin', function() {
    this.route('profile');
    this.route('objects', function() {
      this.route('list-home', {path: '/list/'});
      this.route('list-nohome', {path: '/list/*pathspec'});
      this.route('examine', {path: '/examine/*pathspec'});
    });
  });
});

export default Router;
