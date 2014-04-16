//reciver | used to get data from services
var https = require('https');

module.exports = function(options, callback) {
    var data = '';

    var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            callback(JSON.parse(data));
        });
    });

    req.on('error', function(e) {
        console.log('problem with receiver request: ' + e.message);
    });

    req.end();
}