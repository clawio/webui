import React from 'react'
import reactor from '../reactor'
import actions from '../actions'

import $ from 'jquery'
import dropdown from 'semantic-ui-dropdown'
import transition from 'semantic-ui-transition'
import form from 'semantic-ui-form'

$.fn.dropdown = dropdown
$.fn.transition = transition
$.fn.form = form


export default React.createClass({
  getInitialState() {
    return {username: '', password: '', err: null}
  },
  onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e);
    let valid = $(".ui.form").form('validate form');
    if (valid) {
      //actions.login(this.state.username, this.state.password)
    }
  },
  onChangeUsername(e) {
    this.setState({"username": e.target.value})
  },
  onChangePassword(e) {
    this.setState({"password": e.target.value})
  },
  componentDidMount() {
    //listen for login error
    reactor.observe(['login', 'err'], function(err) {
      console.log('UI evt listnr')
      if (err === null) {
        $(".ui.form").removeClass("error")
      } else {
        console.log('hubo error:' , err)
        $(".ui.form").removeClass("success");
        $(".ui.form").addClass("error");
        $(".ui.form").form("add errors", [err]);
      }
    })

    $("body").css("background-color", "rgb(27, 175, 236)")
    $(".ui.dropdown").dropdown()
    $(".ui.form").form({
      inline: true,
      fields: {
        username: {
          identifier: 'username',
          rules: [{
            type: 'empty',
            prompt: 'Please enter your username'
          }]
        },       
        password: {
          identifier: 'password',
          rules: [{
            type: 'empty',
            prompt: 'Please enter your password'
          }]
        }
      }
    })
  },
  render: function () {
    return (
      <div id="login-app" className="container" style={{width:'400px', margin:'0 auto'}}>
      <div className="ui inverted dimmer">
        <div className="ui large text loader"></div>
      </div>
          <div className="ui grid centered logo">
            <div style={{height:'100px', marginTop: '40px', marginBottom:'25px'}}>
            <img src="./assets/img/logo.svg" alt="" style={{height:'100%', width:'auto'}}/>
            </div>
          </div>
          <div className="ui attached message grid centered">
              <div className="header">
                  <h1>Log in</h1>
              </div>
          </div>

          <form className="ui form attached segment fluid" method="post">
              <div className="field">
                  <div className="ui icon input">
                      <input name="username" placeholder="Username" type="text" value={this.state.username} onChange={this.onChangeUsername}/>
                  </div>
              </div>
              <div className="field">
                  <div className="ui icon input">
                      <input name="password" placeholder="Password" type="password" value={this.state.password} onChange={this.onChangePassword}/>
                  </div>
              </div>
              <div className="field">
                  <label>Authentication method</label>
                  <select className="ui dropdown">
                    <optgroup label="Local Authentication">
                      <option>LDAP/ActiveDirectory</option>
                      <option>JSON File Based</option>
                    </optgroup>
                    <optgroup label="Federated SSO">
                      <option>University of Vigo</option>
                      <option>CERN</option>
                      <option>AARNet</option>
                      <option>USC</option>
                    </optgroup>
                  </select>
              </div>

              <button type='submit' className="ui fluid animated green button">
                <div className="visible content">Log in</div>
                <div className="hidden content">
                  <i className="right arrow icon"></i>
                </div>
              </button>

              <div className="ui error message"></div>
          </form>

      </div>
    )
  },
});
