// Helper functions
Array.prototype._inArray = function (element) {
    for (var i = 0; i < this.length; i++)
        if (typeof(this[i]) == "object") {
            return this[i]._inArray(element);
        }
        else if (this[i] == element) {
            return true;
        }
    return false;
};

Array.prototype._formatSceneWithBlankCells = function (iWidth, iHeight) {
    for (var i = 0; i < iWidth; i++) {
        this[i] = new Array();
        for (var j = 0; j < iHeight; j++) {
            this[i][j] = new Cell(i, j);
        }
    }
};

// "Classes"
function Scene() {
    // MARK: game scene
    this.width = 7;
    this.height = 7;
    this.iMacrophagesCount = 3; // could be 1 to 5 macrophages
}

function Cell(y, x) {
    this.iX = x;
    this.iY = y;
    this.blIsMacrophage = false;
    this.blIsSelected = false;
    this.iNumberOfMacrophagesSurround = 0;
    this.blIsOpened = false;
    this.oCell = null; // referenced HTML element
}

var BacSweeper = {
    scene: null,
    iMacrophagesCount: 0,
    oCellCountMacrophages: null,
    aSceneBoard: new Array(),
    blGameOver: false,
    blIsFirstClick: false,
    aFontcolor: new Array("blue", "green", "red", "darkblue", "darkred", "violet", "orange", "black"),
    aMacrophagesPositions: new Array(),

    init: function () {

        // MARK: initialisation of the whole game
        this.scene = new Scene();
        this.iMacrophagesCount = this.scene.iMacrophagesCount;
        this.oCellCountMacrophages = document.createElement('th');
        this.oCellCountMacrophages.appendChild(document.createTextNode("Scene - there are " + this.iMacrophagesCount + " Macrophages"));
        this.blGameOver = false;
        this.blIsFirstClick = false;
        this.aSceneBoard._formatSceneWithBlankCells(this.scene.height, this.scene.width);
        document.getElementById("bacsweeperboard").replaceChild(this.buildHTML(), document.getElementById("bacsweeperboard").firstChild);
    },

    placeMacrophagesInScene: function () {
        for (var k = 0; k < this.aMacrophagesPositions.length; k++) {
            var i = Math.floor(this.aMacrophagesPositions[k] / this.scene.width);
            var j = this.aMacrophagesPositions[k] - i * this.scene.width;
            this.aSceneBoard[i][j].blIsMacrophage = true;
        }
    },

    setSelection: function (i, j) {
        if (!this.aSceneBoard[i][j].blIsOpened) {
            if (this.aSceneBoard[i][j].blIsSelected) {
                this.aSceneBoard[i][j].blIsSelected = false;
                this.iMacrophagesCount++;
                this.aSceneBoard[i][j].oCell.className = "normal";
            }
            else if (!this.aSceneBoard[i][j].blIsSelected && this.iMacrophagesCount > 0) {
                this.aSceneBoard[i][j].blIsSelected = true;
                this.iMacrophagesCount--;
                this.aSceneBoard[i][j].oCell.className = "select";
            }
            this.oCellCountMacrophages.firstChild.replaceData(0, this.oCellCountMacrophages.firstChild.nodeValue.length, "Scene - noch " + this.iMacrophagesCount + " Minen");
        }
    },

    sceneIsFinished: function () {
        for (var i = 0; i < this.scene.height; i++)
            for (var j = 0; j < this.scene.width; j++) {
                if (!this.aSceneBoard[i][j].blIsMacrophage && !this.aSceneBoard[i][j].blIsOpened) {
                    return false;
                }
            }
        return true;
    },

    /* showSolution: function () {
        this.blGameOver = true;
        for (var i = 0; i < this.scene.height; i++)
            for (var j = 0; j < this.scene.width; j++)
                if (!this.aSceneBoard[i][j].blIsMacrophage) {
                    this.aSceneBoard[i][j].oCell.className = "open";
                    if (this.aSceneBoard[i][j].iNumberOfMacrophagesSurround != 0) {
                        this.aSceneBoard[i][j].oCell.style.color = this.aFontcolor[this.aSceneBoard[i][j].iNumberOfMacrophagesSurround - 1];
                        this.aSceneBoard[i][j].oCell.firstChild.replaceData(0, this.aSceneBoard[i][j].oCell.firstChild.nodeValue.length, this.aSceneBoard[i][j].iNumberOfMacrophagesSurround);
                    }
                }
                else if (this.aSceneBoard[i][j].oCell.className != "laststep")
                    this.aSceneBoard[i][j].oCell.className = "mine";
    },*/

    printFinishedMessage: function (blComplete) {
        this.blGameOver = true;
        if (blComplete) {
            console.log("Congratulations you won!");
        }
        else {
            console.log("Ooh, your colony died!");
        }
    },

    // MARK: a oCell is clicked
    openCell: function (i, j) {
        if (this.aSceneBoard[i][j].blIsSelected) {
            return;
        }
        if (this.aSceneBoard[i][j].blIsMacrophage) {
            this.blGameOver = true;
            this.aSceneBoard[i][j].oCell.className = "laststep";
            this.printFinishedMessage(false);
            return;
        }
        this.aSceneBoard[i][j].oCell.className = "open";
        this.aSceneBoard[i][j].blIsOpened = true;
        var arr = new Array();

        /*if (this.aSceneBoard[i][j].iNumberOfMacrophagesSurround == 0)
            arr = this.openCleanNeighborFields(i, j);
        else {
            this.aSceneBoard[i][j].oCell.style.color = this.aFontcolor[this.aSceneBoard[i][j].iNumberOfMacrophagesSurround - 1];
            this.aSceneBoard[i][j].oCell.firstChild.replaceData(0, this.aSceneBoard[i][j].oCell.firstChild.nodeValue.length, this.aSceneBoard[i][j].iNumberOfMacrophagesSurround);
        }*/

        for (var k = 0; k < arr.length; k++) {
            this.openCell(arr[k][0], arr[k][1]);
        }
        if (this.sceneIsFinished()) {
            this.printFinishedMessage(true);
        }
    },

    /*openCleanNeighborFields: function (i, j) {
        var neighbors = this._getNeighboringCells(i, j);
        var fieldsWithoutNumber = new Array();
        for (var k = 0; k < neighbors.length; k++) {
            if (this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].blIsMacrophage || this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].blIsOpened || this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].blIsSelected)
                continue;
            this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].oCell.className = "open";
            this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].blIsOpened = true;

            if (this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].iNumberOfMacrophagesSurround == 0) {
                fieldsWithoutNumber.push(neighbors[k]);
            }
            else {
                this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].oCell.style.color = this.aFontcolor[this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].iNumberOfMacrophagesSurround - 1];
                this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].oCell.firstChild.replaceData(0, this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].oCell.firstChild.nodeValue.length, this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].iNumberOfMacrophagesSurround);
            }
        }
        return fieldsWithoutNumber;
    },*/

    buildHTML: function () {
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        var tfoot = document.createElement('tfoot');
        table.appendChild(thead);
        table.appendChild(tbody);
        table.appendChild(tfoot);

        var tr = document.createElement('tr');
        this.oCellCountMacrophages.colSpan = this.scene.width;
        tr.appendChild(this.oCellCountMacrophages);
        thead.appendChild(tr);

        for (var i = 0; i < this.scene.height; i++) {
            var tr = document.createElement('tr');
            for (var j = 0; j < this.scene.width; j++) {
                this.aSceneBoard[i][j].oCell = document.createElement('td');
                this.aSceneBoard[i][j].oCell.className = "normal";
                this.aSceneBoard[i][j].oCell.BacSweeperInstance = this;
                this.aSceneBoard[i][j].oCell.posX = this.aSceneBoard[i][j].iX;
                this.aSceneBoard[i][j].oCell.posY = this.aSceneBoard[i][j].iY;

                this.aSceneBoard[i][j].oCell.onclick = function (evt) {

                    // MARK: when i click an a oCell
                    evt = (evt) ? evt : ((window.event) ? window.event : "");
                    this.BacSweeperInstance.aMacrophagesPositions = this.BacSweeperInstance._getMacrophagesPositions(this.posY * this.BacSweeperInstance.scene.width + this.posX);
                    this.BacSweeperInstance.placeMacrophagesInScene();
                    this.BacSweeperInstance.countSurroundingMacrophages();
                    if (!this.BacSweeperInstance.blGameOver)
                        if (evt.ctrlKey) {
                            this.BacSweeperInstance.setSelection(this.posY, this.posX);
                        }
                        else {
                            this.BacSweeperInstance.openCell(this.posY, this.posX);
                        }
                };
                this.aSceneBoard[i][j].oCell.appendChild(document.createTextNode(""));
                tr.appendChild(this.aSceneBoard[i][j].oCell);
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
                var neighbors = this._getNeighboringCells(i, j);
                for (var k = 0; k < neighbors.length; k++) {
                    if (this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].blIsMacrophage) {
                        this.aSceneBoard[i][j].iNumberOfMacrophagesSurround++;
                    }
                }
            }
        }
    },

    _getNeighboringCells: function (y, x) {
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

    _getMacrophagesPositions: function (iTabuValue) {
        var aRandomNumbers = new Array();

        function Numsort(a, b) {
            return a - b;
        }

        do {
            var iRandomNumber = Math.floor(Math.random() * this.scene.width * this.scene.height);
            if (iRandomNumber != iTabuValue && !aRandomNumbers._inArray(iRandomNumber)) {
                aRandomNumbers.push(iRandomNumber);
            }
        }
        while (aRandomNumbers.length < this.scene.iMacrophagesCount);
        return (aRandomNumbers.sort(Numsort));
    }
};

var isDOMContentLoaded = false;

function startingPoint() {
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

startingPoint();