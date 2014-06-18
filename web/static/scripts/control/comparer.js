comparer = {
    initialize: function() {
        comparer.dateRanges();
    },

    dateRanges: function() {
        function initialize() {
            addPikADays();
            addListeners();
        }

        function addPikADays() {
            $('.datepicker').pikaday();
        }

        function addListeners() {

        }

        initialize();
    }
}


$(document).ready(comparer.initialize)