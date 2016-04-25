/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .config(['dataServiceProvider',function(dataServiceProvider) {
        dataServiceProvider.initialize("wJjWR5KTriUoPNnDH3baAQMkWvpAhuFhNU7PsKOP", "qpl5kH3ylsBswrTqljtlx8S6iOZgjH3o2rGDeLgG");//PROD
        //dataServiceProvider.initialize("2hLYHTAUJ9QXMWxQTXsOIZ2jXJLGtMauw2QN34fE", "xSiGu1HbOBQvzcd7ItdgGGyMq2IcpvKmCAFjhY2T");//QA
    }]);