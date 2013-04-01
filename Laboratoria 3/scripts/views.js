Views = (function() {

	/**** Constants ****/
	var black = '#000000';
	var alpha = -0.610865238;
	var beta = Math.PI / 2 + Math.PI / 4;


	/**** View ****/
	var View = function(model) {
		this.model = model;
	};

	_.extend(View.prototype, {
		render: function(canvasContext) {
			var lines = this.model.getLines();

			for (var i = 0; i < lines.length; i++) {
				this.drawLine(canvasContext, lines[i]);			
			};
		},

		drawLine: function(canvasContext, line) {
			canvasContext.beginPath();

			var canvasWidth = canvasContext.canvas.width;
			var canvasHeight = canvasContext.canvas.height;

			if (line.from.hasLabels())
				this.drawLabels(canvasContext, line.from.labels);

			if (line.to.hasLabels())
				this.drawLabels(canvasContext, line.to.labels);

			var from = line.from
				.to2D(alpha, beta)
				.normalize(canvasWidth, canvasHeight);
			
			var to = line.to
				.to2D(alpha, beta)
				.normalize(canvasWidth, canvasHeight);

			canvasContext.moveTo(from.x, from.y);
			canvasContext.lineTo(to.x, to.y);
			canvasContext.strokeStyle = line.color || black;
			canvasContext.stroke();
		},

		drawLabels: function(canvasContext, labels) {
			for (var i = 0; i < labels.length; i++) {
				var label = labels[i];
				var labelView = new Label(label);
				labelView.render(canvasContext);
			};
		}
	});


	/**** Coordinate system ****/
	var CoordinateSystem = function(model) {
		View.prototype.constructor.apply(this, arguments);
	};

	_.extend(CoordinateSystem.prototype, View.prototype, {
		render: function(canvasContext) {
			var lines = this.model.getLines();

			for (var i = 0; i < lines.length; i++) {
				var xFactor = canvasContext.canvas.width / 2;
				var yFactor = canvasContext.canvas.height / 2;
				var zFactor = canvasContext.canvas.width / 2;

				var line = lines[i].scaleEnd(xFactor, yFactor, zFactor);
				this.drawLine(canvasContext, line);
			};
		}
	});


	/**** Label ****/
	var Label = function(model) {
		View.prototype.constructor.apply(this, arguments);
	};

	_.extend(Label.prototype, View.prototype, {
		render: function(canvasContext) {
			canvasContext.fillStyle = black;
			canvasContext.font = "bold 16px Arial";

			var canvasWidth = canvasContext.canvas.width;
			var canvasHeight = canvasContext.canvas.height;

			var position = this.model.position
				.to2D(alpha, beta)
				.normalize(canvasWidth, canvasHeight);

			canvasContext.fillText(this.model.text, position.x, position.y);
		}
	});


	/**** Renderer ****/
	var Renderer = function(canvasContext, views) {
		this.canvasContext = canvasContext;
		this.views = views;
	};

	_.extend(Renderer.prototype, {
		render: function() {
			for (var i = 0; i < this.views.length; i++) {
				this.views[i].render(this.canvasContext);
			};
		}
	});


	/**** Exports ****/
	return {
		View: View,
		CoordinateSystem: CoordinateSystem,
		Renderer: Renderer
	};
})();