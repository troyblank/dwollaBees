comparer = {
    initialize: function() {
        comparer.dateRanges();
    },

    dateRanges: function() {

        var pickerAIn = new Pikaday({
            field: document.getElementById('a-in-date')
        });
        var pickerAOut = new Pikaday({
            field: document.getElementById('a-out-date')
        });
        var pickerBIn = new Pikaday({
            field: document.getElementById('b-in-date')
        });
        var pickerBOut = new Pikaday({
            field: document.getElementById('b-out-date')
        });

        function initialize() {
            addListeners();
            setPikADayBounds();
        }

        function addListeners() {
            $('.datepicker').on('change', inputChangeHand);
        }

        //-----------------------------------------------------------------------------------------
        //PIKADAY
        //-----------------------------------------------------------------------------------------

        function setPikADayBounds() {
            //set A
            var aIn = pickerAIn.getDate();
            var aOut = pickerAOut.getDate();

            if (aIn != null) {
                pickerAOut.setMinDate(new Date(aIn + 1));
            }

            if (aOut != null) {
                pickerAIn.setMaxDate(new Date(aOut - 1));
            }

            //set B
            var bIn = pickerBIn.getDate();
            var bOut = pickerBOut.getDate();

            if (bIn != null) {
                pickerBOut.setMinDate(new Date(bIn + 1));
            }

            if (bOut != null) {
                pickerBIn.setMaxDate(new Date(bOut - 1));
            }
        }

        //-----------------------------------------------------------------------------------------
        //HANDLERS
        //-----------------------------------------------------------------------------------------

        function inputChangeHand() {
            setPikADayBounds();
        }


        initialize();
    }
}


$(document).ready(comparer.initialize)