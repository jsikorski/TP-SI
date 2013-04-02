Interface = (function() {

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
		}
	});


	/**** Graph area ****/
	var GraphArea = function(Y) {
		this.el = Y.Node.one('canvas');
		this.el.set('width', 500);
		this.el.set('height', 500);
	};

	_.extend(GraphArea.prototype, {
		getCanvas: function() {
			return this.el.getDOMNode();
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
			return this.settingsPanel.getEquation();
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