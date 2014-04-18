var express = require('express');
var nunjucks = require('nunjucks');
var fs = require('fs');
var walk = require('walk');

nunjucks.configure(__dirname + '/templates', {
    autoescape: false
});

var server = {

    app: express(),
    page: 'http://dwolla.com',

    initialize: function() {
        server.urlConfs();
        server.startWebServer();
    },

    startWebServer: function() {
        server.app.listen(8000);
        console.log('Listening on port 8000');
    },

    getDaysData: function(date, callback) {
        var path = __dirname + '/../app/data/' + date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + '.json';



        if (fs.existsSync(path)) {
            fs.readFile(path, 'utf8', function(err, data) {
                callback(JSON.parse(data));
            });
        } else {
            callback(false);
        }
    },

    prettyUpDate: function(date) {
        return date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
    },

    //---------------------------------------------------------------------------------------------
    //VIEWS
    //---------------------------------------------------------------------------------------------
    home: function(req, res) {
        //get today or yesterdays data
        var today = new Date();
        var data = null;

        server.getDaysData(today, function(data) {
            data = data;
            if (data) {
                respond(today, data[server.page]);
            } else {
                //get yesterdays data
                today.setDate(today.getDate() - 1);
                data = server.getDaysData(today, function(data) {
                    data = data;
                    respond(today, data[server.page]);
                });
            }
        });

        function respond(date, data) {
            res.send(nunjucks.render('home.html', {
                'date': server.prettyUpDate(date),
                'data': data
            }));
        }
    },

    //---------------------------------------------------------------------------------------------
    //URL CONFS
    //---------------------------------------------------------------------------------------------
    urlConfs: function() {
        server.app.get('/', server.home);
        //static
        server.app.use(express.static(__dirname + '/static'));
    }


}

server.initialize();