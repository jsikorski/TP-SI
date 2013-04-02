Interface = (function() {

	/**** Settings panel ****/
	var SettingsPanel = function(Y) {
		this.el = Y.Node.create('<form></form>');

		var equation = Y.Node.create('<input type="text"></input>')
		var submit = Y.Node.create('<button type="submit">Wyświetl</button>');
		
		this.equation = equation;

		this.el.append(equation);
		this.el.append(submit);
	};

	_.extend(SettingsPanel.prototype, {
		onSubmit: function(action) {
			this.el.on('submit', action);
		},

		getEquation: function() {
			return this.equation.get('value');
		}
	});


	/**** Graph area ****/
	var GraphArea = function(Y) {
		this.el = document.createElement('canvas');
		this.el.width = 500;
		this.el.height = 500;
	};

	_.extend(GraphArea.prototype, {
		getCanvas: function() {
			return this.el;
		}
	});


	/**** UI context ****/
	var UIContext = function(settingsPanel, graphArea) {
		this.settingsPanel = settingsPanel;
		this.graphArea = graphArea;
	};

	_.extend(UIContext.prototype, {
		getCanvasContext: function() {
			return this.graphArea
				.getCanvas()
				.getContext('2d');
		},

		onSubmit: function(action) {
			this.settingsPanel.onSubmit(action);
		},

		getEquation: function() {
			return this.settingsPanel.getEquation();//'cos(x * z * z) * (cos(x*x+z*z) - sin(x) + cos(z) * sin(z)) + 5';
		}
	});


	/**** Exports ****/
	var build = function(onReady) {

		YUI().use('node', function(Y) {
			var body = Y.one('body');

			var settingsPanel = new SettingsPanel(Y);
			body.append(settingsPanel.el);

			var graphArea = new GraphArea(Y);
			body.append(graphArea.el);

			onReady(new UIContext(settingsPanel, graphArea));
		});
	};

	return {
		build: build
	};

})();