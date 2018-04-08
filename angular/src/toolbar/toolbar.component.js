const toolbarComponent = {
//  templateUrl: "./toolbar.html",
  template: require('./toolbar.html'),
  controller: toolbarController,
  bindings: {
    generation: '<',
    onClear: '&',
    onStartGame: '&',
    onStopGame: '&'
  }
};

angular.module('toolbar', [])
       .component('toolbar', toolbarComponent);

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
