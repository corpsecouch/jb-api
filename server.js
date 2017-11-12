//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
    methodOverride  = require('method-override');

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));

// CORS setup
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.get('/health', function(req, res){
  res.writeHead(200);
  res.end();
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

require('./medium').setup(app);
require('./goodreads').setup(app);

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
