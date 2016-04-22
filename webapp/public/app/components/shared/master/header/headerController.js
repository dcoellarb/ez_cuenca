/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .controller("headerController",['$scope','$window','dataService','$mdSidenav',function($scope,$window,dataService,$mdSidenav){

        //properties

        //public methods
        $scope.logout = function(){
            dataService.logout().subscribe(
                function () {
                    $window.location.href = "http://localhost:3000/modules/login/index.html";
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
