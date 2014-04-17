var express = require('express');
var nunjucks = require('nunjucks');
var fs = require('fs');
var walk = require('walk');

nunjucks.configure(__dirname + '/templates', {
    autoescape: false
});

var server = {

    app: express(),

    initialize: function() {
        server.urlConfs();
        server.startWebServer();
    },

    startWebServer: function() {
        server.app.listen(8000);
        console.log('Listening on port 8000');
    },

    // getDaysData: function(date) {

    // },

    //---------------------------------------------------------------------------------------------
    //VIEWS
    //---------------------------------------------------------------------------------------------
    home: function(req, res) {
        //var today = new Date();

        res.send(nunjucks.render('home.html'));
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