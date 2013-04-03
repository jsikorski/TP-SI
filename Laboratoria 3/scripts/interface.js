Interface = (function() {

	/**** Settings ****/
	var Settings = function() {};

	_.extend(Settings, {
		fromMap: function(map) {
			var settings = new Settings();

			for (var element in map) {
				settings[element] = map[element];
			};

			return settings;
		}
	})


	/**** Settings panel ****/
	var SettingsPanel = function(Y) {
		this.el = Y.Node.one('form');
	};

	_.extend(SettingsPanel.prototype, {
		onSubmit: function(action) {
			this.el.on('submit', action);
		},

		getEquation: function() {
			return this.el.one('#equation').get('value');
		},

		getSettings: function() {
			var map = {
				xMin: parseInt(this.el.one('#x-min').get('value')),
				xMax: parseInt(this.el.one('#x-max').get('value')),
				yMin: parseInt(this.el.one('#y-min').get('value')),
				yMax: parseInt(this.el.one('#y-max').get('value')),
				zMin: parseInt(this.el.one('#z-min').get('value')),
				zMax: parseInt(this.el.one('#z-max').get('value')),
				deltaX: parseInt(this.el.one('#delta-x').get('value')),
				deltaZ: parseInt(this.el.one('#delta-z').get('value'))
			};

			return Settings.fromMap(map);
		}
	});


	/**** Graph area ****/
	var GraphArea = function(Y) {
		this.el = Y.Node.one('svg');
	};

	_.extend(GraphArea.prototype, {
		getSvg: function() {
			return this.el.getDOMNode();
		},

		clear: function() {
			this.el.all('path').remove(true);
			this.el.all('text').remove(true);
		}
	});


	/**** UI context ****/
	var UIContext = function(settingsPanel, graphArea) {
		this.settingsPanel = settingsPanel;
		this.graphArea = graphArea;
	};

	_.extend(UIContext.prototype, {
		onSubmit: function(action) {
			this.settingsPanel.onSubmit(action);
		},

		getEquation: function() {
			return this.settingsPanel.getEquation();
		},

		getSettings: function() {
			return this.settingsPanel.getSettings();
		},

		getSvg: function() {
			return this.graphArea.getSvg();
		},

		clearGraph: function() {
			this.graphArea.clear();
		}
	});


	/**** Exports ****/
	var init = function(onReady) {

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
		init: init
	};

})();