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

		var settings = ui.getSettings();
		if (!settings.validate()) {
			alert("Wprowadzone ustawienia nie są prawidłowe.");
			return;
		}
		
		var coordinateSystem = new Models.CoordinateSystem(
			svg.width.baseVal.value / 2, 
			settings.xMax > 0 ? settings.xMax : Math.abs(settings.xMin), 
			settings.yMax > 0 ? settings.yMax : Math.abs(settings.yMin), 
			settings.zMax > 0 ? settings.zMax : Math.abs(settings.zMin)
		);

		var meshPreferences = new Models.MeshPreferences(
			settings.xMin, 
			settings.xMax, 
			settings.yMin, 
			settings.yMax, 
			settings.zMin, 
			settings.zMax, 
			settings.deltaX, 
			settings.deltaZ
		);

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