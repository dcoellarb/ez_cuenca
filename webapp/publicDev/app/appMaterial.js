/**
 * Created by dcoellar on 9/14/15.
 */

angular.module("easyRuta")
    .config(['$mdThemingProvider',function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('amber');
    }])
    .config(['$mdThemingProvider',function($mdThemingProvider) {
        $mdThemingProvider.theme('dark')
            .dark();
    }]);
