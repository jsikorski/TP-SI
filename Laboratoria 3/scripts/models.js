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


	/**** Lined model ****/
	var LineBasedModel = function() {
		this.lines = [];
	};

	_.extend(LineBasedModel.prototype, {
		getLines: function() {
			return this.lines;
		}
	});


	/**** Coordinate system ****/
	var CoordinateSystem = function(size, xMax, yMax, zMax) {
		this.size = size;
		this.xMax = xMax;
		this.yMax = yMax;
		this.zMax = zMax;

		var origin = new Point3D(0, 0, 0);
		var x = new Point3D(size, 0, 0);
		var y = new Point3D(0, size, 0);
		var z = new Point3D(0, 0, size);

		x.attachLabel('x = ' + xMax, 10, 40, 0);
		y.attachLabel('y = ' + yMax, 0, -10, 10);
		z.attachLabel('z = ' + zMax, 0, 20, -10);

		this.lines = [
			new Line(origin, x, '#ff0000'),
			new Line(origin, y, '#00ff00'),
			new Line(origin, z, '#0000ff')
		]
	};

	_.extend(CoordinateSystem.prototype, LineBasedModel.prototype);


	/**** UserPreferences ****/
	var MeshPreferences = function(xMin, xMax, yMin, yMax, zMin, zMax, deltaX, deltaZ) {
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;
		this.zMin = zMin;
		this.zMax = zMax;
		this.deltaX = deltaX;
		this.deltaZ = deltaZ;
	};


	/**** Mesh ****/
	var Mesh = function() {
		LineBasedModel.constructor.apply(this, arguments);
	};

	_.extend(Mesh, {
		createFor: function(equationModel, coordinateSystem, meshPreferences) {
			if (!equationModel.validate())
				throw 'Equation model is invalid';

			var xMin = meshPreferences.xMin
			var xMax = meshPreferences.xMax
			var zMin = meshPreferences.zMin;
			var zMax = meshPreferences.zMax;
			var yMin = meshPreferences.yMin;
			var yMax = meshPreferences.yMax;
			var deltaX = meshPreferences.deltaX;
			var deltaZ = meshPreferences.deltaZ;

			var xForScale = xMax > 0 ? xMax : Math.abs(xMin);
			var yForScale = yMax > 0 ? yMax : Math.abs(yMin);
			var zForScale = zMax > 0 ? zMax : Math.abs(zMin);

			var scaleX = coordinateSystem.size / xForScale;
			var scaleY = coordinateSystem.size / yForScale;
			var scaleZ = coordinateSystem.size / zForScale;

			var lines = [];
			for (var x = xMin; x <= xMax; x += deltaX) {
				for (var z = zMin; z <= zMax; z += deltaZ) {
					var nextX = x + deltaX;
					var nextZ = z + deltaZ;

					var y = equationModel.getValue(x, z);
					
					// Ommit points with undefined values.
					if (y === undefined)
						continue;

					// Ommit points with value out of range.
					if (y > yMax || y < yMin)
						continue;

					if (nextX <= xMax) {
						var yNextX = equationModel.getValue(nextX, z);
						
						if (yNextX > yMax || yNextX < yMin)
							continue;

						var from = new Point3D(
							scaleX * x, 
							scaleY * y, 
							scaleZ * z
						);

						var to = new Point3D(
							scaleX * nextX, 
							scaleY * yNextX, 
							scaleZ * z
						);

						lines.push(new Line(from, to));
					}

					if (nextZ <= zMax) {
						var yNextZ = equationModel.getValue(x, nextZ);
						
						if (yNextZ > yMax || yNextZ < yMin)
							continue;

						var from = new Point3D(
							scaleX * x, 
							scaleY * y, 
							scaleZ * z
						);

						var to = new Point3D(
							scaleX * x, 
							scaleY * yNextZ, 
							scaleZ * nextZ
						);
						
						lines.push(new Line(from, to));
					}
				};
			};

			var mesh = new Mesh();
			mesh.lines = lines;
			return mesh;
		}
	});

	_.extend(Mesh.prototype, LineBasedModel.prototype);


	/**** Equation model ****/
	var EquationModel = function(equation) {
		this.equation = equation;
	}

	_.extend(EquationModel.prototype, {
		validate: function() {
			try {
				var x = 0;
				var z = 0;
				eval(this.enchant(this.equation));
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
					'return ' + this.enchant(this.equation) + 
				';}');
		},

		enchant: function(equation) {
			var equationCopy = equation;
			
			var maths = Object.getOwnPropertyNames(Math);
			for (var i = 0; i < maths.length; i++) {
				var math = maths[i];
				equationCopy = equationCopy.replace(new RegExp(math, 'g'), 'Math.' + math);
			};

			return equationCopy;
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
		MeshPreferences: MeshPreferences,
		Mesh: Mesh
	};
})();