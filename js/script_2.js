// Helper functions
function onReady(pFunction) {
    if (document.readyState === 'complete') {
        setTimeout(pFunction, 1);
    }
    else {
        readyStateCheckInterval = setInterval(function() {
            if (document.readyState === 'complete') {
                clearInterval(readyStateCheckInterval);
                pFunction();
            }
        }, 10);
    }
}

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

Array.prototype.formatSceneWithBlankCells = function (iWidth, iHeight) {
    for (var i = 0; i < iWidth; i++) {
        this[i] = new Array();
        for (var j = 0; j < iHeight; j++) {
            this[i][j] = new Cell(i, j);
        }
    }
};

/**
 * Returns a random integer between piMin (inclusive) and piMax (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(piMin, piMax) {
    return Math.floor(Math.random() * (piMax - piMin + 1)) + piMin;
}

function Cell(y, x) {
    this.iXPos = x;
    this.iYPos = y;
    this.blIsMacrophage = false;
    this.blIsBacteria = false;
    this.blIsSelected = false;
    this.iMacrophagesSurround = 0;
    this.iBacteriasSurround = 0;
    this.blIsOpened = false;
    this.oTd = null; // referenced HTML element
}

var BacSweeper = {
    iSceneWidth: 7,
    iSceneHeight: 7,
    iMacrophagesCountMax: 5,
    iMacrophagesCount: 0,
    oThSceneBoard: null,
    aSceneBoard: new Array(),
    blGameOver: false,

    aMacrophagesPosition: new Array(),

    init: function () {
        this.iMacrophagesCount = getRandomInt(1, this.iMacrophagesCountMax);
        this.oThSceneBoard = document.createElement('th');
        this.oThSceneBoard.appendChild(document.createTextNode("This scene has " + this.iMacrophagesCount + " macrophages"));
        this.blGameOver = false;
        this.aSceneBoard.formatSceneWithBlankCells(this.iSceneWidth, this.iSceneHeight);
        document.getElementById("bacsweeperboard").replaceChild(
            this.buildHTML(),
            document.getElementById("bacsweeperboard").firstChild
        );
    },

    placeMacrophagesInScene: function () {
        this.iMacrophagesCount = getRandomInt(1, 5);
        for (var m = 0; m < this.iMacrophagesCount; i++) {
            var iXRand = getRandomInt(0, this.iSceneWidth);
            var iYRand = getRandomInt(0, this.iSceneHeight);
            this.aSceneBoard[iXRand][iYRand].oTd.className = "macrophage";
            this.aSceneBoard[iXRand][iYRand].oTd.bacSweeperInstance = this;
            this.aSceneBoard[iXRand][iYRand].oTd.iPosX = this.aSceneBoard[i][j].iXPos;
            this.aSceneBoard[iXRand][iYRand].oTd.iPosY = this.aSceneBoard[i][j].iYPos;
            /*for (var i = 0; i < this.iSceneHeight; i++) {
                for (var j = 0; j < this.iSceneWidth; j++) {
                }
            }*/
        }
    },

    checkSelection: function (i, j) {

        /*if (!this.aSceneBoard[i][j].blIsOpened) {
            if (this.aSceneBoard[i][j].blIsSelected) {
                this.aSceneBoard[i][j].blIsSelected = false;
                this.iMacrophagesCount++;
                this.aSceneBoard[i][j].oTd.className = "normal";
            }
            else if (!this.aSceneBoard[i][j].blIsSelected && this.iMacrophagesCount > 0) {
                this.aSceneBoard[i][j].blIsSelected = true;
                this.iMacrophagesCount--;
                this.aSceneBoard[i][j].oTd.className = "select";
            }
            this.oThSceneBoard.firstChild.replaceData(0, this.oThSceneBoard.firstChild.nodeValue.length, "Scene - noch " + this.iMacrophagesCount + " Minen");
        }*/

    },

    sceneIsFinished: function () {
        for (var i = 0; i < this.scene.iHeight; i++)
            for (var j = 0; j < this.scene.iWidth; j++) {
                if (!this.aSceneBoard[i][j].blIsMacrophage && !this.aSceneBoard[i][j].blIsOpened) {
                    return false;
                }
            }
        return true;
    },

    /* showSolution: function () {
        this.blGameOver = true;
        for (var i = 0; i < this.scene.iHeight; i++)
            for (var j = 0; j < this.scene.iWidth; j++)
                if (!this.aSceneBoard[i][j].blIsMacrophage) {
                    this.aSceneBoard[i][j].oTd.className = "open";
                    if (this.aSceneBoard[i][j].iMacrophagesSurround != 0) {
                        this.aSceneBoard[i][j].oTd.style.color = this.aFontcolor[this.aSceneBoard[i][j].iMacrophagesSurround - 1];
                        this.aSceneBoard[i][j].oTd.firstChild.replaceData(0, this.aSceneBoard[i][j].oTd.firstChild.nodeValue.length, this.aSceneBoard[i][j].iMacrophagesSurround);
                    }
                }
                else if (this.aSceneBoard[i][j].oTd.className != "laststep")
                    this.aSceneBoard[i][j].oTd.className = "mine";
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

    // MARK: a oTd is clicked
    openCell: function (i, j) {
        /*if (this.aSceneBoard[i][j].blIsSelected) {
            return;
        }
        if (this.aSceneBoard[i][j].blIsMacrophage) {
            this.blGameOver = true;
            this.aSceneBoard[i][j].oTd.className = "laststep";
            this.printFinishedMessage(false);
            return;
        }
        this.aSceneBoard[i][j].oTd.className = "open";
        this.aSceneBoard[i][j].blIsOpened = true;
        var arr = new Array();*/

        /*if (this.aSceneBoard[i][j].iMacrophagesSurround == 0)
            arr = this.openCleanNeighborFields(i, j);
        else {
            this.aSceneBoard[i][j].oTd.style.color = this.aFontcolor[this.aSceneBoard[i][j].iMacrophagesSurround - 1];
            this.aSceneBoard[i][j].oTd.firstChild.replaceData(0, this.aSceneBoard[i][j].oTd.firstChild.nodeValue.length, this.aSceneBoard[i][j].iMacrophagesSurround);
        }*/

        /*for (var k = 0; k < arr.length; k++) {
            this.openCell(arr[k][0], arr[k][1]);
        }
        if (this.sceneIsFinished()) {
            this.printFinishedMessage(true);
        }*/
    },

    /*openCleanNeighborFields: function (i, j) {
        var neighbors = this.getNeighboringCells(i, j);
        var fieldsWithoutNumber = new Array();
        for (var k = 0; k < neighbors.length; k++) {
            if (this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].blIsMacrophage || this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].blIsOpened || this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].blIsSelected)
                continue;
            this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].oTd.className = "open";
            this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].blIsOpened = true;

            if (this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].iMacrophagesSurround == 0) {
                fieldsWithoutNumber.push(neighbors[k]);
            }
            else {
                this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].oTd.style.color = this.aFontcolor[this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].iMacrophagesSurround - 1];
                this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].oTd.firstChild.replaceData(0, this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].oTd.firstChild.nodeValue.length, this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].iMacrophagesSurround);
            }
        }
        return fieldsWithoutNumber;
    },*/

    buildHTML: function () {
        // MARK: initialisation of the whole game
        var oTable = document.createElement('table');
        var oTHead = document.createElement('thead');
        var oTBody = document.createElement('tbody');
        var oTFoot = document.createElement('tfoot');
        oTable.appendChild(oTHead);
        oTable.appendChild(oTBody);
        oTable.appendChild(oTFoot);

        var oTr = document.createElement('tr');
        this.oThSceneBoard.colSpan = this.scene.iWidth;
        oTr.appendChild(this.oThSceneBoard);
        oTHead.appendChild(oTr);

        for (var i = 0; i < this.scene.iHeight; i++) {
            var oTr = document.createElement('tr');
            for (var j = 0; j < this.scene.iWidth; j++) {
                this.aSceneBoard[i][j].oTd = document.createElement('oTd');
                this.aSceneBoard[i][j].oTd.className = "normal";
                this.aSceneBoard[i][j].oTd.bacSweeperInstance = this;
                this.aSceneBoard[i][j].oTd.iPosX = this.aSceneBoard[i][j].iXPos;
                this.aSceneBoard[i][j].oTd.iPosY = this.aSceneBoard[i][j].iYPos;
                this.aSceneBoard[i][j].oTd.onclick = function (evt) {
                    // MARK: when i a cell is clicked
                    evt = (evt) ? evt : ((window.event) ? window.event : "");
                    this.bacSweeperInstance.aMacrophagesPosition = this.bacSweeperInstance._getMacrophagesPosition(this.iPosY * this.bacSweeperInstance.scene.iWidth + this.iPosX);
                    this.bacSweeperInstance.placeMacrophagesInScene();
                    this.bacSweeperInstance.countSurroundingMacrophages();
                    if (!this.bacSweeperInstance.blGameOver) {
                        this.bacSweeperInstance.openCell(this.iPosY, this.iPosX);
                    }
                };
                this.aSceneBoard[i][j].oTd.appendChild(document.createTextNode(""));
                oTr.appendChild(this.aSceneBoard[i][j].oTd);
            }
            oTBody.appendChild(oTr);
        }


        var oTr = document.createElement('tr');
        oTFoot.appendChild(oTr);
        var oTdScene = document.createElement('oTd');
        return oTable;
    },

    countSurroundingMacrophages: function () {
        for (var i = 0; i < this.scene.iHeight; i++) {
            for (var j = 0; j < this.scene.iWidth; j++) {
                var neighbors = this.getNeighboringCells(i, j);
                for (var k = 0; k < neighbors.length; k++) {
                    if (this.aSceneBoard[neighbors[k][0]][neighbors[k][1]].blIsMacrophage) {
                        this.aSceneBoard[i][j].iMacrophagesSurround++;
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
                    || (x + i > this.scene.iWidth - 1) || (y + j > this.scene.iHeight - 1)) {
                    continue;
                }
                neighbors.push(new Array(y + j, x + i));
            }
        }
        return neighbors;
    },

};

onReady(function() {
    BacSweeper.init();
});