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

    LINE_GRAPH_PROPS: ['speedIndex', 'loadTime', 'renderTime', 'pageSize'],
    LINE_GRAPH_TARGETS: {
        'speedIndex': 1000,
        'loadTime': null,
        'renderTime': null,
        'pageSize': null
    },

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

    getLineGraphData: function(d) {
        var lineGraphData = new Object();

        for (var i = 0; i < d.length; i++) {
            var node = d[i];
            for (var j = 0; j < server.LINE_GRAPH_PROPS.length; j++) {
                var prop = server.LINE_GRAPH_PROPS[j];
                if (lineGraphData[prop] == undefined) {
                    var min = server.stats[server.page].minMax[prop].min;
                    var max = server.stats[server.page].minMax[prop].max;

                    lineGraphData[prop] = new Object();
                    lineGraphData[prop].min = min;
                    lineGraphData[prop].max = max;
                    lineGraphData[prop].target = server.LINE_GRAPH_TARGETS[prop];
                    lineGraphData[prop].data = new Array();
                }

                if (node != null) {
                    var val = node[prop];
                    lineGraphData[prop].data.push({
                        'val': val,
                        'percent': val / (max - min)
                    });
                } else {
                    lineGraphData[prop].data.push({
                        'val': 0,
                        'precent': 0
                    });
                }
            }
        }

        return lineGraphData;
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
                'breakdown': server.getBreakdownBarData(data[0]),
                'lineGraphData': server.getLineGraphData(data)
            }));
        }
    },

    //---------------------------------------------------------------------------------------------
    //API
    //---------------------------------------------------------------------------------------------
    lineGraphDataAPI: function(req, res) {
        var d = new Date();
        res.send(200, {
            date: d
        });
    },

    //---------------------------------------------------------------------------------------------
    //URL CONFS
    //---------------------------------------------------------------------------------------------
    urlConfs: function() {
        server.app.get('/', server.home);
        //api
        server.app.get('/lineGrapData', server.lineGraphDataAPI);
        //static
        server.app.use(express.static(__dirname + '/static'));
    }
}

server.initialize();