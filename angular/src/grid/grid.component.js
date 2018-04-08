const gridComponent = {
//  templateUrl: "./grid.html",
  template: require('./grid.html'),
  bindings: {
      rows: '<'
  }
};

angular.module('grid', [])
       .component('grid', gridComponent)
