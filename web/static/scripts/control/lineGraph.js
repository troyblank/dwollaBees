var lineGraph = {

    data: null,
    animQue: [],
    animating: false,

    polyPoints: [],

    PROP: 'speedIndex',
    HOR_PADDING: 3,

    ANIM_SPEED: 50,

    initialize: function() {
        lineGraph.getData();
    },

    postInitialize: function() {
        lineGraph.addGraph();
        lineGraph.addListeners();
    },

    //---------------------------------------------------------------------------------------------
    //INTERACTION
    //---------------------------------------------------------------------------------------------

    addListeners: function() {
        $('.graph-switches button').on('click', lineGraph.propChangeClickHand);
    },

    propChangeClickHand: function() {
        if (!$(this).hasClass('active')) {
            $('.graph-switches button').removeClass('active');
            $(this).addClass('active');

            lineGraph.PROP = $(this).attr('data-prop');

            lineGraph.updateTitle();
            lineGraph.updateGraph();
        }
    },

    //---------------------------------------------------------------------------------------------
    //ANIMATION
    //---------------------------------------------------------------------------------------------

    startAnimation: function() {
        if (!lineGraph.animating) {
            lineGraph.animating = true;
            lineGraph.animLoop();
        }
    },

    animLoop: function() {
        for (var prop in lineGraph.animQue) {
            var node = lineGraph.animQue[prop];
            node.time++;

            var val = AnimUtil.easeInQuad(node.time, node.start, node.change, lineGraph.ANIM_SPEED);
            switch (node.prop) {
                case 'top':
                    $(node.ele).css('top', (val + '%'));
                    $(node.ele).attr('data-top', val);
                    lineGraph.polyPoints[$(node.ele).index()].y = val;
                    break;
                case 'alpha':
                    $(node.ele).css('opacity', val);
                    $(node.ele).attr('data-alpha', val);
                    break;
            }

            if (node.time >= lineGraph.ANIM_SPEED) {
                delete lineGraph.animQue[prop];
            }
        }

        if (lineGraph.animQue.length == 0) {
            console.log('DONE!!!');
        }

        lineGraph.updatePolygon();
        requestAnimFrame(lineGraph.animLoop);
    },

    //---------------------------------------------------------------------------------------------
    //VISUAL
    //---------------------------------------------------------------------------------------------

    updateGraph: function() {
        lineGraph.animQue = [];

        var d = lineGraph.data[lineGraph.PROP];

        var i = d.data.length - 1;
        while (i >= 0) {
            var top = (100 - d.data[i].percent);
            var ele = $('#line-graph .point')[(d.data.length - i - 1)];
            var start = Number($(ele).attr('data-top'));

            lineGraph.animQue.push({
                'ele': ele,
                'prop': 'top',
                'start': start,
                'change': top - start,
                'time': 0,
            });

            i--;
        }

        lineGraph.startAnimation();

        //target
        var alpha = 1;
        if (d.target == null) {
            alpha = 0;
        }

        var ele = $('#line-graph .target-rule')[0];
        var start = Number($(ele).attr('data-alpha'));

        lineGraph.animQue.push({
            'ele': ele,
            'prop': 'alpha',
            'start': start,
            'change': alpha - start,
            'time': 0,
        });
    },

    addGraph: function() {
        $('#line-graph').empty();

        var d = lineGraph.data[lineGraph.PROP];
        var x = lineGraph.HOR_PADDING;
        var horInc = (100 - (lineGraph.HOR_PADDING * 2)) / (d.data.length - 1);

        var html = '';

        var i = d.data.length - 1;
        while (i >= 0) {
            var top = (100 - d.data[i].percent);
            html += '<div class="point" style="left:' + x + '%; top:' + top + '%;" data-top="' + top + '"><svg height="10" width="10"><circle cx="5" cy="5" r="5" fill="#2E7499" /></svg></div>';

            lineGraph.polyPoints.push({
                'x': x,
                'y': top
            });

            x += horInc;
            i--;
        }

        html += '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon fill="#2E7499" /></svg>';

        var targetPercent = 100 - ((d.target - d.min) / (d.max - d.min) * 100);
        html += '<svg class="target-rule" viewBox="0 0 100 100" preserveAspectRatio="none" data-alpha="1"><line x1="0" x2="100" y1="' + targetPercent + '" y2="' + targetPercent + '" stroke="#555555" stroke-width="1" stroke-dasharray="1"/></svg>';

        $('#line-graph').append(html);

        lineGraph.updatePolygon();
    },

    updatePolygon: function() {
        var pointStr = '0 ' + lineGraph.polyPoints[0].y + ' ';
        for (var i = 0; i < lineGraph.polyPoints.length; i++) {
            var p = lineGraph.polyPoints[i];
            pointStr += p.x + ' ' + p.y + ' ';
        }

        $('#line-graph polygon').attr('points', pointStr + '100 ' + lineGraph.polyPoints[lineGraph.polyPoints.length - 1].y + ' 100 100 0 100');
    },

    updateTitle: function() {
        $('.line-graph-title').html('Historical - ' + $('.graph-switches button.active').html());
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
        lineGraph.postInitialize();
    }
}

$(document).ready(lineGraph.initialize());