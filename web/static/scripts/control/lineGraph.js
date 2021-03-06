var lineGraph = {

    data: null,
    animQue: [],
    animating: false,

    polyPoints: [],

    PROP: 'speedIndex',
    HOR_PADDING: 3,

    GRAPH_AMMOUNT: 32,
    ANIM_SPEED: 50,

    TALK_BUBBLE_PADDING: {
        'bottom': 10
    },

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
        $('#line-graph .point').on('mouseenter', lineGraph.pointHoverHand);
        $('#line-graph .point').on('mouseleave', lineGraph.pointLeaveHand);
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

    pointHoverHand: function() {
        $('#line-graph .talk-bubble').show();
        lineGraph.updateTalkBubbleData(this);
        lineGraph.moveTalkBubbleToPoint(this);
    },

    pointLeaveHand: function() {
        $('#line-graph .talk-bubble').hide();
    },

    //---------------------------------------------------------------------------------------------
    //TALK BUBBLE
    //---------------------------------------------------------------------------------------------
    updateTalkBubbleData: function(point) {
        var html = '<span class="value">' + $(point).data('val') + '</span><br /><span class="date">' + $(point).data('date') + '</span>';
        $('#line-graph .talk-bubble').html(html);
    },

    moveTalkBubbleToPoint: function(point) {
        var pos = $(point).position();
        $('#line-graph .talk-bubble').css('top', pos.top - $('#line-graph .talk-bubble').outerHeight() - lineGraph.TALK_BUBBLE_PADDING.bottom);
        $('#line-graph .talk-bubble').css('left', pos.left - $('#line-graph .talk-bubble').outerWidth() / 2);
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
        //for (var prop in lineGraph.animQue) {
        for (var i = 0; i < lineGraph.animQue.length; i++) {
            var node = lineGraph.animQue[i];
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

            //console.log();
            if (node.time >= lineGraph.ANIM_SPEED) {
                lineGraph.animQue.splice(i, 1);
                i--;
            }
        }


        lineGraph.updatePolygon();
        if (lineGraph.animQue.length != 0) {
            requestAnimFrame(lineGraph.animLoop);
        } else {
            lineGraph.animating = false;
        }
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
        var d = lineGraph.data[lineGraph.PROP];
        var x = lineGraph.HOR_PADDING;
        var horInc = (100 - (lineGraph.HOR_PADDING * 2)) / (d.data.length - 1);

        var html = '<div class="points">';

        var i = d.data.length - 1;
        while (i >= 0) {
            var top = (100 - d.data[i].percent);
            html += '<div class="point" style="left:' + x + '%; top:' + top + '%;" data-top="' + top + '" data-val="' + d.data[i].val + '" data-date="' + d.data[i].date + '"><svg height="10" width="10"><circle cx="5" cy="5" r="3" fill="#2E7499" /></svg></div>';

            lineGraph.polyPoints.push({
                'x': x,
                'y': top
            });

            x += horInc;
            i--;
        }

        html += '</div><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polygon fill="#2E7499" /></svg>';

        var targetPercent = 100 - ((d.target - d.min) / (d.max - d.min) * 100);
        html += '<svg class="target-rule" viewBox="0 0 100 100" preserveAspectRatio="none" data-alpha="1"><line x1="0" x2="100" y1="' + targetPercent + '" y2="' + targetPercent + '" stroke="#FFF" stroke-width="1" stroke-dasharray="1"/></svg>';

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
                'page': CURRENT_PAGE,
                'amount': lineGraph.GRAPH_AMMOUNT
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