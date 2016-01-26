import { Store, toImmutable } from 'nuclear-js'
import { LOGIN_OK, LOGIN_ERR } from '../actionTypes'

const initialState = toImmutable({
  token: null,
  err: null
})

/**
 * LoginStore holds the user information.
 * and also maintains rollback information for the checkout process
 */
export default Store({
  getInitialState() {
    return initialState
  },

  initialize() {
    this.on(LOGIN_OK, onLoginOkReducer),
    this.on(LOGIN_ERR, onLoginErrReducer)
  }
})

function onLoginOkReducer(state, payload) {
  return state
    .set("token", payload.token)
    .set("user", payload.user)
    .set("err", null)
}

function onLoginErrReducer(state, payload) {
  return state
    .set("token", null)
    .set("user", null)
    .set("err", payload.err)
}