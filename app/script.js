//should we use http://gtmetrix.com/api/ ?

var fs = require('fs');
var mkdirp = require('mkdirp');
var _GPSReceiver = require('./receivers/GPSReceiver.js');
var _WPTReceiver = require('./receivers/WPTReceiver.js');
var _GTMReceiver = require('./receivers/GTMReceiver.js');

var dwollaBees = {

    GPSRetriever: new _GPSReceiver(),
    GTMRetriever: new _GTMReceiver(),
    WPTRetriever: new _WPTReceiver(),

    pageCount: 0,
    pagesToGet: [
        'http://dwolla.com',
        'https://www.dwolla.com/register'
    ],
    serviceCount: 0,
    servicesToCall: [
        //'WPTRetriever',
        'GPSRetriever',
        'GTMRetriever'
    ],

    data: new Object(),

    initialize: function() {
        dwollaBees.recieveData();
    },

    //DATA
    //-------------------------------------------
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

    //HANDLERS
    //-------------------------------------------
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
            dwollaBees.saveData();
        }
    }
}

dwollaBees.initialize();