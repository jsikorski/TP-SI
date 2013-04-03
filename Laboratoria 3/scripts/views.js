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
		render: function(svg) {
			var lines = this.model.getLines();

			for (var i = 0; i < lines.length; i++) {
				var path = document.createElementNS(svg.getAttribute('xmlns'), 'path');
				this.drawLine(path, lines[i], svg);
				svg.appendChild(path);
			};
		},

		drawLine: function(path, line, svg) {
			if (line.from.hasLabels())
				this.drawLabels(svg, line.from.labels);

			if (line.to.hasLabels())
				this.drawLabels(svg, line.to.labels);

			var svgWidth = svg.width.baseVal.value;
			var svgHeight = svg.height.baseVal.value;

			var from = line.from
				.to2D(alpha, beta)
				.normalize(svgWidth, svgHeight);
			
			var to = line.to
				.to2D(alpha, beta)
				.normalize(svgWidth, svgHeight);

			var from = path.createSVGPathSegMovetoAbs(from.x, from.y);
			var to = path.createSVGPathSegLinetoAbs(to.x, to.y);

			path.style.stroke = line.color || black;
			path.style.fill = "none";
			path.style.strokeWidth = "1";

			path.pathSegList.appendItem(from)
			path.pathSegList.appendItem(to)
		},

		drawLabels: function(svg, labels) {
			for (var i = 0; i < labels.length; i++) {
				var label = labels[i];
				var labelView = new Label(label);
				labelView.render(svg);
			};
		}
	});


	/**** Label ****/
	var Label = function(model) {
		View.prototype.constructor.apply(this, arguments);
	};

	_.extend(Label.prototype, View.prototype, {
		render: function(svg) {
			var text = document.createElementNS(svg.getAttribute('xmlns'), 'text');

			var labelText = document.createTextNode(this.model.text);
			text.appendChild(labelText);

			var svgWidth = svg.width.baseVal.value;
			var svgHeight = svg.height.baseVal.value;

			var position = this.model.position
				.to2D(alpha, beta)
				.normalize(svgWidth, svgHeight);

			text.setAttribute('x', position.x);
			text.setAttribute('y', position.y);

			svg.appendChild(text);
		}
	});


	/**** Renderer ****/
	var Renderer = function(svg, views) {
		this.svg = svg;
		this.views = views;
	};

	_.extend(Renderer.prototype, {
		render: function() {
			for (var i = 0; i < this.views.length; i++) {
				this.views[i].render(this.svg);
			};
		}
	});


	/**** Exports ****/
	return {
		View: View,
		Renderer: Renderer
	};
})();