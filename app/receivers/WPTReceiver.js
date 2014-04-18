//web page test retriver
//https://sites.google.com/a/webpagetest.org/docs/advanced-features/webpagetest-restful-apis
var http = require('http');

module.exports = function() {

    var options = {
        hostname: 'www.webpagetest.org',
        port: 80,
        method: 'GET'
    };

    var API_KEY = 'b167e952bdb74c8d861c98fa37e772f8';
    var API_URL = '/runtest.php';

    var RETRY_TIME = 5000;

    this.getData = function(page, callback) {
        console.log('Getting WPT data for: ' + page);

        startTest(page, callback);
    }

    function startTest(page, callback) {
        var data = '';

        options.path = API_URL + '?url=' + page + '&k=' + API_KEY + '&f=json';

        var req = http.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() {
                testState(JSON.parse(data), page, callback);
            });
        });

        req.on('error', function(e) {
            console.log('problem with receiver request: ' + e.message);
        });

        req.end();
    }


    function testState(dataB, page, callback, jsonURL) {
        if (jsonURL == undefined) {
            jsonURL = dataB.data.jsonUrl;
        }

        var data = '';

        options.path = jsonURL;

        var req = http.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() {
                checkForData(JSON.parse(data), page, jsonURL, callback);
            });
        });

        req.on('error', function(e) {
            console.log('problem with receiver request: ' + e.message);
        });

        req.end();
    }

    function checkForData(data, page, jsonURL, callback) {
        var status = data.data.statusText;
        if (status == undefined) {
            status = data.statusText;
        }

        if (status == 'Test Complete') {
            console.log('WPT data Received for: ' + page);
            parseData(data.data, page, callback);
        } else {
            setTimeout(function() {
                console.log('\t' + status)
                testState(data, page, callback, jsonURL);
            }, RETRY_TIME);
        }
    }


    function parseData(data, page, callback) {
        callback({
            '_page': page,
            'loadTime': (Number(data.average.firstView.loadTime) + Number(data.average.repeatView.loadTime) / 2),
            'renderTime': (Number(data.average.firstView.render) + Number(data.average.repeatView.render) / 2)
        });
    }


}