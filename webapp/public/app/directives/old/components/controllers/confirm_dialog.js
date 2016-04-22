/**
 * Created by dcoellar on 11/26/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_scope;
    var local_uibModalInstance;

    // Constructor
    var init;

    // "Public" methods
    var confirmar;
    var cancelar;

    angular.module("easyRuta")
        .controller('ConfirmDialogController',function($scope,$uibModalInstance){

            ctlr = this;
            local_scope = $scope;
            local_uibModalInstance = $uibModalInstance;

            ctlr.confirmar = confirmar;
            ctlr.cancelar = cancelar;

            init();
        });

    init = function(){
        ctlr.Message = local_scope.confirm_message;
    };

    confirmar = function(){
        local_uibModalInstance.close('ok');
    };
    cancelar = function(){
        local_uibModalInstance.dismiss('cancel');
    };

})();