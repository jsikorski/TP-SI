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

  ResultsPresenter.prototype.addResult = function(result) {
    var row = document.createElement("tr");
    var label = document.createElement("td");
    var value = document.createElement("td");
    var resultText = document.createTextNode(result);
    
    value.appendChild(resultText);
    
    row.appendChild(label);
    row.appendChild(value);
    
    this.resultsContainer.appendChild(row);
  };
  
  return ResultsPresenter;
})();


var Calculator = (function() {    

  function Calculator() { }
  
  Calculator.prototype.addPowerResult = function(baseModel, exponentModel, resultsContainer) {
    
    if (!baseModel.validate()) {
      alert("Invalid base value.");
      return;
    }
    
    if (!exponentModel.validate()) {
      alert("Invalid exponent value.")
      return;
    }
    
    var result = Math.pow(baseModel.getValue(), exponentModel.getValue())
    var resultsPresenter = new ResultsPresenter(resultsContainer);
    resultsPresenter.addResult(result);
  };
  
  return Calculator;
})();


document.getElementById("power").addEventListener("mouseup", function() {
  var baseStr = document.getElementById("base").value;
  var exponentStr = document.getElementById("exponent").value;

  var baseModel = new BaseModel(baseStr);
  var exponentModel = new ExponentModel(exponentStr);
  
  var resultsContainer = document.getElementById("results");
  var calculator = new Calculator();
  calculator.addPowerResult(baseModel, exponentModel, resultsContainer);
}, 
false);