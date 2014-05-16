//should we use http://gtmetrix.com/api/ ?

var fs = require('fs');
var mkdirp = require('mkdirp');
var _GPSReceiver = require('./receivers/GPSReceiver.js');
var _WPTReceiver = require('./receivers/WPTReceiver.js');

var _stats = require('./stats.js');

var dwollaBees = {

    GPSRetriever: new _GPSReceiver(),
    WPTRetriever: new _WPTReceiver(),

    stats: null,

    pageCount: 0,
    pagesToGet: null,
    serviceCount: 0,
    servicesToCall: [
        'GPSRetriever',
        'WPTRetriever'
    ],

    data: new Object(),

    CONFIG_PATH: './app/config.json',

    initialize: function() {
        dwollaBees.getPages();
        dwollaBees.stats = new _stats(dwollaBees);
        dwollaBees.recieveData();
    },

    getPages: function(d) {
        if (fs.existsSync(dwollaBees.CONFIG_PATH)) {
            var data = fs.readFileSync(dwollaBees.CONFIG_PATH, 'utf8');
            dwollaBees.pagesToGet = JSON.parse(data).config.pagesToGet;
        }
    },


    //---------------------------------------------------------------------------------------------
    //DATA
    //---------------------------------------------------------------------------------------------
    recieveData: function() {
        var page = dwollaBees.pagesToGet[dwollaBees.pageCount];
        dwollaBees[dwollaBees.servicesToCall[dwollaBees.serviceCount]].getData(page, dwollaBees.gotData);
    },

    tempStoreData: function(data) {
        var page = data._page;
        delete data._page;

        if (!dwollaBees.data.hasOwnProperty(page)) {
            dwollaBees.data[page] = new Object();
        }

        //mix object props
        for (var prop in data) {
            if (!dwollaBees.data[page].hasOwnProperty(prop)) {
                dwollaBees.data[page][prop] = data[prop];
            }
        }
    },

    saveData: function() {
        var str = JSON.stringify(dwollaBees.data);

        var d = new Date();
        var path = './app/data/' + d.getFullYear() + '/' + d.getMonth() + '/';
        var file = d.getDate() + '.json';

        mkdirp(path, function() {
            fs.writeFile(path + file, str, function(e) {
                if (e) {
                    console.log(e);
                }
            });
        });
    },

    //---------------------------------------------------------------------------------------------
    //HANDLERS
    //---------------------------------------------------------------------------------------------
    gotData: function(data) {
        if (data != null) {
            dwollaBees.tempStoreData(data);
        }

        //look for more services or pages to get data on
        dwollaBees.serviceCount++;
        if (dwollaBees.serviceCount >= dwollaBees.servicesToCall.length) {
            dwollaBees.serviceCount = 0;
            dwollaBees.pageCount++;
        }
        //check for page completion
        if (dwollaBees.pageCount < dwollaBees.pagesToGet.length) {
            dwollaBees.recieveData();
        } else {
            dwollaBees.stats.checkForStatChanges();
            dwollaBees.saveData();
        }
    }
}

dwollaBees.initialize();