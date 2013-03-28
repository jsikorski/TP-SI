var BaseModel = (function() {
	
	function BaseModel(baseStr) {
		this.baseStr = baseStr
	}
	
	BaseModel.prototype.getValue = function () {
		return parseInt(this.baseStr);
	};
	
	BaseModel.prototype.validate = function () { 
		return /^\d+$/.test(this.baseStr);
	};
	
	return BaseModel;
})();


var ExponentModel = (function() {
	
	function ExponentModel(exponentStr) {
		this.exponentStr = exponentStr;
	}
	
	ExponentModel.prototype.getValue = function() {
		return parseInt(this.exponentStr);
	};
	
	ExponentModel.prototype.validate = function () {
		return /^\d+$/.test(this.exponentStr);
	};
	
	return ExponentModel;
})();


var ResultsPresenter = (function() {
	
	function ResultsPresenter(resultsContainer) { 
		this.resultsContainer = resultsContainer;
	}

	ResultsPresenter.prototype.addRow = function(base, exponent, result) {
		var row = document.createElement("tr");
		var operation = document.createElement("td");
		var value = document.createElement("td");
		
		var operationText = document.createTextNode(base + ' ^ ' + exponent + ' = ')
		var resultText = document.createTextNode(result);
		
		operation.appendChild(operationText);
		value.appendChild(resultText);
		
		row.appendChild(operation);
		row.appendChild(value);
		
		this.resultsContainer.appendChild(row);
	};
	
	return ResultsPresenter;
})();


var Calculator = (function() {    

	function Calculator(resultsContainer) { 
		this.resultsContainer = resultsContainer;
	}
	
	Calculator.prototype.addPowerResult = function(baseModel, exponentModel) {
		
		if (!baseModel.validate()) {
			alert('Nieprawidłowa wartość podstawy.');
			return;
		}
		
		if (!exponentModel.validate()) {
			alert('Nieprawidłowa wartość wykładnika.')
			return;
		}
		
		base = baseModel.getValue()
		exponent = exponentModel.getValue()

		var result = Math.pow(base, exponent)
		var resultsPresenter = new ResultsPresenter(this.resultsContainer);
		resultsPresenter.addRow(base, exponent, result);
	};
	
	return Calculator;
})();


var computePower = function() {  
	var baseStr = document.getElementById("base").value;
	var exponentStr = document.getElementById("exponent").value;

	var baseModel = new BaseModel(baseStr);
	var exponentModel = new ExponentModel(exponentStr);
	
	var resultsContainer = document.getElementById("results");
	var calculator = new Calculator(resultsContainer);
	calculator.addPowerResult(baseModel, exponentModel);
};

var computeOnEnter = function(event) {
	if (event.keyCode == 13)
		computePower();
};


var form = document.getElementsByTagName('form')[0];
var bindEvent = form.addEventListener || form.attachEvent;
bindEvent.call(form, 'keyup', computeOnEnter, false);

var power = document.getElementById("power");
bindEvent = power.addEventListener || power.attachEvent;
bindEvent.call(power, 'mouseup', computePower, false);