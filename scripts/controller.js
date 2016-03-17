(function () {
	"use strict";
		
	function SapperController(){
		this.FIELD_SIZE = 10;
		this.MINES_COUNT = 10;
		this.flagsCount = 10
		this.gameField = [];
		this.generateRandomField();
	}

	SapperController.prototype._reset = function(){
		this.flagsCount = 10
	}

	SapperController.prototype.generateRandomField = function() {
		this.gameField =calculateField(generateRandomMinesPlace(this.FIELD_SIZE));
		this._reset();
	};

	SapperController.prototype.checkCell = function(rowIndex, cellIndex) {		
		return this.gameField[rowIndex][cellIndex];
	};

	SapperController.prototype.getNearEmptyCells = function(rowIndex, cellIndex){
		var results = [];
		
		//recursivePass(this.gameField, rowIndex, cellIndex);

		function recursivePass(gameField, rowIndex, cellIndex){
			if(gameField[rowIndex][cellIndex]===0){
				results.push([rowIndex, cellIndex]);
				if(rowIndex-1>=0){
					recursivePass(gameField, rowIndex-1, cellIndex);
				}
				if(rowIndex+1<gameField.length){
					recursivePass(gameField, rowIndex+1, cellIndex);
				}
			}
		}
		console.log(results);
		return results;
	}



	var generateRandomMinesPlace = function(size){
		return [
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 9, 0, 9, 0],
					[0, 0, 9, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 9, 0, 9, 0, 0, 0],
					[0, 0, 9, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 9, 0, 0, 9, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 9, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 9, 0, 0]
				];
	}

	var calculateField = function(field){
		for (var rowIndex = 0; rowIndex < field.length; rowIndex++) {
			for (var cellIndex = 0; cellIndex < field.length; cellIndex++) {
				if(field[rowIndex][cellIndex]===0){
					field[rowIndex][cellIndex] = checkCellArea(field, rowIndex, cellIndex);
				}
			};
		};
		return field;
	}

	var checkCellArea = function(field, rowIndex, cellIndex){
		var mineСountInArea = 0;
		var areaStartRowIndex = rowIndex>0 ? rowIndex-1 : 0;
		var areaStartCellIndex = cellIndex>0 ? cellIndex-1 : 0;
		var areaEndRowIndex = rowIndex===field.length-1 ? field.length-1 : rowIndex+1;
		var areaEndCellIndex = cellIndex===field.length-1 ? field.length-1 : cellIndex+1;

		for(var areaRowIndex = areaStartRowIndex; areaRowIndex <= areaEndRowIndex; areaRowIndex++){
			for (var areaCellIndex = areaStartCellIndex; areaCellIndex <= areaEndCellIndex; areaCellIndex++) {
				if(field[areaRowIndex][areaCellIndex]===9){
					mineСountInArea++;
				}
			};
		}

		return mineСountInArea;
	}

	window.SapperController = SapperController;
})();