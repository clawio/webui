import { Store, toImmutable } from 'nuclear-js'
import {
  ETNER,
} from '../actionTypes'

const initialState = toImmutable({
  token: null,
})

/**
 * EnterStore holds the token used for authentication
 */
export default Store({
  getInitialState() {
    return initialState
  },

  initialize() {
    this.on(ENTER, enter)
  }
})

function enter(state, { token }) {
  return state.set("token", token)
}