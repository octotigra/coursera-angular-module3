(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', foundItems)
        .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com');

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var vm = this;

        vm.isEmpty = false;
        vm.filtered = [];


        vm.getMatchedMenuItems = function(searchTerm) {

            MenuSearchService.getMatchedMenuItems(searchTerm)
                .then(function(result) {
                    vm.filtered = result;
                    vm.setEmpty();
                });

            vm.searchTerm = ' ';
        };

        vm.removeItem = function(index) {
            vm.filtered.splice(index, 1);
            vm.setEmpty();
        };

        vm.setEmpty = function () {
            vm.isEmpty = !vm.filtered.length;
        };
    }

    function foundItems() {
        var ddo = {
            scope: {
                items: '<',
                removeItem: '&onRemove'
            },
            templateUrl: 'foundItemsDirective.html'
        };
        return ddo;
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath']
    function MenuSearchService($http, ApiBasePath) {
        var vm = this;

        vm.getMatchedMenuItems =  function (searchTerm) {
            var configuredRequest = {
                url: (ApiBasePath + '/menu_items.json')
            };
            return $http(configuredRequest)
                .then(function(response) {
                    var foundItems = response.data.menu_items.filter(matchesDescription);

                    function matchesDescription(item) {
                        return item.description.includes(searchTerm);
                    }

                    return foundItems;
                });
        }
    }

})();