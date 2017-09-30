Array.prototype.blankCell = function (o, p) {
    for (var i = 0; i < o; i++) {
        this[i] = new Array();
        for (var j = 0; j < p; j++) {
            this[i][j] = new Cell(i, j);
        }
    }
};

Array.prototype.inArray = function (val) {
    for (var i = 0; i < this.length; i++)
        if (typeof(this[i]) == "object") {
            return this[i].inArray(val);
        }
        else if (this[i] == val) {
            return true;
        }
    return false;
};

function Scene() {
    // MARK: game area size
    this.width = 15;
    this.height = 15;
    this.iMacrophagesCount = 3; // could be 1 to 5 macrophages
}

function Cell(y, x) {
    this.x = x;
    this.y = y;
    this.isMacrophage = false;
    this.isSelected = false;
    this.iNumberOfMacrophagesSurround = 0;
    this.isOpen = false;
    this.cell = null;
}


var BacSweeper = {
    scene: null,
    iMacrophagesCount: 0,
    iCellCountMacrophages: null,
    aSceneBoard: new Array(),
    blGameOver: false,
    blIsFirstClick: false,
    aFontcolor: new Array("blue", "green", "red", "darkblue", "darkred", "violet", "orange", "black"),
    aMacrophagesPositions: new Array(),

    init: function () {

        // MARK: initialisation of the whole game
        this.scene = new Scene();
        this.iMacrophagesCount = this.scene.iMacrophagesCount;
        this.iCellCountMacrophages = document.createElement('th');
        this.iCellCountMacrophages.appendChild(document.createTextNode("Scene - there are " + this.iMacrophagesCount + " Macrophages"));
        this.blGameOver = false;
        this.blIsFirstClick = false;
        this.aSceneBoard.blankCell(this.scene.height, this.scene.width);

        /*
        this.aMacrophagesPositions = this.placeMacrophages();
        this.setMacrophages();
        this.countSurroundingMacrophages();
        */

        document.getElementById("bacsweeperboard").replaceChild(this.buildMainTable(), document.getElementById("bacsweeperboard").firstChild);
    },

    setMacrophages: function () {
        for (var k = 0; k < this.aMacrophagesPositions.length; k++) {
            var i = Math.floor(this.aMacrophagesPositions[k] / this.scene.width);
            var j = this.aMacrophagesPositions[k] - i * this.scene.width;
            this.aSceneBoard[i][j].isMacrophage = true;
        }
    },

    setSelection: function (i, j) {
        if (!this.aSceneBoard[i][j].isOpen) {
            if (this.aSceneBoard[i][j].isSelected) {
                this.aSceneBoard[i][j].isSelected = false;
                this.iMacrophagesCount++;
                this.aSceneBoard[i][j].cell.className = "normal";
            }
            else if (!this.aSceneBoard[i][j].isSelected && this.iMacrophagesCount > 0) {
                this.aSceneBoard[i][j].isSelected = true;
                this.iMacrophagesCount--;
                this.aSceneBoard[i][j].cell.className = "select";
            }
            this.iCellCountMacrophages.firstChild.replaceData(0, this.iCellCountMacrophages.firstChild.nodeValue.length, "Scene - noch " + this.iMacrophagesCount + " Minen");
        }
    },

    isFinished: function () {
        for (var i = 0; i < this.scene.height; i++)
            for (var j = 0; j < this.scene.width; j++) {
                if (!this.aSceneBoard[i][j].isMacrophage && !this.aSceneBoard[i][j].isOpen) {
                    return false;
                }
            }
        return true;
    },

    /* showSolution: function () {
        this.blGameOver = true;
        for (var i = 0; i < this.scene.height; i++)
            for (var j = 0; j < this.scene.width; j++)
                if (!this.aSceneBoard[i][j].isMacrophage) {
                    this.aSceneBoard[i][j].cell.className = "open";
                    if (this.aSceneBoard[i][j].iNumberOfMacrophagesSurround != 0) {
                        this.aSceneBoard[i][j].cell.style.color = this.aFontcolor[this.aSceneBoard[i][j].iNumberOfMacrophagesSurround - 1];
                        this.aSceneBoard[i][j].cell.firstChild.replaceData(0, this.aSceneBoard[i][j].cell.firstChild.nodeValue.length, this.aSceneBoard[i][j].iNumberOfMacrophagesSurround);
                    }
                }
                else if (this.aSceneBoard[i][j].cell.className != "laststep")
                    this.aSceneBoard[i][j].cell.className = "mine";
    },*/

    showFinishedMessage: function (complete) {
        this.blGameOver = true;
        if (complete) {
            console.log("Gratulation, Du hast alle Minen entdeckt!");
        }
        else {
            console.log("Ooh, ein nicht zu verachtender Schritt - in die falsche Richtung!");
        }
    },

    // MARK: a cell is clicked
    openCell: function (i, j) {
        if (this.aSceneBoard[i][j].isSelected) {
            return;
        }
        if (this.aSceneBoard[i][j].isMacrophage) {
            this.blGameOver = true;
            this.aSceneBoard[i][j].cell.className = "laststep";
            this.showFinishedMessage(false);
            return;
        }
        this.aSceneBoard[i][j].cell.className = "open";
        this.aSceneBoard[i][j].isOpen = true;
        var arr = new Array();

        /*if (this.aSceneBoard[i][j].iNumberOfMacrophagesSurround == 0)
            arr = this.openCleanNeighborFields(i, j);
        else {
            this.aSceneBoard[i][j].cell.style.color = this.aFontcolor[this.aSceneBoard[i][j].iNumberOfMacrophagesSurround - 1];
            this.aSceneBoard[i][j].cell.firstChild.replaceData(0, this.aSceneBoard[i][j].cell.firstChild.nodeValue.length, this.aSceneBoard[i][j].iNumberOfMacrophagesSurround);
        }*/

        for (var k = 0; k < arr.length; k++) {
            this.openCell(arr[k][0], arr[k][1]);
        }
        if (this.isFinished()) {
            this.showFinishedMessage(true);
        }
    },

    /*openCleanNeighborFields: function (i, j) {
        var neighbors = this.getNeighboringCells(i, j);
        var fieldsWithoutNumber = new Array();
        for (var k = 0; k < neighbors.length; k++) {
            if (this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].isMacrophage || this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].isOpen || this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].isSelected)
                continue;
            this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].cell.className = "open";
            this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].isOpen = true;

            if (this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].iNumberOfMacrophagesSurround == 0) {
                fieldsWithoutNumber.push(neighbors[k]);
            }
            else {
                this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].cell.style.color = this.aFontcolor[this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].iNumberOfMacrophagesSurround - 1];
                this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].cell.firstChild.replaceData(0, this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].cell.firstChild.nodeValue.length, this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].iNumberOfMacrophagesSurround);
            }
        }
        return fieldsWithoutNumber;
    },*/

    buildMainTable: function () {
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        var tfoot = document.createElement('tfoot');
        table.appendChild(thead);
        table.appendChild(tbody);
        table.appendChild(tfoot);

        var tr = document.createElement('tr');
        this.iCellCountMacrophages.colSpan = this.scene.width;
        tr.appendChild(this.iCellCountMacrophages);
        thead.appendChild(tr);

        for (var i = 0; i < this.scene.height; i++) {
            var tr = document.createElement('tr');
            for (var j = 0; j < this.scene.width; j++) {
                this.aSceneBoard[i][j].cell = document.createElement('td');
                this.aSceneBoard[i][j].cell.className = "normal";
                this.aSceneBoard[i][j].cell.BacSweeperInstance = this;
                this.aSceneBoard[i][j].cell.posX = this.aSceneBoard[i][j].x;
                this.aSceneBoard[i][j].cell.posY = this.aSceneBoard[i][j].y;

                this.aSceneBoard[i][j].cell.onclick = function (evt) {

                    // MARK: when i click an a cell
                    evt = (evt) ? evt : ((window.event) ? window.event : "");
                    this.BacSweeperInstance.aMacrophagesPositions = this.BacSweeperInstance.placeMacrophages(this.posY * this.BacSweeperInstance.scene.width + this.posX);
                    this.BacSweeperInstance.setMacrophages();
                    this.BacSweeperInstance.countSurroundingMacrophages();
                    if (!this.BacSweeperInstance.blGameOver)
                        if (evt.ctrlKey) {
                            this.BacSweeperInstance.setSelection(this.posY, this.posX);
                        }
                        else {
                            this.BacSweeperInstance.openCell(this.posY, this.posX);
                        }
                };
                this.aSceneBoard[i][j].cell.appendChild(document.createTextNode(String.fromCharCode(160)));
                tr.appendChild(this.aSceneBoard[i][j].cell);
            }
            tbody.appendChild(tr);
        }
        var tr = document.createElement('tr');
        tfoot.appendChild(tr);
        var td_scene = document.createElement('td');
        return table;
    },

    countSurroundingMacrophages: function () {
        for (var i = 0; i < this.scene.height; i++) {
            for (var j = 0; j < this.scene.width; j++) {
                var neighbors = this.getNeighboringCells(i, j);
                for (var k = 0; k < neighbors.length; k++) {
                    if (this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].isMacrophage) {
                        this.aSceneBoard[i][j].iNumberOfMacrophagesSurround++;
                    }
                }
            }
        }
    },

    getNeighboringCells: function (y, x) {
        var neighbors = new Array();
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if ((i == 0 && j == 0) || (x + i < 0) || (y + j < 0)
                    || (x + i > this.scene.width - 1) || (y + j > this.scene.height - 1)) {
                    continue;
                }
                neighbors.push(new Array(y + j, x + i));
            }
        }
        return neighbors;
    },

    placeMacrophages: function (iTabuValue) {
        var aRandomNumbers = new Array();

        function Numsort(a, b) {
            return a - b;
        }

        do {
            var iRandomNumber = Math.floor(Math.random() * this.scene.width * this.scene.height);
            if (iRandomNumber != iTabuValue && !aRandomNumbers.inArray(iRandomNumber)) {
                aRandomNumbers.push(iRandomNumber);
            }
        }
        while (aRandomNumbers.length < this.scene.iMacrophagesCount);
        return (aRandomNumbers.sort(Numsort));
    }
};

var isDOMContentLoaded = false;

function addContentLoadListener() {
    if (document.addEventListener) {
        var DOMContentLoadFunction = function () {
            isDOMContentLoaded = true;
            BacSweeper.init(1);
        };
        document.addEventListener("DOMContentLoaded", DOMContentLoadFunction, false);
    }
    var oldonload = (window.onload || new Function());
    window.onload = function () {
        if (!isDOMContentLoaded) {
            oldonload();
            BacSweeper.init(1);
        }
    };
}

addContentLoadListener();