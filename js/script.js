/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+            MineSweeper JavaScript v0.3a by Michael Loesler           +
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+ Copyright (C) by Michael Loesler, http//derletztekick.com            +
+                                                                      +
+                                                                      +
+ This program is free software; you can redistribute it and/or modify +
+ it under the terms of the GNU General Public License as published by +
+ the Free Software Foundation; either version 2 of the License, or    +
+ (at your option) any later version.                                  +
+                                                                      +
+ This program is distributed in the hope that it will be useful,      +
+ but WITHOUT ANY WARRANTY; without even the implied warranty of       +
+ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the        +
+ GNU General Public License for more details.                         +
+                                                                      +
+ You should have received a copy of the GNU General Public License    +
+ along with this program; if not, write to the                        +
+ Free Software Foundation, Inc.,                                      +
+ 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.            +
+                                                                      +
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


Array.prototype.zeros = function (o, p) {
    for (var i = 0; i < o; i++) {
        this[i] = new Array();
        for (var j = 0; j < p; j++)
            this[i][j] = new Token(i, j);
    }
}

Array.prototype.inArray = function (val) {
    for (var i = 0; i < this.length; i++)
        if (typeof(this[i]) == "object")
            return this[i].inArray(val);
        else if (this[i] == val)
            return true;
    return false;
}

function Level(l) {
    this.type = parseInt(l);
    this.width = 8;
    this.height = 8;
    this.mines = 10;
    switch (this.type) {
        case 2:
            this.width = 16;
            this.height = 16;
            this.mines = 40;
            break;
        case 3:
            this.width = 30;
            this.height = 16;
            this.mines = 99;
            break;
        default:
            this.type = 1;
            this.width = 8;
            this.height = 8;
            this.mines = 10;
            break;
    }
}

function Token(y, x) {
    this.x = x;
    this.y = y;

    this.isMine = false;
    this.isSelected = false;
    this.numberOfMinesSurround = 0;

    this.isOpen = false;
    this.cell = null;
}


var Minesweeper = {
    startTime: null,
    level: null,
    countMines: 0,
    cellCountMines: null,
    MW: new Array(),
    gameOver: false,
    isFirstClick: false,
    fontcolor: new Array("blue", "green", "red", "darkblue", "darkred", "violet", "orange", "black"),
    minesPosition: new Array(),
    init: function (l) {
        this.level = new Level(l);
        this.countMines = this.level.mines;
        this.startTime = null;
        this.cellCountMines = document.createElement('th');
        this.cellCountMines.appendChild(document.createTextNode("Level " + this.level.type + " - noch " + this.countMines + " Minen"));
        this.gameOver = false;
        this.isFirstClick = false;
        this.MW.zeros(this.level.height, this.level.width);
        /*
        this.minesPosition = this.calculateMines();
        this.setMines();
        this.countMinesSurround();
        */
        document.getElementById("minesweeper").replaceChild(this.createDisplayTable(), document.getElementById("minesweeper").firstChild);
    },

    setMines: function () {
        for (var k = 0; k < this.minesPosition.length; k++) {
            var i = Math.floor(this.minesPosition[k] / this.level.width);
            var j = this.minesPosition[k] - i * this.level.width;
            this.MW[i][j].isMine = true;
        }
    },

    setSelection: function (i, j) {
        if (!this.MW[i][j].isOpen) {
            if (this.MW[i][j].isSelected) {
                this.MW[i][j].isSelected = false;
                this.countMines++;
                this.MW[i][j].cell.className = "normal";
            }
            else if (!this.MW[i][j].isSelected && this.countMines > 0) {
                this.MW[i][j].isSelected = true;
                this.countMines--;
                this.MW[i][j].cell.className = "select";
            }
            this.cellCountMines.firstChild.replaceData(0, this.cellCountMines.firstChild.nodeValue.length, "Level " + this.level.type + " - noch " + this.countMines + " Minen");
        }
    },

    isFinished: function () {
        for (var i = 0; i < this.level.height; i++)
            for (var j = 0; j < this.level.width; j++)
                if (!this.MW[i][j].isMine && !this.MW[i][j].isOpen)
                    return false;
        return true;
    },

    showSolution: function () {
        this.gameOver = true;
        for (var i = 0; i < this.level.height; i++)
            for (var j = 0; j < this.level.width; j++)
                if (!this.MW[i][j].isMine) {
                    this.MW[i][j].cell.className = "open";
                    if (this.MW[i][j].numberOfMinesSurround != 0) {
                        this.MW[i][j].cell.style.color = this.fontcolor[this.MW[i][j].numberOfMinesSurround - 1];
                        this.MW[i][j].cell.firstChild.replaceData(0, this.MW[i][j].cell.firstChild.nodeValue.length, this.MW[i][j].numberOfMinesSurround);
                    }
                }
                else if (this.MW[i][j].cell.className != "laststep")
                    this.MW[i][j].cell.className = "mine";
    },

    showFinishedMessage: function (complete) {
        this.gameOver = true;
        var ss = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
        var mm = Math.floor(ss / 60);
        var hh = Math.floor(mm / 60);
        mm -= hh * 60;
        ss -= mm * 60;
        var time = (hh > 0 ? hh + " Stunden, " : "") + (hh > 0 || mm > 0 ? mm + " Minuten, " : "") + (hh > 0 || mm > 0 || ss >= 0 ? ss + " Sekunden" : "")
        this.showSolution();
        if (complete)
            window.alert("Gratulation, Du hast alle Minen entdeckt! Benoetigte Zeit:\n" + time + ".");
        else
            window.alert("Ooh, ein nicht zu verachtender Schritt - in die falsche Richtung!\nBenoetigte Zeit: " + time + ".");
    },

    openField: function (i, j) {
        if (this.MW[i][j].isSelected) {
            return;
        }
        if (this.MW[i][j].isMine) {
            this.gameOver = true;
            this.MW[i][j].cell.className = "laststep";
            this.showFinishedMessage(false);
            //this.MW[i][j].cell.className = "laststep";
            return;
        }
        this.MW[i][j].cell.className = "open";
        this.MW[i][j].isOpen = true;
        var arr = new Array();
        if (this.MW[i][j].numberOfMinesSurround == 0)
            arr = this.openCleanNeighborFields(i, j);
        else {
            this.MW[i][j].cell.style.color = this.fontcolor[this.MW[i][j].numberOfMinesSurround - 1];
            this.MW[i][j].cell.firstChild.replaceData(0, this.MW[i][j].cell.firstChild.nodeValue.length, this.MW[i][j].numberOfMinesSurround);
        }
        for (var k = 0; k < arr.length; k++)
            this.openField(arr[k][0], arr[k][1]);
        if (this.isFinished())
            this.showFinishedMessage(true);
    },

    openCleanNeighborFields: function (i, j) {
        var neighbors = this.neighborCells(i, j);
        var fieldsWithoutNumber = new Array();
        for (var k = 0; k < neighbors.length; k++) {
            if (this.MW[neighbors[k][0]][neighbors[k][1]].isMine || this.MW[neighbors[k][0]][neighbors[k][1]].isOpen || this.MW[neighbors[k][0]][neighbors[k][1]].isSelected)
                continue;
            this.MW[neighbors[k][0]][neighbors[k][1]].cell.className = "open";
            this.MW[neighbors[k][0]][neighbors[k][1]].isOpen = true;

            if (this.MW[neighbors[k][0]][neighbors[k][1]].numberOfMinesSurround == 0) {
                fieldsWithoutNumber.push(neighbors[k]);
            }
            else {
                this.MW[neighbors[k][0]][neighbors[k][1]].cell.style.color = this.fontcolor[this.MW[neighbors[k][0]][neighbors[k][1]].numberOfMinesSurround - 1];
                this.MW[neighbors[k][0]][neighbors[k][1]].cell.firstChild.replaceData(0, this.MW[neighbors[k][0]][neighbors[k][1]].cell.firstChild.nodeValue.length, this.MW[neighbors[k][0]][neighbors[k][1]].numberOfMinesSurround);
            }
        }
        return fieldsWithoutNumber;
    },

    createDisplayTable: function () {
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        var tfoot = document.createElement('tfoot');
        table.appendChild(thead);
        table.appendChild(tbody);
        table.appendChild(tfoot);

        var tr = document.createElement('tr');
        this.cellCountMines.colSpan = this.level.width;
        tr.appendChild(this.cellCountMines);
        thead.appendChild(tr);


        for (var i = 0; i < this.level.height; i++) {
            var tr = document.createElement('tr');
            for (var j = 0; j < this.level.width; j++) {
                this.MW[i][j].cell = document.createElement('td');
                this.MW[i][j].cell.className = "normal";
                this.MW[i][j].cell.Instanz = this;
                this.MW[i][j].cell.posX = this.MW[i][j].x;
                this.MW[i][j].cell.posY = this.MW[i][j].y;

                this.MW[i][j].cell.onclick = function (evt) {
                    evt = (evt) ? evt : ((window.event) ? window.event : "");
                    if (this.Instanz.startTime == null) {
                        this.Instanz.startTime = new Date();
                        this.Instanz.minesPosition = this.Instanz.calculateMines(this.posY * this.Instanz.level.width + this.posX);
                        this.Instanz.setMines();
                        this.Instanz.countMinesSurround();
                    }
                    if (!this.Instanz.gameOver)
                        if (evt.ctrlKey)
                            this.Instanz.setSelection(this.posY, this.posX);
                        else
                            this.Instanz.openField(this.posY, this.posX);
                }
                this.MW[i][j].cell.appendChild(document.createTextNode(String.fromCharCode(160)));
                tr.appendChild(this.MW[i][j].cell);
            }
            tbody.appendChild(tr);
        }
        var tr = document.createElement('tr');
        tfoot.appendChild(tr);
        var td_levels = document.createElement('td');
        td_levels.style.textAlign = "left";
        td_levels.colSpan = this.level.width - 4;
        td_levels.appendChild(document.createTextNode("Level "));
        tr.appendChild(td_levels);
        for (var i = 0; i < 3; i++) {
            var span = document.createElement('span');
            span.appendChild(document.createTextNode(i + 1));
            span.title = "Spiel starten in Level " + (i + 1);
            td_levels.appendChild(span);
            if (i < 2)
                td_levels.appendChild(document.createTextNode(", "));
            span.level = (i + 1);
            span.Instanz = this;
            span.onclick = function (e) {
                this.Instanz.init(this.level);
            }
        }
        td_levels.appendChild(document.createTextNode(" starten"));
        var td_softwareinfo = document.createElement('td');
        var span = document.createElement('span');
        span.appendChild(document.createTextNode("MineSweeper JS"));
        span.title = "MineSweeper JS stammt von derletztekick.com - diese Seite besuchen...";
        span.onclick = function (e) {
            window.open("http://derletztekick.com", "_blank");
        };
        td_softwareinfo.style.textAlign = "right";
        td_softwareinfo.colSpan = 4;
        td_softwareinfo.appendChild(span);
        tr.appendChild(td_softwareinfo);
        return table;
    },

    countMinesSurround: function () {
        for (var i = 0; i < this.level.height; i++) {
            for (var j = 0; j < this.level.width; j++) {
                var neighbors = this.neighborCells(i, j);
                for (var k = 0; k < neighbors.length; k++) {
                    if (this.MW[neighbors[k][0]][neighbors[k][1]].isMine) {
                        this.MW[i][j].numberOfMinesSurround++;
                    }
                }
            }
        }
    },

    neighborCells: function (y, x) {
        var neighbors = new Array();
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if ((i == 0 && j == 0) || (x + i < 0) || (y + j < 0) || (x + i > this.level.width - 1) || (y + j > this.level.height - 1))
                    continue;
                neighbors.push(new Array(y + j, x + i));
            }
        }
        return neighbors;
    },

    calculateMines: function (tabuValue) {
        var randomNumbers = new Array();

        function Numsort(a, b) {
            return a - b;
        }

        do {
            var r = Math.floor(Math.random() * this.level.width * this.level.height);
            if (r != tabuValue && !randomNumbers.inArray(r))
                randomNumbers.push(r);
        }
        while (randomNumbers.length < this.level.mines);
        return (randomNumbers.sort(Numsort));
    }
}

var isDOMContentLoaded = false;

function addContentLoadListener() {
    if (document.addEventListener) {
        var DOMContentLoadFunction = function () {
            isDOMContentLoaded = true;
            Minesweeper.init(1);
        };
        document.addEventListener("DOMContentLoaded", DOMContentLoadFunction, false);
    }
    var oldonload = (window.onload || new Function());
    window.onload = function () {
        if (!isDOMContentLoaded) {
            oldonload();
            Minesweeper.init(1);
        }
    };
}

addContentLoadListener();