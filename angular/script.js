const gameOfLifeComponent = {
  templateUrl: "gameOfLife.html",
  controller: gameOfLifeController
};

const gridComponent = {
  templateUrl: "grid.html",
  bindings: {
      rows: '<'
  }
};

const toolbarComponent = {
  templateUrl: "toolbar.html",
  controller: toolbarController,
  bindings: {
    generation: '<',
    onClear: '&',
    onStartGame: '&',
    onStopGame: '&'
  }
};

angular
  .module("app", [])
  .component("gameOfLife", gameOfLifeComponent)
  .component("grid", gridComponent)
  .component("toolbar", toolbarComponent);

function toolbarController() {
  const ctrl = this;

  ctrl.notStopped = true;

  ctrl.clear = function() {
      ctrl.onClear();
      ctrl.clearClicked = true;
  };

  ctrl.startGame = function(isRandom) {
      if (ctrl.clearClicked) {
        ctrl.onStartGame({isRandom: true})
        ctrl.clearClicked = false;
      } else {
        ctrl.onStartGame({isRandom: isRandom})
      }
      ctrl.notStopped = true;
  };

  ctrl.stopGame = function() {
      ctrl.onStopGame();
      ctrl.notStopped = false;
  }

}

function gameOfLifeController($interval) {
  const ctrl = this;

  let interval,
    generation = 0;

  // Grid Size
  const rowMax = 25,
        colMax = 30;

  const numRandomSeeds = rowMax * colMax / 2;

  // Conway Constants
  const LIVE = 1,
    DEAD = 0,
    OVERPOPULATION_NUM = 4,
    UNDERPOPULATION_NUM = 1,
    MAINTENANCE_NUM = 3;

  const rows = createGrid(rowMax, colMax);

  angular.extend(ctrl, {
    activate: activate,
    clear: clear.bind(this, rowMax, colMax),
    generation: generation,
    rows: rows,
    startGame: startGame,
    stopGame: stopGame
  });

 ctrl.startGame();

 function startGame(random = true) {
   const ctrl = this;

   if (random) {
     console.log(random)
     ctrl.generation = 0;
     generateRandomSeeds(ctrl);
   }

   interval = $interval(() => {
     ctrl.generation++;
     for (let i = 0; i < rowMax; i++) {
       for (let j = 0; j < colMax; j++) {
         const numNeighbours = checkNeighbours.call(this, i, j);
         ctrl.rows[i].columns[j].neighbours = numNeighbours;
       }
     }
     for (let i = 0; i < rowMax; i++) {
       for (let j = 0; j < colMax; j++) {
         if (ctrl.rows[i].columns[j].active >= 1) {
           if (
             ctrl.rows[i].columns[j].neighbours >= OVERPOPULATION_NUM ||
             ctrl.rows[i].columns[j].neighbours <= UNDERPOPULATION_NUM
           ) {
             ctrl.rows[i].columns[j].active = DEAD;
           } else {
             ctrl.rows[i].columns[j].active++;
           }
         } else {
           if (ctrl.rows[i].columns[j].neighbours === MAINTENANCE_NUM) {
             ctrl.rows[i].columns[j].active = LIVE;
           }
         }
       }
     }
   }, 100);

 }

    function stopGame() {
        $interval.cancel(interval)
    }

 function checkNeighbours(row, column) {
   const ctrl = this;
   let count = 0;
   for (let i = row - 1; i <= row + 1; i++) {
     for (let j = column - 1; j <= column + 1; j++) {
       if (
         (i !== row || j !== column) &&
         ctrl.rows[i] &&
         ctrl.rows[i].columns[j]
       ) {
         if (ctrl.rows[i].columns[j].active >= 1) {
           count++;
         }
       }
     }
   }
   return count;
 }

 function generateRandomSeeds(ctrl) {
   for (let i = 0; i < numRandomSeeds; i++) {
     const row = Math.floor(Math.random() * rowMax);
     const col = Math.floor(Math.random() * colMax);
     ctrl.activate(row, col);
   }

 }

 function activate(row, col) {
   const ctrl = this;
   ctrl.rows[row].columns[col].active = LIVE;
 }

    function clear(rowMax, colMax) {
      const ctrl = this;
      for (let i = 0; i < rowMax; i++) {
        for (let j = 0; j < colMax; j++) {
          ctrl.rows[i].columns[j].active = DEAD;
        }
      }
    }

}

function createGrid(rowMax, colMax) {
  const rows = [];
  for (let i = 0; i < rowMax; i++) {
    const columns = [];
    for (let j = 0; j < colMax; j++) {
      const elem = { active: 0 };
      columns.push(elem);
    }
    rows.push({ columns: columns });
  }
  return rows;
}


