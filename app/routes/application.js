import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
export default Ember.Route.extend(ApplicationRouteMixin, {
	error: function(reason) {
          if (reason.status === 401) {
            this.send('authorizationFailed');
          }
          return true;
        }
});
