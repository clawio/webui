import reactor from './reactor'
import jwtDecode from 'jwt-decode'

import {
  LOGIN_OK,
  LOGIN_ERR,
} from './actionTypes'

const mockJwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJsYWJrb2RlIiwiZGlzcGxheW5hbWUiOiJIdWdvIEdvbnrDoWxleiBMYWJyYWRvciIsImFkbWluIjp0cnVlfQ.bHhY0PIHe8LWX_HwkK1aiqC7Ki3Xl_nKtM870GDSwWc"

export default {
  login(username, password) {
    if (username ==='hugo' && password === 'hugo') {
      let user = jwtDecode(mockJwtToken)
      reactor.dispatch(LOGIN_OK, {token: mockJwtToken, user, err: null})
    } else {
      reactor.dispatch(LOGIN_ERR, {token: null, user: null, err:'Invalid username or password'})
    }
  },
}
