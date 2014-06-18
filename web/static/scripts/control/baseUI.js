baseUI = {
    initialize: function() {
        baseUI.pageNav();
    },

    pageNav: function() {

        function initialize() {
            addListeners();
        }

        function addListeners() {
            $('#js-site-nav-btn').on('click', toggleList);
        }

        function toggleList() {
            var siteNav = document.getElementById('js-site-nav');
            siteNav.classList.toggle("open");
        }

        initialize();
    }
}

$(document).ready(baseUI.initialize)