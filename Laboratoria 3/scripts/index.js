var init = function(ui) {
	var svg = ui.getSvg();

	ui.onSubmit(function(event) {
		event.preventDefault();

		var equationModel = new Models.EquationModel(ui.getEquation());
		if (!equationModel.validate()) {
			alert("Równanie nie jest prawidłowe.");
			return;
		}
		equationModel.compile();

		var coordinateSystem = new Models.CoordinateSystem(500 / 2, 150, 20, 150);
		var meshPreferences = new Models.MeshPreferences(0, 150, 0, 20, 0, 150, 15, 15);
		var mesh = Models.Mesh.createFor(equationModel, coordinateSystem, meshPreferences);

		var views = [
			new Views.View(coordinateSystem),
			new Views.View(mesh)	
		];

		var renderer = new Views.Renderer(svg, views);
		ui.clearGraph();
		renderer.render();
	});
};

var ui = Interface.init(init);