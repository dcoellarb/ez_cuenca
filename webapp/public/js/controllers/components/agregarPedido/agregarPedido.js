/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    // Variables
    var ctlr;
    var local_rootScope;
    var local_scope;
    var local_uibModal;
    var local_agregar_pedido_viewmodel;
    var local_form;

    var modal_ctlr;
    var modal_local_scope;
    var modal_local_uibModalInstance;

    // Constructor
    var init;
    var modal_init;

    // "Public" methods
    var agregar;
    var guardar_como_plantilla;
    var limpiar;
    var tipo_transportista_seleccionado;
    var change_unidad;
    var plantilla_selected;
    var delete_plantilla;
    var toggle_form;

    var modal_guardar_plantilla;
    var modal_cancelar;

    // Methods
    var limpiar_form;
    var setup_date_pickers;
    var get_active_transportistas;
    var guardar_pedido;

    //View Controller callbacks references
    var guardar_pedido_callback;

    //Data callbacks
    var local_get_cliente_proveedores_callback;
    var local_get_plantillas_callback;
    var local_get_ciudades_callback;
    var local_get_active_transportistas_callback;
    var local_guardar_pedido_callback;
    var local_agregar_guardar_pedido_callback;
    var local_plantilla_guardar_pedido_callback;
    var local_get_plantilla_callback;
    var local_delete_plantilla_callback;

    //Notifications callbacks
    var presense_new_pedidos_callback;

    angular.module("easyRuta")
        .controller('AgregarPedidoController',function($rootScope,$scope,$uibModal,agregar_pedido_viewmodel){

            ctlr = this;
            local_rootScope = $rootScope;
            local_scope = $scope;
            local_uibModal = $uibModal;
            local_agregar_pedido_viewmodel = agregar_pedido_viewmodel;

            ctlr.Agregar = agregar;
            ctlr.GuardarComoPlantilla = guardar_como_plantilla;
            ctlr.Limpiar = limpiar;
            ctlr.TipoTransporteSeleccionado = tipo_transportista_seleccionado;
            ctlr.ChangeUnidad = change_unidad;
            ctlr.PlantillaSelected = plantilla_selected;
            ctlr.DeletePlantilla  = delete_plantilla
            ctlr.ToggleForm = toggle_form;

            init();

        })
        .controller('AgregarPedidoModalController',function($scope,$uibModalInstance){

            modal_ctlr = this;
            modal_local_scope = $scope;
            modal_local_uibModalInstance = $uibModalInstance;

            modal_ctlr.guardar = modal_guardar_plantilla;
            modal_ctlr.cancelar = modal_cancelar;

            modal_init();
        });

    // Constructor
    init = function() {
        local_agregar_pedido_viewmodel.get_cliente_proveedores(local_rootScope.cliente,local_get_cliente_proveedores_callback);
        local_agregar_pedido_viewmodel.get_plantillas(local_get_plantillas_callback);
        local_agregar_pedido_viewmodel.get_ciudades(local_get_ciudades_callback);

        local_rootScope.$on('presense_' + local_rootScope.channels.new_pedidos, presense_new_pedidos_callback);

        ctlr.availableTransportistas = 0;
        ctlr.open = false;
        ctlr.minDate = new Date();

        setup_date_pickers();
        limpiar_form();
    };
    modal_init = function(){
        modal_ctlr.plantilla = "";
    };

    // "Public" methods
    agregar = function (form) {
        local_form = form;
        if (local_form.$valid) {
            ctlr.data.Plantilla = "";
            ctlr.data.Estado = "Pendiente";
            guardar_pedido(local_agregar_guardar_pedido_callback);
        }
    };
    guardar_como_plantilla = function (form) {
        local_form = form;
        if (local_form.$valid) {
            var modalInstance = local_uibModal.open({
                animation: local_scope.animationsEnabled,
                templateUrl: 'PlantillaModal.html',
                controller: 'AgregarPedidoModalController as agrPedModalCtlr'
            });

            modalInstance.result.then(function (plantilla) {
                ctlr.data.Plantilla = plantilla;
                ctlr.data.Estado = "Plantilla";
                guardar_pedido(local_plantilla_guardar_pedido_callback)
            }, function () {
                console.log("Modal canceled.");
            });
        }
    };
    limpiar = function (form) {
        local_form = form;
        limpiar_form();
    };
    tipo_transportista_seleccionado = function (TipoTransporte) {
        ctlr.data.TipoTransporte = TipoTransporte;
    };
    change_unidad = function (unidad) {
        ctlr.data.TipoUnidad = unidad;
        if (unidad == "peso") {
            $('#unidades_container').hide();
            $('#peso_container').show();
        } else {
            $('#unidades_container').show();
            $('#peso_container').hide();
        }
    };
    plantilla_selected = function (id) {
        local_agregar_pedido_viewmodel.get_plantilla(id,local_get_plantilla_callback);
    };
    delete_plantilla = function (id) {
        local_agregar_pedido_viewmodel.delete_plantilla(id,local_delete_plantilla_callback);
    };
    toggle_form = function() {
        if ($('#agregarPedido').hasClass("panel-primary")){
            $('#agregarPedido').removeClass('panel-primary');
            $('#agregarPedido').addClass('panel-default');
            $('#inputCiudadOrigen').focus();
            ctlr.open = true;
        }else{
            $('#agregarPedido').removeClass('panel-default');
            $('#agregarPedido').addClass('panel-primary');
            ctlr.open = false;
        }
    }

    modal_guardar_plantilla = function(){
        modal_local_uibModalInstance.close(modal_ctlr.plantilla);
    };
    modal_cancelar = function(){
        modal_local_uibModalInstance.dismiss('cancel');
    };

    // Methods
    limpiar_form = function (){
        ctlr.copias = 1;
        ctlr.data = {
            Plantilla : "",
            CiudadOrigen : "",
            DireccionOrigen : "",
            CiudadDestino : "",
            DireccionDestino : "",
            HoraCarga : new Date(),
            HoraEntrega : new Date(),
            Producto : "",
            Valor : 0,
            TipoUnidad : "peso",
            PesoDesde : 0,
            PesoHasta : 0,
            Unidades : 0,
            TipoTransporte : "furgon",
            ExtensionMinima : 43,
            CajaRefrigerada : false,
            CubicajeMinimo : 0
        };
        if (local_form){
            local_form.$setPristine();
        }
    }
    setup_date_pickers = function(){
        /*
         * Setup hora max carga date picker
         * */
        local_scope.horaMaxCargaOpen = function($event) {
            local_scope.horaMaxCargaStatus.opened = true;
        };
        local_scope.horaMaxCargaStatus = {
            opened: false
        };

        /*
         * Setup hora max carga date picker
         * */
        local_scope.horaMaxDescargaOpen = function($event) {
            local_scope.horaMaxDescargaStatus.opened = true;
        };
        local_scope.horaMaxDescargaStatus = {
            opened: false
        };
    }
    get_active_transportistas = function(){
        local_agregar_pedido_viewmodel.get_active_transportistas(local_get_active_transportistas_callback);
    }
    guardar_pedido = function(callback){
        guardar_pedido_callback = callback
        var proveedor = null;
        if (ctlr.data.Proveedor && ctlr.data.Proveedor != "") {
            ctlr.proveedores.forEach(function (element, index, array) {
                if (element.id = ctlr.data.Proveedor) {
                    proveedor = element.data;
                }
            });
        }
        local_agregar_pedido_viewmodel.guardar_pedidos(ctlr.data,proveedor,ctlr.copias,local_guardar_pedido_callback);
    };

    //Data callbacks
    local_get_cliente_proveedores_callback = function(error,results){
        if (!error){
            ctlr.proveedores = results;
            local_scope.$apply();
        }
    };
    local_get_plantillas_callback = function(error,results){
        if (!error){
            ctlr.plantillas = results;
            local_scope.$apply();
        }
    };
    local_get_ciudades_callback = function(error,results){
        if (!error){
            ctlr.ciudades = results;
            local_scope.$apply();
        }
    };
    local_get_active_transportistas_callback = function(results){
        ctlr.availableTransportistas = results;
        local_scope.$apply();
    };
    local_guardar_pedido_callback = function(error,results){
        guardar_pedido_callback(error,results);
    };
    local_agregar_guardar_pedido_callback  = function(error,results){
        if (!error){
            $('#agregarPedidBody').collapse("hide");
            $('#agregarPedido').removeClass('panel-default');
            $('#agregarPedido').addClass('panel-primary');
            ctlr.open = false;
            limpiar_form();
        }
    };
    local_plantilla_guardar_pedido_callback = function(error,results){
        if (!error){
            ctlr.plantillas.push({id: results[0].id, plantilla: results[0].get('Plantilla')});
            local_scope.$apply();
        }
    };
    local_get_plantilla_callback = function(error,results){
        if (results) {
            ctlr.data = {
                Plantilla: ctlr.plantilla,
                CiudadOrigen: results.get("CiudadOrigen").id,
                DireccionOrigen: results.get("DireccionOrigen"),
                CiudadDestino: results.get("CiudadDestino").id,
                DireccionDestino: results.get("DireccionDestino"),
                HoraCarga: results.get("HoraCarga"),
                HoraEntrega: results.get("HoraEntrega"),
                Producto: results.get("Producto"),
                Valor: results.get("Valor"),
                TipoUnidad: results.get("TipoUnidad"),
                PesoDesde: results.get("PesoDesde"),
                PesoHasta: results.get("PesoHasta"),
                Unidades: results.get("Unidades"),
                TipoTransporte: results.get("TipoTransporte"),
                ExtensionMinima: results.get("ExtensionMin"),
                CajaRefrigerada: results.get("CajaRefrigerada"),
                CubicajeMinimo: results.get("CubicajeMin"),
            };

            if (results.get("Proveedor")){
                Proveedor : results.get("Proveedor").id
            }

            local_scope.$apply();
        }
    };
    local_delete_plantilla_callback = function(error,results){
        if (!error){
            var i;
            ctlr.plantillas.forEach(function(element,index,array){
                if (element.id = id){
                    i = index;
                }
            });
            if (i) {
                ctlr.plantillas.splice(i, 1);
                local_scope.$apply();
            }
        }
    };

    //Notifications callbacks
    presense_new_pedidos_callback  = function(event, args) {
        get_active_transportistas();
    };

})();