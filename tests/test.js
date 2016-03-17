

var htmlStriong = "<div id='game-container'>"+
					"<div id='game-menu-wrp'>"+
					"<div class='border'>"+
						"<span id='flag-count'>10</span>"+
						"<div class='game-restart-btn-wrp'>"+
							"<span id='game-restart-btn'></span>"+
						"</div>"+
						"<span id='game-timer'>0:00</span>"+
					"</div>"+	
					"<div id='game-field'></div></div>"+
				"</div>"
describe("View tests", function() {
	
	
	describe("Criating game DOM elements", function(){
		var view = new window.SupperView($(htmlStriong)[0]);	
		var controller = new window.SapperController();
		var fieldSize = controller.gameField.length;

		it("Game field is created", function() {
			expect(view._gameFieldElement).to.not.be.a("null");
			expect(view._gameFieldElement).to.be.a("object");
			expect(view._gameFieldElement.tagName).to.eql("DIV");
			expect(view._gameFieldElement.getAttribute("id")).to.eql("game-field");
		});

		describe("All cells DOM elements is created", function(){
			var uls = view._gameFieldElement.getElementsByTagName("UL");
			var lisFirstRow = uls[0].getElementsByTagName("LI");
			var lisLastRow = uls[uls.length-1].getElementsByTagName("LI");

			it("Row DOM element heve all attrebuts", function(){
				expect(uls[0].classList.contains("game-row")).to.eql(true);
			});

			it("Rows in view equle rows in model", function(){
				expect(uls.length).to.eql(fieldSize);
			});

			it("Cells count in row equle cells count in row model", function(){
				expect(lisFirstRow.length).to.eql(fieldSize);
			});

			it("Cell DOM element heve all attrebuts", function(){
				expect(lisFirstRow[0].classList.contains("game-cell")).to.eql(true);
				expect(lisFirstRow[0].classList.contains("unchecked")).to.eql(true);
			});

			it("Cell DOM element heve indexes", function(){
				expect(parseInt(lisFirstRow[0].dataset.cellIndex)).to.eql(0);
				expect(parseInt(lisFirstRow[lisFirstRow.length-1].dataset.cellIndex)).to.eql(fieldSize-1);
				expect(parseInt(lisFirstRow[0].dataset.rowIndex)).to.eql(0);
				expect(parseInt(lisLastRow[0].dataset.rowIndex)).to.eql(fieldSize-1);
			});			
		});
	});
	describe("Mouse click", function(){
		var view = new window.SupperView($(htmlStriong)[0]);	
		var controller = new window.SapperController();
		var fieldSize = controller.gameField.length;
		describe("Left mouse click on cell", function(){
			var cellClicked = view._cellElemetsRefs[1][1];			
			view._leftMousClickHendler(cellClicked);
			
			it("Cell DOM element have  class 'checked'", function(){
				expect(cellClicked.classList.contains("checked")).to.be.true;
			});

			it("Cell DOM element dont have  class 'mined'", function(){				
				expect(cellClicked.classList.contains("mined")).to.be.false;
			});

			it("Cell DOM element have 1 cell mined near", function(){				
				expect(cellClicked.innerText).to.eql('1');
			});
			it("Cell DOM element have 3 cell mined near", function(){
				var cellClickedWihtThreeMineNear = view._cellElemetsRefs[3][3];
				view._leftMousClickHendler(cellClickedWihtThreeMineNear);				
				
				expect(cellClickedWihtThreeMineNear.innerText).to.eql('3');
			});
		});

		describe("Right mouse click", function(){
			var cellClicked = view._cellElemetsRefs[1][1];
			view._rightMousClickHendler(cellClicked);

			it("Cell DOM element have  class 'marked'", function(){
				expect(cellClicked.classList.contains("marked")).to.be.true;
			});

			var cellClickedTogled = view._cellElemetsRefs[2][2];
			view._rightMousClickHendler(cellClickedTogled);
			view._rightMousClickHendler(cellClickedTogled);

			it("Cell DOM element dont have  class 'marked'", function(){
				expect(cellClickedTogled.classList.contains("marked")).to.be.false;
			});

			var cellAfterLeftClick = view._cellElemetsRefs[1][2];
			view._leftMousClickHendler(cellAfterLeftClick);
			view._rightMousClickHendler(cellAfterLeftClick);

			it("Right click on 'checked' cell", function(){
				expect(cellClickedTogled.classList.contains("marked")).to.be.false;
			});
		});

		describe("Tests clicking on cells in corners", function(){
			it("Click in left top corner", function(){
				var cellClickInLeftTopCorner = view._cellElemetsRefs[0][0];
				view._leftMousClickHendler(cellClickInLeftTopCorner);

				expect(cellClickInLeftTopCorner.classList.contains("checked")).to.be.true;
			});

			it("Click in left bottom corner", function(){
				var cellClickInLeftBottomCorner = view._cellElemetsRefs[fieldSize-1][0];
				view._leftMousClickHendler(cellClickInLeftBottomCorner);

				expect(cellClickInLeftBottomCorner.classList.contains("checked")).to.be.true;
			});

			it("Click in right top corner", function(){
				var cellClickInRightTopCorner = view._cellElemetsRefs[0][fieldSize-1];
				view._leftMousClickHendler(cellClickInRightTopCorner);

				expect(cellClickInRightTopCorner.classList.contains("checked")).to.be.true;
			});

			it("Click in right bottom corner", function(){
				var cellClickInRightBottomCorner = view._cellElemetsRefs[fieldSize-1][fieldSize-1];
				view._leftMousClickHendler(cellClickInRightBottomCorner);

				expect(cellClickInRightBottomCorner.classList.contains("checked")).to.be.true;
			});
		});

		describe("Game over", function(){			
			var cellClicked = view._cellElemetsRefs[2][2];
			view._leftMousClickHendler(cellClicked);

			it("Cell DOM element have  class 'mined'", function(){
				expect(cellClicked.classList.contains("mined")).to.be.true;
			});

			it("Game is stoped", function(){
				expect(view._gameIsStoped).to.be.true;
			});

			it("Timer is stoped", function(){

				expect(!!view._timerID).to.be.false;
			});
		});		
	});

	describe("Reset game", function(){
		var view = new window.SupperView($(htmlStriong)[0]);
		view.restart();
		it("Timer is stoped", function(){
			expect(!!view._timerID).to.be.false;
		});
	});
	describe("Start game", function(){
		var view = new window.SupperView($(htmlStriong)[0]);
		var controller = new window.SapperController();
		var cellClicked = view._cellElemetsRefs[1][2];
		$(cellClicked).trigger('click');

		it("Timer is started", function(){
			expect(!!view._timerID).to.be.true;
		});
	});

	describe("Win game", function(){
		var view = new window.SupperView($(htmlStriong)[0]);
		var controller = new window.SapperController();
		var fieldSize = controller.gameField.length;
		var minedCells = []
		for(var rowIndex = 0; rowIndex < fieldSize; rowIndex++){
			for (var cellIndex = 0; cellIndex < fieldSize; cellIndex++) {
				if(controller.checkCell(rowIndex, cellIndex)===9){
					minedCells.push(view._cellElemetsRefs[rowIndex][cellIndex]);
					//$(view._cellElemetsRefs[rowIndex][cellIndex]).trigger('contextmenu');
					view._rightMousClickHendler(view._cellElemetsRefs[rowIndex][cellIndex]);
				}
			}
		}

		it("All mines is marked", function(){
			expect(view._isWine()).to.be.true;
		});
		it("Reset button have text 'WIN'", function(){
			expect(view._restsrtBtnElement.innerText).to.eql("WIN");
		});
	});
});

describe("Controller tests", function(){
	var controller = new window.SapperController();
	describe("Random feald ganarated", function(){
		
		var nextController = new window.SapperController();
		it("Cell 'generateRandomField()' method create game field and 'gameField' return not empty array", function(){
			//controller.generateRandomField();
			expect(controller.gameField).to.be.a("array");
			expect(controller.gameField.length).to.not.eql(0);
			//expect(controller.gameField).to.not.deep.eql(nextController.gameField);
		});
	});

	describe("Test checkCell()", function(){
		// var controller = new window.SapperController();

		it("Cell with mine", function(){
			expect(controller.checkCell(2,2)).to.eql(9);
		});

		it("Cell dont have near mines", function(){
			expect(controller.checkCell(6,1)).to.eql(0);
		});

		it("Cell have near 1 mine", function(){
			expect(controller.checkCell(3,3)).to.eql(3);
		});

		it("Cell have near 3 mines", function(){
			expect(controller.checkCell(1,1)).to.eql(1);
		});
	});

	describe("Test getNearEmptyCells()",function(){
		// var controller = new window.SapperController();

	})
});