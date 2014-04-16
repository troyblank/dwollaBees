var fs = require('fs');
var mkdirp = require('mkdirp');
var _GPSReceiver = require('./receivers/GPSReceiver.js');



var dwollaBees = {

    GPSRetriever: new _GPSReceiver(),

    pageCount: 0,
    pagesToGet: [
        'http://dwolla.com',
        'https://www.dwolla.com/register'
    ],

    data: new Object(),

    initialize: function() {
        dwollaBees.recieveData();
    },

    //DATA
    //-------------------------------------------
    recieveData: function() {
        var page = dwollaBees.pagesToGet[dwollaBees.pageCount];
        dwollaBees.GPSRetriever.getData(page, dwollaBees.gotGPSData);
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
    gotGPSData: function(data) {
        dwollaBees.tempStoreData(data);

        //look for more pages to get data on
        dwollaBees.pageCount++;
        if (dwollaBees.pageCount < dwollaBees.pagesToGet.length) {
            dwollaBees.recieveData();
        } else {
            dwollaBees.saveData();
        }
    }
}

dwollaBees.initialize();