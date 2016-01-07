/**
 * Created by dcoellar on 11/26/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_scope;
    var local_uibModalInstance;
    var local_notifications_center_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var cerrar;

    // Data callbacks
    var local_get_notfications_callback;

    angular.module("easyRuta")
        .controller('notifications_center_controller',function($scope,$uibModalInstance,notifications_center_viewmodel){

            ctlr = this;
            local_scope = $scope;
            local_uibModalInstance = $uibModalInstance;
            local_notifications_center_viewmodel = notifications_center_viewmodel

            ctlr.cancelar = cerrar;

            init();
        });

    // Constructor
    init = function(){
        local_notifications_center_viewmodel.get_notifications(local_get_notfications_callback)
    };

    // "Public" methods
    cerrar = function(){
        local_uibModalInstance.dismiss('cancel');
    };

    // Data callbacks
    local_get_notfications_callback = function(error,results){
        ctlr.notifications = results;
        local_scope.$apply();
    }

})();