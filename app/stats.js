//This stores historical trends that would be costly to query during runtime like:
//score | if it's up or down from the last change
module.exports = function(dwollaBees) {
    var fs = require('fs');

    var dwollaBees = dwollaBees;
    var stats = new Object();

    var STATS_PATH = './app/data/stats.json';

    var MIN_MAX_CHECKS = ['speedIndex', 'loadTime', 'renderTime', 'pageSize'];

    this.checkForStatChanges = function() {
        for (var i = 0; i < dwollaBees.pagesToGet.length; i++) {
            var page = dwollaBees.pagesToGet[i];
            if (stats[page] == undefined) {
                stats[page] = new Object();
            }
            checkForScoreChange(page);
            checkForMinMaxChanges(page);
        }

        saveStats(stats);
    }

    function checkForScoreChange(page) {
        if (stats[page].score != undefined) {
            var lastChanged = stats[page].score.lastChanged;
            if (lastChanged.currentValue != dwollaBees.data[page].score) {
                lastChanged.lastValue = lastChanged.currentValue;
                lastChanged.currentValue = dwollaBees.data[page].score;
                if (lastChanged.lastValue < lastChanged.currentValue) {
                    lastChanged.direction = 'up';
                } else {
                    lastChanged.direction = 'down';
                }
                lastChanged.date = new Date();
            }
        } else {
            //first time storing
            stats[page].score = {};
            stats[page].score.lastChanged = {};
            stats[page].score.lastChanged.lastValue = dwollaBees.data[page].score;
            stats[page].score.lastChanged.currentValue = dwollaBees.data[page].score;
            stats[page].score.lastChanged.direction = 'up';
            stats[page].score.lastChanged.date = new Date();
        }
    }

    function checkForMinMaxChanges(page) {
        if (stats[page].minMax != undefined) {
            for (var i = 0; i < MIN_MAX_CHECKS.length; i++) {
                var prop = MIN_MAX_CHECKS[i];
                var min = stats[page].minMax[prop].min;
                var max = stats[page].minMax[prop].max;
                var val = dwollaBees.data[page][prop];
                if (val < min) {
                    stats[page].minMax[prop].min = val;
                } else if (val > max) {
                    stats[page].minMax[prop].max = val;
                }
            }
        } else {
            //first time storing
            stats[page].minMax = {};
            for (var i = 0; i < MIN_MAX_CHECKS.length; i++) {
                var prop = MIN_MAX_CHECKS[i];
                var val = dwollaBees.data[page][prop];
                stats[page].minMax[prop] = {
                    'min': val,
                    'max': val
                };
            }
        }
    }

    function getStats(callback) {
        if (fs.existsSync(STATS_PATH)) {
            fs.readFile(STATS_PATH, 'utf8', function(err, data) {
                callback(JSON.parse(data));
            });
        } else {
            callback(false);
        }
    }

    function saveStats(data) {

        var str = JSON.stringify(data);

        fs.writeFile(STATS_PATH, str, function(e) {
            if (e) {
                console.log(e);
            }
        });
    }

    function statsReceived(data) {
        if (data != false) {
            stats = data;
        }
    }

    getStats(statsReceived);
}