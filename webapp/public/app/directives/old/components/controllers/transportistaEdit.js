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
    var add_asignacion;
    var delete_asignacion;

    // Methods

    //Data callbacks
    var get_transportista_callback;
    var get_viajes_count_callback;
    var get_asignaciones_transportista_callback;
    var get_asignaciones_proveedor_callback;
    var save_callback;
    var delete_callback;
    var habilitar_callback;
    var deshabilitar_callback;
    var add_asignacion_callback;
    var delete_asignacion_callback;

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
            ctlr.AddAsignacion = add_asignacion;
            ctlr.DeleteAsignacion = delete_asignacion;

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
    habilitar = function(id){
        if (id){
            ctlr.assignaciones.forEach(function(element,index,array){
                if (element.id == id){
                    ctlr.cliente = element.object;
                }
            });
        }
        local_transportista_edit_viewmodel.habilitar(ctlr.transportista,ctlr.cliente,habilitar_callback);
    };
    deshabilitar = function(){
        local_transportista_edit_viewmodel.deshabilitar(ctlr.transportista,habilitar_callback);
    };
    tipoTransporteSeleccionado = function(tipoTransporte){
        ctlr.transportista.tipoTransporte = tipoTransporte;
    };
    add_asignacion = function(id){
        var empresa;
        ctlr.assignaciones_proveedor.forEach(function(element,index,array){
            if (element.id == id){
                empresa = element;
            }
        });
        if (empresa){
            local_transportista_edit_viewmodel.add_asignacion(ctlr.transportista.object,empresa,add_asignacion_callback);
        }
    };
    delete_asignacion = function(id){
        var empresa;
        ctlr.assignaciones.forEach(function(element,index,array){
            if (element.id == id){
                empresa = element;
            }
        });
        if (empresa){
            local_transportista_edit_viewmodel.delete_asignacion(ctlr.transportista.object,empresa,delete_asignacion_callback);
        }
    };
    // Methods

    //Data callbacks
    get_transportista_callback = function(error,results){
        if (!error) {
            ctlr.transportista = results;
            ctlr.isDespachador = false
            if (local_rootScope.despachador){
                ctlr.isDespachador = true
                ctlr.cliente = local_rootScope.cliente;
            }else{
                local_transportista_edit_viewmodel.get_asignaciones_transportista(results.object,get_asignaciones_transportista_callback);
            }
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
    get_asignaciones_transportista_callback = function(error,result){
        ctlr.assignaciones = result;
        local_transportista_edit_viewmodel.get_asignaciones_proveedor(local_rootScope.proveedor,get_asignaciones_proveedor_callback);
    };
    get_asignaciones_proveedor_callback = function(error,result){
        ctlr.assignaciones_proveedor = []
        result.forEach(function (element,index,array){
            var found = false;
            ctlr.assignaciones.forEach(function (e,i,a){
                if (element.id == e.id){
                    found = true;
                }
            });
            if (!found){
                ctlr.assignaciones_proveedor.push(element);
            }
        });
        local_scope.$apply();
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
    add_asignacion_callback = function(error,result){
        if (!error){
            local_transportista_edit_viewmodel.get_asignaciones_transportista(ctlr.transportista.object,get_asignaciones_transportista_callback);
        }
    };
    delete_asignacion_callback = function(error,result){
        if (!error){
            local_transportista_edit_viewmodel.get_asignaciones_transportista(ctlr.transportista.object,get_asignaciones_transportista_callback);
        }
    };
})();
