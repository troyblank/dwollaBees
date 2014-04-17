//gt metrix retriver
//http://gtmetrix.com/api/
var querystring = require('querystring');
var receiver = require('./receiver.js');

module.exports = function() {

    var options = {
        hostname: 'www.gtmetrix.com',
        port: 443,
        method: 'POST'
    };

    var API_USER = 'troy@dwolla.com';
    var API_KEY = '07ecc398576bc5fac647567b5c8b373c';
    var API_URL = '/api/0.1/test';

    var RETRY_TIME = 5000;

    var auth = 'Basic ' + new Buffer(API_USER + ':' + API_KEY).toString('base64');

    this.getData = function(page, callback) {
        console.log('Getting GTM data for: ' + page);

        startTest(page, callback);
    }

    function startTest(page, callback) {
        options.method = 'POST';
        options.path = API_URL;
        var data = querystring.stringify({
            'url': page
        });
        options.headers = {
            'Authorization': auth,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }

        var r = new receiver(options, function(data) {
            testState(data, page, callback);
        }, data);
    }

    function testState(data, page, callback, test_id) {
        if (test_id == undefined) {
            test_id = data.test_id;
        }

        options.method = 'GET';
        options.path = API_URL + '/' + test_id;
        options.headers = {
            'Authorization': auth,
        }

        var r = new receiver(options, function(data) {
            checkForData(data, page, test_id, callback);
        });
    }

    function checkForData(data, page, test_id, callback) {
        if (data.state == 'completed') {
            console.log('GTM data Received for: ' + page);
            parseData(data, page, callback);
        } else if (data.state == 'error') {
            console.log('Error getting data from GTMetrix');
            callback(null);
        } else {
            setTimeout(function() {
                console.log('.');
                testState(data, page, callback, test_id);
            }, RETRY_TIME);
        }
    }

    function parseData(data, page, callback) {
        callback({
            '_page': page,
            'pageLoadTime': Number(data.results.page_load_time),
        });
    }
}