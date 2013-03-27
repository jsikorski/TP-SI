var Block = (function() {

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
		this.speed = 50;
		this.el = el;
		this.vX = vX;
		this.vY = vY;
	}

	Block.prototype.start = function() {
		var that = this;

		that.interval = setInterval(function() {
			update.call(that);
		}, that.speed)
	};

	Block.prototype.stop = function() {
		clearInterval(this.interval);
	};

	Block.prototype.changeSpeed = function(delta) {
		this.speed += delta;
		this.stop();
		this.start();
	};

	return Block;
})();

var topLeft = new Block(document.getElementsByClassName('top-left')[0], 1, 1);
var topRight = new Block(document.getElementsByClassName('top-right')[0], -1, 1)
var bottomLeft = new Block(document.getElementsByClassName('bottom-left')[0], 1, -1)

var increaseSpeed = document.getElementById('increase-speed');
var decreaseSpeed = document.getElementById('decrease-speed');

var changeSpeed = function(delta) {
	topLeft.changeSpeed(delta);
	topRight.changeSpeed(delta);
	bottomLeft.changeSpeed(delta);
};

var bindEvent = increaseSpeed.addEventListener || increaseSpeed.attachEvent;
bindEvent.call(increaseSpeed, 'mouseup', function() { changeSpeed(-10); }, false);
bindEvent.call(decreaseSpeed, 'mouseup', function() { changeSpeed(10); }, false);

topLeft.start();
topRight.start();
bottomLeft.start();