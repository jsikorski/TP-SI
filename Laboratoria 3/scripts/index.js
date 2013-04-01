var canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 800;
var canvasContext = canvas.getContext('2d');


var coordinateSystem = new Models.CoordinateSystem(canvas.width / 2);

var equationModel = new Models.EquationModel(
	'cos(x * z * z) * 5 * (cos(x*x+z*z) - sin(x) + cos(z) * sin(z)) + 100'
);
equationModel.compile();

var mesh = Models.Mesh.createFor(equationModel, 0, 400, 0, 400, 30);

var views = [
	new Views.View(coordinateSystem),
	new Views.View(mesh)
];

var renderer = new Views.Renderer(canvasContext, views);
renderer.render();

document.body.appendChild(canvas);