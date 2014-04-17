//reciver | used to get data from services
var https = require('https');

module.exports = function(options, callback, postData) {
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

    //write post data if there
    if (postData != undefined) {
        req.write(postData);
    }

    req.end();
}