var express = require('express');
var fs = require('fs');
var nunjucks = require('nunjucks');
var _DateUtil = require('./utils/dateUtil.js');

nunjucks.configure(__dirname + '/templates', {
    autoescape: false
});

var server = {

    app: express(),
    page: 'https://dwolla.com',

    DateUtil: new _DateUtil(),

    stats: null,
    STATS_PATH: './app/data/stats.json',

    initialize: function() {
        server.getStats();
        server.urlConfs();
        server.startWebServer();
    },

    startWebServer: function() {
        server.app.listen(8000);
        console.log('Listening on port 8000');
    },

    getBreakdownBarData: function(d) {
        var total = d.jsResponseBytes + d.cssResponseBytes + d.imageResponseBytes + d.otherResponseBytes;
        return {
            'jsResponseKbs': Math.round((d.jsResponseBytes / 1024) * 10) / 10,
            'jsPercent': 100 * (d.jsResponseBytes / total),
            'cssResponseKbs': Math.round((d.cssResponseBytes / 1024) * 10) / 10,
            'cssPercent': 100 * (d.cssResponseBytes / total),
            'imageResponseKbs': Math.round((d.imageResponseBytes / 1024) * 10) / 10,
            'imagePercent': 100 * (d.imageResponseBytes / total),
            'otherResponseKbs': Math.round((d.otherResponseBytes / 1024) * 10) / 10,
            'otherPercent': 100 * (d.otherResponseBytes / total)
        }
    },

    getStats: function(callback) {
        if (fs.existsSync(server.STATS_PATH)) {
            fs.readFile(server.STATS_PATH, 'utf8', function(err, data) {
                server.stats = JSON.parse(data);
            });
        }
    },

    getStat: function(page) {
        if (server.stats != null) {
            return server.stats[page];
        } else {
            return null;
        }
    },

    //---------------------------------------------------------------------------------------------
    //VIEWS
    //---------------------------------------------------------------------------------------------
    home: function(req, res) {
        //get today or yesterdays data
        var today = new Date();
        var data = null;

        server.DateUtil.getDaysData(new Date(), 'daily', 5, server.page, function(data) {
            respond(data[0].date, data);
        });

        function respond(date, data) {
            res.send(nunjucks.render('home.html', {
                'date': server.DateUtil.prettyUpDate(date),
                'data': data,
                'stats': server.getStat(server.page),
                'breakdown': server.getBreakdownBarData(data[0])
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