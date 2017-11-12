function setup(app){
  app.get('/goodreads/current', function(req, res){
    var http = require('http');
    var xml2js = require('xml2js');

    var options = {
        host: 'www.goodreads.com',
        port: 80,
        path: '/review/list?v=2&key=bMQakmDgjvTY0R6mtWaBBg&id=37984300-jason&shelf=currently-reading&order=d&sort=date_updated',
        method: 'GET'
    };

    var request = http.request(options, (response) => {
      var body = '';

      response.setEncoding('utf8');

      response.on('data', (chunk) => {
          body += chunk;
      });

      response.on('end', function(){
          xml2js.parseString(body, function(err, result){
            if(err){
              res.error(err);
              return;
            }

            var payload = {data:{}};
            var book = result.GoodreadsResponse.reviews[0].review;
            if(book.length > 0){
              payload.data = {
                title: book[0].book[0].title[0],
                url: book[0].book[0].link[0],
                src: book[0].book[0].image_url[0].replace(/(.*books\/)(.*)m(.*)/, '$1$2l$3')
              };
            }

            res.json(payload);
          });
      });
    });

    request.on('error', (e) => {
        res.error(e.message);
    });

    request.end();

  });

  /*
      [OLD]
      /goodreads/current
      chops up the goodreads widget to guarantee images
  */
  /*app.get('/goodreads/current', function(req, res){
      var http = require('http');
      var options = {
          host: 'www.goodreads.com',
          port: 80,
          path: '/review/grid_widget/37984300?cover_size=medium&hide_link=true&hide_title=true&num_books=1&order=d&shelf=currently-reading&sort=date_updated&widget_id=1467486106',
          method: 'GET'
      };

      var request = http.request(options, (response) => {
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
  });*/


  app.get('/goodreads/read', function(req, res){
    var http = require('http');
    var xml2js = require('xml2js');

    var options = {
        host: 'www.goodreads.com',
        port: 80,
        path: '/review/list?v=2&key=bMQakmDgjvTY0R6mtWaBBg&id=37984300-jason&shelf=read&order=d&sort=date_read&per_page=100',
        method: 'GET'
    };

    var request = http.request(options, (response) => {
      var body = '';

      response.setEncoding('utf8');

      response.on('data', (chunk) => {
          body += chunk;
      });

      response.on('end', function(){
          xml2js.parseString(body, function(err, result){
            if(err){
              res.error(err);
              return;
            }

            var payload = {data:[]};
            var book = result.GoodreadsResponse.reviews[0].review;
            for(var i = 0; i < book.length; i++){

              payload.data.push({
                title: book[i].book[0].title[0],
                url: book[i].book[0].link[0],
                src: book[0].book[0].image_url[0].replace(/(.*books\/)(.*)m(.*)/, '$1$2l$3')
              });
            }

            res.json(payload);
          });
      });
    });

    request.on('error', (e) => {
        res.error(e.message);
    });

    request.end();

  });

  /*
      [OLD]
      /goodreads/read
      chops up the goodreads widget to guarantee images
  */
  /*app.get('/goodreads/read', function(req, res){
      var http = require('http');
      var options = {
          host: 'www.goodreads.com',
          port: 80,
          path: '/review/grid_widget/37984300?cover_size=medium&hide_link=true&hide_title=true&num_books=100&order=d&shelf=read&sort=date_read&widget_id=1467410945',
          method: 'GET'
      };

      var request = http.request(options, (response) => {
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
          res.error(e.message);
      });

      request.end();
  });*/
}
exports.setup = setup;
