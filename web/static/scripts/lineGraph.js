var lineGraph = {

    data: null,
    PROP: 'speedIndex',
    HOR_PADDING: 3,

    initialize: function() {
        lineGraph.getData();
    },

    updateGraph: function() {
        $('#line-graph').empty();

        var d = lineGraph.data[lineGraph.PROP];
        var x = lineGraph.HOR_PADDING;
        var horInc = (100 - (lineGraph.HOR_PADDING * 2)) / (d.data.length - 1);

        var html = '';
        var polyPoints = '0 ' + (100 - d.data[d.data.length - 1].percent) + ' ';

        var i = d.data.length - 1;
        while (i >= 0) {
            var top = (100 - d.data[i].percent);
            html += '<div class="point" style="left:' + x + '%; top:' + top + '%;"><svg height="10" width="10"><circle cx="5" cy="5" r="5" fill="#2E7499" /></svg></div>';

            polyPoints += x + ' ' + top + ' ';
            x += horInc;
            i--;
        }

        polyPoints += '100 ' + (100 - d.data[0].percent) + ' ';
        html += '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="' + polyPoints + '100 100 0 100" fill="#2E7499" /></svg>';

        $('#line-graph').append(html);
    },

    //---------------------------------------------------------------------------------------------
    //DATA
    //---------------------------------------------------------------------------------------------
    getData: function() {
        $.ajax({
            'type': 'GET',
            'url': '/lineGrapData',
            'data': {
                'page': CURRENT_PAGE
            },
            'success': function(data) {
                lineGraph.gotData(data);
            },
        });
    },

    gotData: function(data) {
        lineGraph.data = data;
        lineGraph.updateGraph();
    }
}

$(document).ready(lineGraph.initialize());