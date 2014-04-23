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

        options.path = API_URL + '?url=' + page + '&k=' + API_KEY + '&f=json&video=1';

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
            console.log('\t retrieved data from: ' + jsonURL);

            var dataIsValid = validateData(data);

            if (dataIsValid) {
                console.log('WPT data Received for: ' + page);
                parseData(data.data, page, callback);
            } else {
                console.log('DATA WAS NOT VALID!!! -- retrying test.');
                startTest(page, callback);
            }


        } else {
            setTimeout(function() {
                console.log('\t' + status)
                testState(data, page, callback, jsonURL);
            }, RETRY_TIME);
        }
    }

    function validateData(data) {
        try {
            if (data.data.runs['1'].firstView == null) {
                return false;
            }
        } catch (e) {
            return false;
        }

        return true;
    }


    function parseData(data, page, callback) {
        callback({
            '_page': page,
            'speedIndex': Number(data.runs['1'].firstView.SpeedIndex),

            'loadTime': (Number(data.runs['1'].firstView.loadTime) + Number(data.runs['1'].repeatView.loadTime) / 2),
            'renderTime': (Number(data.runs['1'].firstView.render) + Number(data.runs['1'].repeatView.render) / 2),

            'pageSize': Number(data.runs['1'].firstView.bytesIn),
            'numberJsResources': Number(data.runs['1'].firstView.breakdown.js.requests),
            'jsResponseBytes': Number(data.runs['1'].firstView.breakdown.js.bytes),
            'numberCssResources': Number(data.runs['1'].firstView.breakdown.css.requests),
            'cssResponseBytes': Number(data.runs['1'].firstView.breakdown.css.bytes),
            'numberImageResources': Number(data.runs['1'].firstView.breakdown.image.requests),
            'imageResponseBytes': Number(data.runs['1'].firstView.breakdown.image.bytes),
            'numberOtherResources': Number(data.runs['1'].firstView.breakdown.other.requests),
            'otherResponseBytes': Number(data.runs['1'].firstView.breakdown.other.bytes)
        });
    }


}