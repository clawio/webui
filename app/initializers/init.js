export function initialize(application) {
  application.inject('component', 'authentication', 'service:authentication');
}

export default {
  name: 'init',
  initialize
};
