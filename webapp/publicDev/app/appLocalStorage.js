/**
 * Created by dcoellar on 4/6/16.
 */

angular.module("easyRuta")
    .config(['localStorageServiceProvider',function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('easyRuta')
            .setStorageType('sessionStorage')
    }]);
