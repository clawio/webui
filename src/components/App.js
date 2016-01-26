'use strict';

import React from 'react'

import LoginApp from './LoginContainer'

export default React.createClass({
  getInitialState() {
  	return {value: null}
  },
  render() {
    return (
    	<LoginApp/>
    )
  },
});
