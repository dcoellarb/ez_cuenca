/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .controller("headerController",['$scope','$location','dataService','$mdSidenav',function($scope,$location,dataService,$mdSidenav){

        //properties

        //public methods
        $scope.logout = function(){
            dataService.logout().subscribe(
                function () {
                    $location.path("/home");
                },
                function (e) { },
                function () { }
            );
        };
        $scope.toggleLeft = function() {
            $mdSidenav("sidenav-left")
                .toggle();
        };

        //subscriptions

        //init
    }]);
