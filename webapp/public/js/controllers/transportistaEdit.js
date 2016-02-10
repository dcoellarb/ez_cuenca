/**
 * Created by dcoellar on 12/15/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_rootScope;
    var local_scope;
    var local_window;
    var local_routeParams;
    var local_transportista_edit_viewmodel;

    // Constructor
    var init;

    // "Public" methods
    var save;
    var cancel;
    var borrar;
    var habilitar;
    var deshabilitar;
    var tipoTransporteSeleccionado;

    // Methods

    //Data callbacks
    var get_transportista_callback;
    var get_viajes_count_callback;
    var save_callback;
    var delete_callback;
    var habilitar_callback;
    var deshabilitar_callback;

    angular.module("easyRuta")
        .controller('TransportistaEditController',function($rootScope,$scope,$window,$routeParams,transportista_edit_viewmodel) {

            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_window = $window;
            local_routeParams = $routeParams;
            local_transportista_edit_viewmodel = transportista_edit_viewmodel;

            ctlr.save = save;
            ctlr.cancel = cancel;
            ctlr.delete = borrar;
            ctlr.habilitar = habilitar;
            ctlr.deshabilitar = deshabilitar;
            ctlr.TipoTransporteSeleccionado = tipoTransporteSeleccionado;

            init();
        });

    // Constructor
    init = function() {
        if (local_routeParams.id){
            local_transportista_edit_viewmodel.get_transportista(local_routeParams.id,get_transportista_callback);
        }
    };

    // "Public" methods
    save = function() {
        var fileUploadControl = $("#image")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = file.name;
            local_transportista_edit_viewmodel.save(ctlr.transportista,name,file,save_callback);
        }else{
            local_transportista_edit_viewmodel.save(ctlr.transportista,null,null,save_callback);
        }

    };
    cancel = function() {
        local_window.history.back();
    };
    borrar = function() {
        local_transportista_edit_viewmodel.delete(ctlr.transportista,delete_callback);
    };
    habilitar = function(){
        local_transportista_edit_viewmodel.habilitar(ctlr.transportista,habilitar_callback);
    };
    deshabilitar = function(){
        local_transportista_edit_viewmodel.deshabilitar(ctlr.transportista,habilitar_callback);
    };
    tipoTransporteSeleccionado = function(tipoTransporte){
        ctlr.transportista.tipoTransporte = tipoTransporte;
        local_scope.$apply()
    };
    // Methods

    //Data callbacks
    get_transportista_callback = function(error,results){
        if (!error) {
            ctlr.transportista = results;
            local_transportista_edit_viewmodel.get_viajes_count(results.object,get_viajes_count_callback);
        }
    };
    get_viajes_count_callback = function(error,result){
        if (ctlr.transportista.estado == local_rootScope.transportistas_estados.NoDisponible){
            ctlr.showHabilitar = true
            ctlr.showDeshabilitar = false
        }else if (ctlr.transportista.estado == local_rootScope.transportistas_estados.EnViaje){
            if (result > 0){
                ctlr.showHabilitar = false
            } else {
                ctlr.showHabilitar = true
            }
            ctlr.showDeshabilitar = false
        }else{
            ctlr.showHabilitar = false
            ctlr.showDeshabilitar = true
        }
        local_scope.$apply()
    };
    save_callback = function(error,result){
        if (!error){
            local_window.history.back();
        }
    };
    delete_callback = function(error,result){
        if (!error){
            local_window.history.back();
        }
    };
    habilitar_callback = function(error,result){
        if (!error){
            local_window.history.back();
        }
    };
    deshabilitar_callback = function(error,result){
        if (!error){
            local_window.history.back();
        }
    };
})();
