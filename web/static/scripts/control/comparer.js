comparer = {

    initialize: function() {
        comparer.dateRanges();
        comparer.dataHandler();
    },

    //-----------------------------------------------------------------------------------------
    //DATE RANGE DROPS
    //-----------------------------------------------------------------------------------------

    dateRanges: function() {

        var root = this.dateRanges;

        root.pickerAIn = new Pikaday({
            field: document.getElementById('a-in-date')
        });
        root.pickerAOut = new Pikaday({
            field: document.getElementById('a-out-date')
        });
        root.pickerBIn = new Pikaday({
            field: document.getElementById('b-in-date')
        });
        root.pickerBOut = new Pikaday({
            field: document.getElementById('b-out-date')
        });


        function initialize() {
            addListeners();
            setPikADayBounds();
        }

        function addListeners() {
            $('.datepicker').on('change', inputChangeHand);
        }

        //-------
        //PIKADAY
        //-------

        function setPikADayBounds(aIn, aOut, bIn, bOut) {
            //set A
            if (aIn != null) {
                root.pickerAOut.setMinDate(new Date(aIn + 1));
            }

            if (aOut != null) {
                root.pickerAIn.setMaxDate(new Date(aOut - 1));
            }

            //set B
            if (bIn != null) {
                root.pickerBOut.setMinDate(new Date(bIn + 1));
            }

            if (bOut != null) {
                root.pickerBIn.setMaxDate(new Date(bOut - 1));
            }
        }


        //--------
        //HANDLERS
        //--------

        function inputChangeHand() {
            var aIn = root.pickerAIn.getDate();
            var aOut = root.pickerAOut.getDate();
            var bIn = root.pickerBIn.getDate();
            var bOut = root.pickerBOut.getDate();

            setPikADayBounds(aIn, aOut, bIn, bOut);
            comparer.dataHandler.checkForDataChange(aIn, aOut, bIn, bOut);
        }


        initialize();
    },

    //-----------------------------------------------------------------------------------------
    //DATA HANDLER
    //-----------------------------------------------------------------------------------------

    dataHandler: function() {

        var root = this.dataHandler;

        var oldAIn = null;
        var oldAOut = null;
        var oldBIn = null;
        var oldBOut = null;

        root.checkForDataChange = function(aIn, aOut, bIn, bOut) {
            if (aIn != null && aOut != null) {
                if (aIn.getTime() != oldAIn || aOut.getTime() != oldAOut) {
                    getData('a', aIn, aOut);
                }

                oldAIn = aIn.getTime();
                oldAOut = aOut.getTime();
            }
            if (bIn != null && bOut != null) {
                if (bIn.getTime() != oldBIn || bOut.getTime() != oldBOut) {
                    getData('b', bIn, bOut);
                }

                oldBIn = bIn.getTime();
                oldBOut = bOut.getTime();
            }
        }

        function initialize() {
            var aIn = comparer.dateRanges.pickerAIn.getDate();
            var aOut = comparer.dateRanges.pickerAOut.getDate();
            var bIn = comparer.dateRanges.pickerBIn.getDate();
            var bOut = comparer.dateRanges.pickerBOut.getDate();

            root.checkForDataChange(aIn, aOut, bIn, bOut);

            oldAIn = extractTime(aIn);
            oldAOut = extractTime(aOut);
            oldBIn = extractTime(bIn);
            oldBOut = extractTime(bOut);
        }

        function injectData(data) {
            console.log(data);
        }

        function extractTime(date) {
            if (date != null) {
                return date.getTime();
            } else {
                return null;
            }
        }

        //--------
        //DATA
        //--------

        function getData(frame, dateIn, dateOut) {
            $.ajax({
                'type': 'GET',
                'url': '/rangeData',
                'data': {
                    'frame': frame,
                    'start': dateIn.getTime().toString(),
                    'end': dateOut.getTime().toString()
                },
                'success': function(data) {
                    injectData(data);
                },
            });
        }

        //--------
        //HANDLERS
        //--------
        function inputChangeHand() {
            checkForDataChange();
        }

        initialize();
    }
}


$(document).ready(comparer.initialize)