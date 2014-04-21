module.exports = function() {

    var fs = require('fs');

    this.prettyUpDate = function(date) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }

    this.getDaysData = function(originDate, type, amount, page, callback) {
        //type can be daily or monthy.
        //amount is the amount of days or months to go back in time
        var days = getDays(originDate, type, amount);
        getData(days, page, callback);
    }

    function getDays(originDate, type, amount) {
        var days = [new Date(originDate)];
        var i = amount - 1;
        while (i > 0) {
            switch (type) {
                case 'daily':
                    originDate.setDate(originDate.getDate() - 1);
                    break;
                case 'monthly':
                    originDate.setMonth(originDate.getMonth() - 1);
                    break;
            }

            var node = new Date(originDate);
            days.push(node);
            i--;
        }

        return days;
    }


    function getData(days, page, callback, i, datas) {
        var datas = datas != undefined ? datas : new Array();
        var i = i != undefined ? i : 0;

        setThroughDay(days[i], function(data) {
            datas.push(data);
            i++;
            if (i < days.length) {
                getData(days, page, callback, i, datas);
            } else {
                callback(datas);
            }
        });


        function setThroughDay(day, callback, lastTry) {
            getDayData(day, function(data) {
                data = data;
                if (data) {
                    data[page].date = day;
                    callback(data[page]);
                } else {
                    if (lastTry) {
                        callback(null);
                    } else {
                        //get yesterdays data
                        day.setDate(day.getDate() - 1);
                        setThroughDay(day, callback, true);
                    }
                }
            });
        }
    }

    function getDayData(date, callback) {
        var path = __dirname + '/../../app/data/' + date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + '.json';

        if (fs.existsSync(path)) {
            fs.readFile(path, 'utf8', function(err, data) {
                callback(JSON.parse(data));
            });
        } else {
            callback(false);
        }
    }
}