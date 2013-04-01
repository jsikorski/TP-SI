var canvas = document.createElement('canvas');
canvas.width = 500;
canvas.height = 500;
var canvasContext = canvas.getContext('2d');


var coordinateSystem = new Models.CoordinateSystem(canvas.height / 2, 150, 20, 150);

var equationModel = new Models.EquationModel(
	'cos(x * z * z) * (cos(x*x+z*z) - sin(x) + cos(z) * sin(z)) + 5'
);
equationModel.compile();

var meshPreferences = new Models.MeshPreferences(0, 150, 20, 0, 150, 10);
var mesh = Models.Mesh.createFor(equationModel, coordinateSystem, meshPreferences);

var views = [
	new Views.View(coordinateSystem),
	new Views.View(mesh)
];

var renderer = new Views.Renderer(canvasContext, views);
renderer.render();

document.body.appendChild(canvas);