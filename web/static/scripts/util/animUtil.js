//-------------------------------------------------------------------------------------------------
//ANIMATION UTILITY
//for all base animation re-usable functionality | Troy Blank 2014

//you have to safeguard these funcation as they will still give values after current time is > duration
//t = current time, b = startPosition, c = totalChangeInPosition, d = duration of animation
//
// use this for preview > http://easings.net/
//-------------------------------------------------------------------------------------------------

var AnimUtil = {
	easeInQuad: function(t, b, c, d) {
		t /= d;
		return c * t * t + b;
	},

	easeOutQuad: function(t, b, c, d) {
		t /= d;
		return -c * t * (t - 2) + b;
	},

	easeInOutQuad: function(t, b, c, d) {
		t /= d / 2;
		if (t < 1) return c / 2 * t * t + b;
		t--;
		return -c / 2 * (t * (t - 2) - 1) + b;
	},

	easeOutElastic: function(t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	}
}

window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
	};
})();