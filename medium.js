function setup(app){
  app.get('/medium/posts', function(req, res){
      var https = require('https');

      var options = {
          host: 'medium.com',
          port: 443,
          path: '/@jasonbejot/latest',
          method: 'GET',
          headers:{
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Accept-Charset': 'utf-8',
          }
      };

      var request = https.request(options, (response) => {
          var body = '';

          response.setEncoding('utf8');

          response.on('data', (chunk) => {
              body += chunk;
          });

          response.on('end', function(){
              body = JSON.parse(body.slice(body.indexOf('{')));
              var posts = [];
              for(var post in body.payload.references.Post) posts.push(body.payload.references.Post[post]);
              res.json({'posts': posts});
          });
      });

      request.on('error', (e) => {
          res.send(e.message);
      });

      request.end();
  });
}
exports.setup = setup
