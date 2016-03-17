(function(){
	"use strict";

	function SupperView(rootNode){
		this._sapperController = new window.SapperController();
		this._fieldSize = this._sapperController.gameField.length;
		this._gameFieldElement = rootNode.querySelector("#game-field");
		this._flagsCountElement = rootNode.querySelector("#flag-count");
		this._timerElement = rootNode.querySelector("#game-timer");
		this._restsrtBtnElement =rootNode.querySelector("#game-restart-btn");
		this._gameIsStoped = false;
		this._isFirstClick = true;

		this._cellElemetsRefs = [];
		
		this._generateGameFieldCells();
		this._initEventHandlers();

	}
	SupperView.prototype.restart = function(){
		this._stopTimer();
		this._timerElement.innerText = "0:00";
		this._gameIsStoped = false;
		this._isFirstClick = true;
		this._sapperController.generateRandomField();
		this._gameFieldElement.innerHTML = "";
		this._generateGameFieldCells(); 
	}

	SupperView.prototype._isWine = function(){
		var mathcedMines = 0;
		for(var rowIndex = 0; rowIndex < this._fieldSize; rowIndex++){
			for (var cellIndex = 0; cellIndex < this._fieldSize; cellIndex++) {
				if(this._isMarkedMinedCell(rowIndex, cellIndex)){
					mathcedMines++
				}
			}
		}
		return 	mathcedMines === this._sapperController.MINES_COUNT;
	}

	SupperView.prototype._isMarkedMinedCell =function(rowIndex, cellIndex){
		return this._cellElemetsRefs[rowIndex][cellIndex].classList.contains("marked") &&
					this._sapperController.checkCell(rowIndex, cellIndex)===9;
	}

	SupperView.prototype._generateGameFieldCells = function(){
		for(var rowIndex = 0; rowIndex < this._fieldSize; rowIndex++){			
			var fieldRow = createRowDomElement();
			this._cellElemetsRefs[rowIndex] = [];
			for (var cellIndex = 0; cellIndex < this._fieldSize; cellIndex++) {
				var cell = createCellDomElement(rowIndex, cellIndex);
				fieldRow.appendChild(cell);
				this._cellElemetsRefs[rowIndex].push(cell);
			}

			this._gameFieldElement.appendChild(fieldRow);
		}		
	}

	SupperView.prototype._startTimer = function(){
		this._timerID = setInterval(this._incrisTime.bind(this), 1000);
	}

	SupperView.prototype._stopTimer = function(){
		clearInterval(this._timerID )
	}

	SupperView.prototype._incrisTime = function(){
		var time = this._timerElement.innerHTML.split(':');
		var min = time[0];
		var sec = time[1];
		sec++
		if(sec===60){
			sec="00";
			min++;
		}
		this._timerElement.innerHTML = min+":"+(sec<10?"0"+sec:sec);
	}

	SupperView.prototype._initEventHandlers = function(){
		this._restsrtBtnElement.addEventListener("click", this._restartHendler.bind(this), false);		
		this._gameFieldElement.addEventListener("mousedown", this._highlightCell.bind(this), false);
		this._gameFieldElement.addEventListener("mouseup", this._removeHighlightCell, false);
		this._gameFieldElement.addEventListener("click", this._mousClickHendler.bind(this), false);
		this._gameFieldElement.addEventListener("contextmenu", this._mousClickHendler.bind(this), false);
	}	

	//Event hendlers start
	SupperView.prototype._highlightCell = function(e){
		if(!this._gameIsStoped){
			e.target.classList.add("highlight");
		}		
	}

	SupperView.prototype._removeHighlightCell = function(e){
		e.target.classList.remove("highlight");
	}

	SupperView.prototype._restartHendler = function(){
		this.restart();
	}

	SupperView.prototype._mousClickHendler = function (e){
		e.preventDefault();
		
		if(this._gameIsStoped || e.target.classList.contains("checked")){
			return;
		}

		if(this._isFirstClick){
			this._isFirstClick = false;
			this._startTimer();
		}

		if(e.button===0 && !e.target.classList.contains("marked")){
			this._leftMousClickHendler(e.target);
		}
		if(e.button===2){
			this._rightMousClickHendler(e.target);
		}
	}

	SupperView.prototype._leftMousClickHendler = function(cell){		
		var rowIndex = parseInt(cell.dataset.rowIndex);
		var cellIndex = parseInt(cell.dataset.cellIndex);
		var checkResult = this._sapperController.checkCell(rowIndex, cellIndex);

		switch(checkResult){
			case 0:
				this._openArea(rowIndex, cellIndex);
				break;
			case 9://Game over.
				cell.classList.add("mined");
				this._gameIsStoped = true;
				this._setCellCheked(cell);
				this._stopTimer();
				break;
			default:
				cell.innerText = checkResult;
				this._setCellCheked(cell);
				break;
		}
	}

	SupperView.prototype._setCellCheked = function(cell){
		cell.classList.remove("unchecked");
		cell.classList.add("checked");
	}

	SupperView.prototype._rightMousClickHendler = function(cell){
		if(this._sapperController.flagsCount===0 && !cell.classList.contains("marked")){
			return;
		}

		if(cell.classList.contains("marked")){
			this._sapperController.flagsCount++;
		}else{
			this._sapperController.flagsCount--;
		}

		this._flagsCountElement.innerText = this._sapperController.flagsCount;
		cell.classList.toggle("marked");

		if(this._isWine()){
			this._restsrtBtnElement.innerText = "WIN";
			this._gameIsStoped = true;
		}
	}
	//Event hendlers end

	SupperView.prototype._openArea = function(rowIndex, cellIndex){
		var cell = this._cellElemetsRefs[rowIndex][cellIndex];
		var checkeResult = this._sapperController.checkCell(rowIndex, cellIndex);
	
		if(cell.classList.contains("checked") ){
			return;
		}

		this._setCellCheked(cell);
		
		if(checkeResult>0){
			cell.innerText = checkeResult;
			return;
		}

		if(rowIndex-1>=0){
			this._openArea(rowIndex-1,cellIndex);
		}

		if(rowIndex+1<this._fieldSize){
			this._openArea(rowIndex+1,cellIndex);
		}

		if(cellIndex-1>=0){
			this._openArea(rowIndex,cellIndex-1);
		}

		if(cellIndex+1<this._fieldSize){
			this._openArea(rowIndex,cellIndex+1);
		}
	}


	SupperView.prototype._getCellElement = function(rowIndex, cellIndex){
		return this._cellElemetsRefs[rowIndex][cellIndex]
	}

	var createRowDomElement = function(){
		var fieldRow = document.createElement("ul");
		fieldRow.setAttribute("class", "game-row");		
		return fieldRow
	}

	var createCellDomElement = function(rowIndex, cellIndex){
		var cell = document.createElement("li");
		cell.setAttribute("class", "game-cell unchecked");
		cell.dataset.rowIndex = rowIndex;
		cell.dataset.cellIndex = cellIndex;
		return cell
	}

	window.SupperView = SupperView;
})();