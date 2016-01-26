'use strict';

import React from 'react'

import App from './components/App' // User Interface

import reactor from './reactor' // Dispatcher

import actions from './actions' // Action Handlers

import LoginStore from './stores/LoginStore' // Login Store


reactor.registerStores({
  login: LoginStore
})


React.render(
    <App/>,
    document.getElementById('flux-app')
)

window.actions = actions
window.reactor = reactor

console.debug(reactor.evaluateToJS([]))
