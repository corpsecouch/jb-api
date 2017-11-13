function setup(app){
  /*
      /goodreads/current
      chops up the goodreads widget to guarantee images
  */
  app.get('/goodreads/current', function(req, res){
      var https = require('https');
      var options = {
          host: 'www.goodreads.com',
          path: '/review/grid_widget/37984300?cover_size=medium&hide_link=true&hide_title=true&num_books=1&order=d&shelf=currently-reading&sort=date_updated&widget_id=1467486106',
          method: 'GET'
      };

      var request = https.request(options, (response) => {
          var body = '';

          response.setEncoding('utf8');

          response.on('data', (chunk) => {
              body += chunk;
          });

          response.on('end', function(){
              var payload = {data:{}};
              var match = body.match(/<a title[^>]*>.*?a>/i);
              match = match[0].replace(/\\(["'\/])/g, '$1');
              match = match.replace(/src="(.*books\/)(.*)m/, 'src="$1$2l');
              match = match.match(/title="(.*?)".*href="(.*?)".*src="(.*?)"/);
              payload.data = {
                title: match[1],
                url: match[2],
                src: match[3]
              }

              res.json(payload);
          });
      });

      request.on('error', (e) => {
          res.error(e.message);
      });

      request.end();
  });



  /*
      /goodreads/read
      chops up the goodreads widget to guarantee images
  */
  app.get('/goodreads/read', function(req, res){
      var https = require('https');
      var options = {
          host: 'www.goodreads.com',
          path: '/review/grid_widget/37984300?cover_size=medium&hide_link=true&hide_title=true&num_books=100&order=d&shelf=read&sort=date_read&widget_id=1467410945',
          method: 'GET'
      };

      var request = https.request(options, (response) => {
          var body = '';

          response.setEncoding('utf8');

          response.on('data', (chunk) => {
              body += chunk;
          });

          response.on('end', function(){
              var payload = {data:[]};
              var split;
              var matches = body.match(/<a title[^>]*>.*?a>/gi);

              for(var i = 0; i < matches.length; i++){
                matches[i] = matches[i].replace(/\\(["'\/])/g, '$1');
                split = matches[i].match(/title="(.*?)".*href="(.*?)".*src="(.*?)"/);

                payload.data.push(
                  {
                    title: split[1],
                    url: split[2],
                    src: split[3]
                  }
                );
              }
              res.json(payload);
          });
      });

      request.on('error', (e) => {
        res.status(500);
        res.json(e);
      });

      request.end();
  });
}
exports.setup = setup;
