var coordinateSystem = new Models.CoordinateSystem();

var equationModel = new Models.EquationModel('cos(x * z * z) * 5 * (cos(x*x+z*z) - sin(x) + cos(z) * sin(z)) + 100');
equationModel.compile();
var mesh = Models.Mesh.createFor(equationModel, 0, 250, 0, 250, 10);

var views = [
	new Views.CoordinateSystem(coordinateSystem),
	new Views.View(mesh)
];


var canvas = document.createElement('canvas');
canvas.width = 500;
canvas.height = 500;
var canvasContext = canvas.getContext('2d');

var renderer = new Views.Renderer(canvasContext, views);
renderer.render();

document.body.appendChild(canvas);