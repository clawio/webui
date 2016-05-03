/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var tokenRouter = express.Router();

  tokenRouter.post('/token', function(req, res) {
	  console.log(req.body);
	  console.log(req.body.grant_type);
	  if (req.body.grant_type === 'password') {
		if (req.body.username === 'demo' && req.body.password === 'demo') {
			res.status(200).send('{ "access_token": "secrettoken"}');
		} else {
			res.status(400).send('{"error": "invalid_grant"}');
		}
	  } else {
	  	res.status(400).send('{"error": "unsupported_grant_type"}');
	  }
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  app.use(require('body-parser').urlencoded());
  app.use('/', tokenRouter);
};
