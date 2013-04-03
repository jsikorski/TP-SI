var init = function(ui) {
	var canvasContext = ui.getSvg();

	ui.onSubmit(function(event) {
		event.preventDefault();

		// var canvas = canvasContext.canvas;
		var coordinateSystem = new Models.CoordinateSystem(500 / 2, 150, 20, 150);

		var equationModel = new Models.EquationModel(ui.getEquation());
		
		if (!equationModel.validate()) {
			alert("Równanie nie jest prawidłowe.");
			return;
		}

		equationModel.compile();

		var meshPreferences = new Models.MeshPreferences(0, 150, 20, 0, 150, 15);
		var mesh = Models.Mesh.createFor(equationModel, coordinateSystem, meshPreferences);

		var views = [
			new Views.View(coordinateSystem),
			new Views.View(mesh)	
		];

		var renderer = new Views.Renderer(canvasContext, views);
		renderer.render();
	});
};

var ui = Interface.init(init);