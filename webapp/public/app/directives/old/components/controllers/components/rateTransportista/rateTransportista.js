/**
 * Created by dcoellar on 10/25/15.
 */


(function(){

    //Variables
    var ctlr;
    var loca_scope;
    var local_uibModalInstance;
    var local_utils;
    var local_rate_transportista_modal_viewmodel;

    //Constructos
    var modal_init;

    //Methods
    //"Public" Methods
    var modal_ok;
    var modal_cancel;

    //Data Callbacks
    var local_get_pedidos_completados_callback;
    var local_save_all_callback;

    angular.module("easyRuta")
        .controller('RateTransportistaModalController',function($scope,$uibModalInstance,utils,rate_transportista_modal_viewmodel){

            ctlr = this;
            loca_scope = $scope;
            local_uibModalInstance = $uibModalInstance;
            local_utils = utils;
            local_rate_transportista_modal_viewmodel = rate_transportista_modal_viewmodel;

            ctlr.ok = modal_ok;
            ctlr.cancel = modal_cancel;

            modal_init();
        });

    //Constructor
    modal_init= function(){
        local_rate_transportista_modal_viewmodel.get_pedidos_completados(local_get_pedidos_completados_callback)
    };

    //Methods

    //"Public" Methods
    modal_ok = function () {
        local_rate_transportista_modal_viewmodel.save_all(ctlr.pedidos,local_save_all_callback);
    };
    modal_cancel = function () {
        local_uibModalInstance.dismiss('cancel');
    };

    //Data Callbacks
    local_get_pedidos_completados_callback = function(error,results){
        if (!error){
            ctlr.pedidos = results;
            loca_scope.$apply()
        }
    };
    local_save_all_callback = function(error,results){
        if (!error) {
            local_uibModalInstance.close();
        }else{

            //TODO - let user know
        }
    }
})();