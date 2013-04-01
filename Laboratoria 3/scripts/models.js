Models = (function() {

	/**** Label ****/
	var Label = function(text, position) {
		this.text = text;
		this.position = position;
	}


	/**** Point 2D ****/
	var Point2D = function(x, y) {
		this.x = x;
		this.y = y;
	}

	_.extend(Point2D, {
		fromArray: function(array) {
			return new Point2D(array[0], array[1]);
		}
	});

	_.extend(Point2D.prototype, {
		normalize: function(width, height) {
			return new Point2D(this.x + width / 2, -this.y + height / 2);
		}
	});


	/**** Point 3D ****/
	var Point3D = function(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	};

	_.extend(Point3D.prototype, {
		multiplyByScalars: function(xFactor, yFactor, zFactor) {
			var newX = this.x * xFactor;
			var newY = this.y * yFactor;
			var newZ = this.z * zFactor;

			var newPoint = new Point3D(newX, newY, newZ);

			if (!this.hasLabels())
				return newPoint;

			for (var i = 0; i < this.labels.length; i++) {
				var label = this.labels[i];
				var labelPosition = label.position;

				var offsetX = labelPosition.x - this.x;
				var offsetY = labelPosition.y - this.y;
				var offsetZ = labelPosition.z - this.z;

				newPoint.attachLabel(
					label.text,
					offsetX, 
					offsetY,
					offsetZ
				);
			};

			return newPoint;
		},

		to2D: function(alpha, beta) {
			var rotateA = Matrix.RotationX(alpha)
			var rotateB = Matrix.RotationY(beta)
			var world = rotateA.x(rotateB);

			var vector = $V(this.toArray());
			var isometric = world.x(vector);

			return Point2D.fromArray(isometric.elements);
		},

		toArray: function() {
			return [this.x, this.y, this.z];
		},

		attachLabel: function(text, offsetX, offsetY, offsetZ) {
			var labels = this.labels = this.labels || [];
			var position = new Point3D(
				this.x + offsetX, 
				this.y + offsetY, 
				this.z + offsetZ
			);

			labels.push(new Label(text, position));
		},

		hasLabels: function() {
			return this.labels != undefined && this.labels != null && this.labels.length > 0;
		}
	});


	/**** Line ****/
	var Line = function(from, to, color) {
		this.from = from;
		this.to = to;
		this.color = color;
	};

	_.extend(Line.prototype, {
		scaleEnd: function(xFactor, yFactor, zFactor) {
			var to = this.to.multiplyByScalars(xFactor, yFactor, zFactor);
			return new Line(this.from, to, this.color);
		}
	});


	/**** Lined model ****/
	var LinedModel = function() {
		this.lines = [];
	};

	_.extend(LinedModel.prototype, {
		getLines: function() {
			return this.lines;
		}
	});


	/**** Coordinate system ****/
	var CoordinateSystem = function() {
		var origin = new Point3D(0, 0, 0);
		var x = new Point3D(1, 0, 0);
		var y = new Point3D(0, 1, 0);
		var z = new Point3D(0, 0, 1);

		x.attachLabel('x', -10, 20, 0);
		y.attachLabel('y', 0, -10, 10);
		z.attachLabel('z', 0, 20, -10);

		this.lines = [
			new Line(origin, x, '#ff0000'),
			new Line(origin, y, '#00ff00'),
			new Line(origin, z, '#0000ff')
		]
	};

	_.extend(CoordinateSystem.prototype, LinedModel.prototype);


	/**** Mesh ****/
	var Mesh = function() {
		LinedModel.constructor.apply(this, arguments);
	};

	_.extend(Mesh, {
		createFor: function(equationModel, xMin, xMax, zMin, zMax, delta) {
			if (!equationModel.validate())
				throw 'Equation model is invalid';

			var lines = [];
			for (var x = xMin; x < xMax; x+=delta) {
				for (var z = zMin; z < zMax; z+=delta) {
					var nextX = x + delta;
					var nextZ = z + delta;

					var y = equationModel.getValue(x, z);
					
					// Ommit points with undefined values.
					if (!y)
						continue;

					if (nextX < xMax) {
						var yNextX = equationModel.getValue(nextX, z);
						
						var from = new Point3D(x, y, z);
						var to = new Point3D(nextX, yNextX, z);

						lines.push(new Line(from, to));
					}

					if (nextZ < zMax) {
						var yNextZ = equationModel.getValue(x, nextZ);
						
						var from = new Point3D(x, y, z);
						var to = new Point3D(x, yNextZ, nextZ);
						
						lines.push(new Line(from, to));
					}
				};
			};

			var mesh = new Mesh();
			mesh.lines = lines;
			return mesh;
		}
	});

	_.extend(Mesh.prototype, LinedModel.prototype);


	/**** Equation model ****/
	var EquationModel = function(equation) {
		this.equation = equation;
	}

	_.extend(EquationModel.prototype, {
		validate: function() {
			var sqrt = Math.sqrt;
			var sin = Math.sin;
			var cos = Math.cos;

			try {
				var x = 0;
				var z = 0;
				eval(this.equation);
			}
			catch (error) {
				return false;
			}

			return true;
		},

		compile: function() {
			if (!this.validate())
				throw "Cannot compile equation.";

			eval('this.compiledEquation = function(x, z) {' + 
					'var sqrt = Math.sqrt;' +
				   	'var sin = Math.sin;' + 
				   	'var cos = Math.cos;' +
					'return ' + this.equation + 
				';}');
		},

		getValue: function(x, z) {
			if (!this.compiledEquation)
				this.compile();

			return this.compiledEquation(x, z);
		}
	});


	/**** Exports ****/
	return {
		CoordinateSystem: CoordinateSystem,
		EquationModel: EquationModel,
		Mesh: Mesh
	};
})();