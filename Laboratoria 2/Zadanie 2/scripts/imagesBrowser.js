var ImagesBrowser = function() {};

ImagesBrowser.prototype.init = function() {
	var browser = document.getElementsByClassName('images-browser')[0];
	var selectedImage = browser.getElementsByClassName('selected-image')[0];
	var roll = browser.getElementsByClassName('images-roll')[0];
	var tiles = roll.getElementsByTagName('img');

	for (var i = 0; i < tiles.length; i++) {
		var tile = tiles[i];
		var originalOpacity = tile.style.opacity;
		
		var select = function() { 
			var src = this.getAttribute('src')
			selectedImage.setAttribute('src', src); 
		};

		var highlight = function() {
			this.style.opacity = 1.0;
		};

		var removeHighlight = function() {
			this.style.opacity = originalOpacity;
		};

		var on = tile.addEventListener || tile.attachEvent;
		on.call(tile, 'click', select, false);
		on.call(tile, 'mouseover', highlight, false);
		on.call(tile, 'mouseout', removeHighlight, false);
	}
};

var imagesBrowser = new ImagesBrowser();
imagesBrowser.init();