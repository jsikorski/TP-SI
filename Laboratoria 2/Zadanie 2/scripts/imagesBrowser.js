var ImagesBrowser = function() {

	function ImagesBrowser(el) {
		this.el = el;
	};

	ImagesBrowser.prototype.init = function() {
		var selectedImage = this.el.getElementsByClassName('selected-image')[0];
		var roll = this.el.getElementsByClassName('images-roll')[0];
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

			var bindEvent = tile.addEventListener || tile.attachEvent;
			bindEvent.call(tile, 'click', select, false);
			bindEvent.call(tile, 'mouseover', highlight, false);
			bindEvent.call(tile, 'mouseout', removeHighlight, false);
		}
	};

	return ImagesBrowser;
}();

var imagesBrowser = new ImagesBrowser(document.getElementsByClassName('images-browser')[0]);
imagesBrowser.init();