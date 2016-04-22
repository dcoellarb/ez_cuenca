/**
 * Created by dcoellar on 4/11/16.
 */

angular.module("easyRuta")
    .config(['dataServiceProvider',function(dataServiceProvider) {
        //dataServiceProvider.initialize("VJTDwzZdvOVEjA6c2DnVHduEvOpY8p3Cx4KMwxUi", "zQ1tHay1kKYGRrr7psu8oddu2fnKuOF7EpAWbAdM");//PROD
        dataServiceProvider.initialize("2hLYHTAUJ9QXMWxQTXsOIZ2jXJLGtMauw2QN34fE", "xSiGu1HbOBQvzcd7ItdgGGyMq2IcpvKmCAFjhY2T");//QA
    }]);