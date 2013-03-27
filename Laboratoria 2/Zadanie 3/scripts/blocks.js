var Block = (function() {

	var speed = 4;

	var update = function() {
		offsetTop = this.el.offsetTop
		offsetLeft = this.el.offsetLeft
		offsetHeight = this.el.offsetHeight
		offsetWidth = this.el.offsetWidth

		if ((offsetTop <= 0 && this.vY < 0) || (offsetTop + offsetHeight >= window.innerHeight && this.vY > 0))
			this.vY = -this.vY;

		if ((offsetLeft <= 0 && this.vX < 0) || (offsetLeft + offsetWidth >= window.innerWidth && this.vX > 0))
		 	this.vX = -this.vX;

		this.el.style.top = offsetTop + this.vY;
		this.el.style.left = offsetLeft + this.vX;
	}

	function Block(el, vX, vY) {
		this.el = el;
		this.vX = vX;
		this.vY = vY;
	}

	Block.prototype.start = function() {
		var that = this;

		var stopHandler = that.el.addEventListener(
			'mouseup', function() { 
				this.removeEventListener('mouseup', stopHandler, false)
				that.stop.call(that); 
			}, false
		);

		that.interval = setInterval(function() {
			update.call(that);
		}, speed)
	};

	Block.prototype.stop = function() {
		clearInterval(this.interval);
	};

	Block.prototype.changeSpeed = function(delta) {
		speed += delta;
	};

	return Block;
})();

var topLeft = new Block(document.getElementsByClassName('top-left')[0], 1, 1);
topLeft.start();

var topRight = new Block(document.getElementsByClassName('top-right')[0], -1, 1)
topRight.start();

var bottomLeft = new Block(document.getElementsByClassName('bottom-left')[0], 1, -1)
bottomLeft.start();