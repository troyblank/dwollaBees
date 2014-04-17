//google page speed retriver
var receiver = require('./receiver.js')

//var CHART_API_URL = 'http://chart.apis.google.com/chart?';

module.exports = function() {

    var options = {
        hostname: 'www.googleapis.com',
        port: 443,
        method: 'GET'
    };

    var API_KEY = 'AIzaSyB6nVsYQk_b9nFTLDzonCkiko7-_T5EJ20';
    var API_URL = '/pagespeedonline/v1/runPagespeed';

    this.getData = function(page, callback) {
        console.log('Getting GPS data for: ' + page);

        options.path = API_URL + '?url=' + page + '&key=' + API_KEY;
        var r = new receiver(options, function(data) {
            console.log('GPS data Received for: ' + page);
            parseData(data, page, callback);
        });
    }

    function parseData(data, page, callback) {
        callback({
            '_page': page,
            'score': data.score,
            'numberResources': data.pageStats.numberResources,
            'totalRequestBytes': data.pageStats.numberResources,
            //secondary
            'numberStaticResources': data.pageStats.numberStaticResources,
            'numberJsResources': data.pageStats.numberJsResources,
            'numberCssResources': data.pageStats.numberCssResources,
            //Bar chart/graph?
            'htmlResponseBytes': data.pageStats.htmlResponseBytes,
            'imageResponseBytes': data.pageStats.imageResponseBytes,
            'javascriptResponseBytes': data.pageStats.javascriptResponseBytes,
            'otherResponseBytes': data.pageStats.otherResponseBytes
        });
    }


}