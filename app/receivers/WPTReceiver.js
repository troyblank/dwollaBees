//web page test retriver
//https://sites.google.com/a/webpagetest.org/docs/advanced-features/webpagetest-restful-apis
var receiver = require('./receiver.js')

module.exports = function() {

    var options = {
        hostname: 'www.webpagetest.org',
        port: 443,
        method: 'GET'
    };

    var API_KEY = '';
    var API_URL = '/runtest.php';

    this.getData = function(page, callback) {
        console.log('Getting WPT data for: ' + page);

        options.path = API_URL + '?url=' + page; //+'&k='+API_KEY
        console.log(options.path);
        var r = new receiver(options, function(data) {
            console.log('WPT data Received for: ' + page);
            parseData(data, page, callback);
        });
    }

    function parseData(data, page, callback) {
        console.log(data);
        console.log('NEED API KEY!!!!')
        // callback({
        //     '_page': page,
        //     'score': data.score,
        //     'numberResources': data.pageStats.numberResources,
        //     'totalRequestBytes': data.pageStats.numberResources,
        //     //secondary
        //     'numberStaticResources': data.pageStats.numberStaticResources,
        //     'numberJsResources': data.pageStats.numberJsResources,
        //     'numberCssResources': data.pageStats.numberCssResources,
        //     //Bar chart/graph?
        //     'htmlResponseBytes': data.pageStats.htmlResponseBytes,
        //     'imageResponseBytes': data.pageStats.imageResponseBytes,
        //     'javascriptResponseBytes': data.pageStats.javascriptResponseBytes,
        //     'otherResponseBytes': data.pageStats.otherResponseBytes
        // });
    }


}